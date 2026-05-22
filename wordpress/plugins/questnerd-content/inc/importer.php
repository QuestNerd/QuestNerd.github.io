<?php
/**
 * QuestNerd → Import screen.
 *
 * One-shot importer that reads:
 *   - content/products/*.json   →  qn_product posts
 *   - content/projects/*.json   →  qn_project posts
 *   - content/filaments/*.json  →  qn_filament posts
 *   - content/settings/makerworld-print.json  →  qn_makerworld_settings option
 *
 * Run from WP-Admin → QuestNerd → Import, or via WP-CLI:
 *
 *   wp questnerd import --dir=/path/to/QuestNerd.github.io/content
 *
 * Idempotent: re-running re-uses existing posts by slug (the JSON `id`
 * field) instead of creating duplicates. Pass `--update` to overwrite
 * existing posts; otherwise only missing posts are created.
 *
 * @package QuestNerdContent
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

function qnc_register_importer_page() {
	add_submenu_page(
		'edit.php?post_type=qn_product',
		__( 'Import from JSON', 'questnerd-content' ),
		__( 'Import', 'questnerd-content' ),
		'manage_options',
		'qnc-import',
		'qnc_render_importer_page'
	);
}
add_action( 'admin_menu', 'qnc_register_importer_page' );

function qnc_render_importer_page() {
	if ( ! current_user_can( 'manage_options' ) ) { return; }

	$result = null;
	if ( isset( $_POST['qnc_import_nonce'] ) && wp_verify_nonce( $_POST['qnc_import_nonce'], 'qnc_run_import' ) ) {
		$dir    = isset( $_POST['qnc_dir'] ) ? sanitize_text_field( wp_unslash( $_POST['qnc_dir'] ) ) : '';
		$update = ! empty( $_POST['qnc_update'] );
		$result = qnc_run_import( $dir, $update );
	}

	$default_dir = ABSPATH . 'content';
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'Import QuestNerd content from JSON', 'questnerd-content' ); ?></h1>
		<p class="description">
			<?php esc_html_e( 'Point this at a folder containing the static-site `content/` directory (with products/, projects/, filaments/, settings/ subfolders).', 'questnerd-content' ); ?>
		</p>
		<form method="post">
			<?php wp_nonce_field( 'qnc_run_import', 'qnc_import_nonce' ); ?>
			<table class="form-table">
				<tr>
					<th><label for="qnc_dir"><?php esc_html_e( 'Content directory (server path)', 'questnerd-content' ); ?></label></th>
					<td>
						<input type="text" name="qnc_dir" id="qnc_dir" class="regular-text" value="<?php echo esc_attr( $default_dir ); ?>">
						<p class="description"><?php echo esc_html( $default_dir ); ?> &nbsp;or any absolute path on the server.</p>
					</td>
				</tr>
				<tr>
					<th><label for="qnc_update"><?php esc_html_e( 'Update existing items?', 'questnerd-content' ); ?></label></th>
					<td>
						<label><input type="checkbox" name="qnc_update" id="qnc_update" value="1"> <?php esc_html_e( 'Overwrite existing posts with the same slug', 'questnerd-content' ); ?></label>
					</td>
				</tr>
			</table>
			<?php submit_button( __( 'Run import', 'questnerd-content' ) ); ?>
		</form>

		<?php if ( $result ) : ?>
			<h2><?php esc_html_e( 'Import results', 'questnerd-content' ); ?></h2>
			<pre style="background:#fff;border:1px solid #ccd0d4;padding:1em;max-height:30em;overflow:auto;"><?php echo esc_html( implode( "\n", $result['log'] ) ); ?></pre>
			<p><strong><?php echo esc_html( sprintf(
				/* translators: 1: created, 2: updated, 3: skipped */
				__( 'Created: %1$d. Updated: %2$d. Skipped (already exists): %3$d.', 'questnerd-content' ),
				$result['created'], $result['updated'], $result['skipped']
			) ); ?></strong></p>
		<?php endif; ?>
	</div>
	<?php
}

/**
 * Importer core. Returns an array { created, updated, skipped, log }.
 */
function qnc_run_import( $dir, $update_existing = false ) {
	$out = array( 'created' => 0, 'updated' => 0, 'skipped' => 0, 'log' => array() );
	$dir = rtrim( $dir, '/\\' );
	if ( ! $dir || ! is_dir( $dir ) ) {
		$out['log'][] = 'Directory not found: ' . $dir;
		return $out;
	}

	$collections = array(
		'products'  => array( 'cpt' => 'qn_product',  'mapper' => 'qnc_import_product_record' ),
		'projects'  => array( 'cpt' => 'qn_project',  'mapper' => 'qnc_import_project_record' ),
		'filaments' => array( 'cpt' => 'qn_filament', 'mapper' => 'qnc_import_filament_record' ),
	);

	foreach ( $collections as $sub => $cfg ) {
		$collection_dir = $dir . '/' . $sub;
		if ( ! is_dir( $collection_dir ) ) {
			$out['log'][] = "skip: no $sub directory";
			continue;
		}
		$files = glob( $collection_dir . '/*.json' );
		if ( ! $files ) {
			$out['log'][] = "skip: no JSON files in $sub";
			continue;
		}
		foreach ( $files as $file ) {
			$base = basename( $file );
			if ( 'index.json' === $base ) { continue; }
			$raw  = file_get_contents( $file );
			$data = json_decode( $raw, true );
			if ( ! is_array( $data ) ) {
				$out['log'][] = "skip: $sub/$base (invalid JSON)";
				continue;
			}
			$res = call_user_func( $cfg['mapper'], $data, $cfg['cpt'], $update_existing );
			$out[ $res['status'] ] ++;
			$out['log'][] = "$sub/$base → " . $res['status'] . ' (post #' . (int) $res['post_id'] . ')';
		}
	}

	// MakerWorld settings singleton.
	$mw_file = $dir . '/settings/makerworld-print.json';
	if ( is_file( $mw_file ) ) {
		$data = json_decode( file_get_contents( $mw_file ), true );
		if ( is_array( $data ) ) {
			update_option( 'qn_makerworld_settings', $data );
			$out['log'][] = 'imported settings/makerworld-print.json → qn_makerworld_settings option';
		}
	}

	return $out;
}

/**
 * Look up or create a post by slug + CPT. Returns array { post_id, created }.
 */
function qnc_upsert_post( $cpt, $slug, $title, $update_existing ) {
	$existing = get_page_by_path( $slug, OBJECT, $cpt );
	if ( $existing ) {
		if ( $update_existing ) {
			wp_update_post( array( 'ID' => $existing->ID, 'post_title' => $title ) );
			return array( 'post_id' => $existing->ID, 'status' => 'updated' );
		}
		return array( 'post_id' => $existing->ID, 'status' => 'skipped' );
	}
	$id = wp_insert_post( array(
		'post_type'   => $cpt,
		'post_status' => 'publish',
		'post_title'  => $title,
		'post_name'   => $slug,
	), true );
	if ( is_wp_error( $id ) ) {
		return array( 'post_id' => 0, 'status' => 'skipped' );
	}
	return array( 'post_id' => $id, 'status' => 'created' );
}

function qnc_import_product_record( $data, $cpt, $update_existing ) {
	$slug  = isset( $data['id'] ) ? sanitize_title( $data['id'] ) : '';
	$title = isset( $data['title'] ) ? $data['title'] : ( $slug ? $slug : __( 'Untitled product', 'questnerd-content' ) );
	if ( ! $slug ) { return array( 'post_id' => 0, 'status' => 'skipped' ); }

	$res = qnc_upsert_post( $cpt, $slug, $title, $update_existing );
	if ( 'skipped' === $res['status'] || ! $res['post_id'] ) { return $res; }

	$meta_map = array(
		'_qn_type'             => isset( $data['type'] )            ? $data['type']            : '',
		'_qn_description'      => isset( $data['description'] )     ? $data['description']     : '',
		'_qn_long_description' => isset( $data['longDescription'] ) ? $data['longDescription'] : '',
		'_qn_story'            => isset( $data['story'] )           ? $data['story']           : '',
		'_qn_price'            => isset( $data['price'] )           ? $data['price']           : '',
		'_qn_image'            => isset( $data['image'] )           ? $data['image']           : '',
		'_qn_url'              => isset( $data['url'] )             ? $data['url']             : '',
		'_qn_model'            => isset( $data['model'] )           ? $data['model']           : '',
		'_qn_stripe_price_id'  => isset( $data['stripePriceId'] )   ? $data['stripePriceId']   : '',
	);
	foreach ( $meta_map as $k => $v ) { update_post_meta( $res['post_id'], $k, $v ); }
	update_post_meta( $res['post_id'], '_qn_featured', ! empty( $data['featured'] ) ? '1' : '0' );
	if ( isset( $data['specs'] ) && is_array( $data['specs'] ) ) {
		update_post_meta( $res['post_id'], '_qn_specs', qnc_sanitize_kv_list( $data['specs'] ) );
	}
	if ( isset( $data['faq'] ) && is_array( $data['faq'] ) ) {
		update_post_meta( $res['post_id'], '_qn_faq', qnc_sanitize_qa_list( $data['faq'] ) );
	}
	if ( isset( $data['tags'] ) && is_array( $data['tags'] ) ) {
		wp_set_object_terms( $res['post_id'], $data['tags'], 'qn_tag', false );
	}
	return $res;
}

function qnc_import_project_record( $data, $cpt, $update_existing ) {
	$slug  = isset( $data['id'] ) ? sanitize_title( $data['id'] ) : '';
	$title = isset( $data['title'] ) ? $data['title'] : ( $slug ? $slug : __( 'Untitled project', 'questnerd-content' ) );
	if ( ! $slug ) { return array( 'post_id' => 0, 'status' => 'skipped' ); }

	$res = qnc_upsert_post( $cpt, $slug, $title, $update_existing );
	if ( 'skipped' === $res['status'] || ! $res['post_id'] ) { return $res; }

	if ( isset( $data['story'] ) ) {
		wp_update_post( array( 'ID' => $res['post_id'], 'post_content' => wp_kses_post( $data['story'] ) ) );
	}

	$meta_map = array(
		'_qn_date'        => isset( $data['date'] )       ? $data['date']       : '',
		'_qn_role'        => isset( $data['role'] )       ? $data['role']       : '',
		'_qn_summary'     => isset( $data['summary'] )    ? $data['summary']    : '',
		'_qn_image'       => isset( $data['image'] )      ? $data['image']      : '',
		'_qn_money_spent' => isset( $data['moneySpent'] ) ? $data['moneySpent'] : '',
		'_qn_money_saved' => isset( $data['moneySaved'] ) ? $data['moneySaved'] : '',
		'_qn_duration'    => isset( $data['duration'] )   ? $data['duration']   : '',
		'_qn_outcome'     => isset( $data['outcome'] )    ? $data['outcome']    : '',
	);
	foreach ( $meta_map as $k => $v ) { update_post_meta( $res['post_id'], $k, $v ); }
	if ( isset( $data['tech'] ) && is_array( $data['tech'] ) ) {
		update_post_meta( $res['post_id'], '_qn_tech', qnc_sanitize_string_array( $data['tech'] ) );
	}
	if ( isset( $data['tags'] ) && is_array( $data['tags'] ) ) {
		wp_set_object_terms( $res['post_id'], $data['tags'], 'qn_tag', false );
	}
	return $res;
}

function qnc_import_filament_record( $data, $cpt, $update_existing ) {
	$slug  = isset( $data['id'] ) ? sanitize_title( $data['id'] ) : '';
	if ( ! $slug && isset( $data['name'] ) ) { $slug = sanitize_title( $data['name'] ); }
	$title = isset( $data['name'] ) ? $data['name'] : $slug;
	if ( ! $slug ) { return array( 'post_id' => 0, 'status' => 'skipped' ); }

	$res = qnc_upsert_post( $cpt, $slug, $title, $update_existing );
	if ( 'skipped' === $res['status'] || ! $res['post_id'] ) { return $res; }

	update_post_meta( $res['post_id'], '_qn_hex',       isset( $data['hex'] )      ? $data['hex']      : '' );
	update_post_meta( $res['post_id'], '_qn_material',  isset( $data['material'] ) ? $data['material'] : 'PLA' );
	update_post_meta( $res['post_id'], '_qn_available', ! empty( $data['available'] ) ? '1' : '0' );
	return $res;
}

/**
 * WP-CLI command:
 *
 *   wp questnerd import --dir=/path/to/content [--update]
 */
if ( defined( 'WP_CLI' ) && WP_CLI ) {
	WP_CLI::add_command( 'questnerd', new class {
		public function import( $args, $assoc ) {
			$dir = isset( $assoc['dir'] ) ? $assoc['dir'] : '';
			if ( ! $dir ) {
				WP_CLI::error( 'Missing --dir' );
			}
			$out = qnc_run_import( $dir, ! empty( $assoc['update'] ) );
			foreach ( $out['log'] as $line ) { WP_CLI::log( $line ); }
			WP_CLI::success( sprintf( 'Created %d, updated %d, skipped %d.', $out['created'], $out['updated'], $out['skipped'] ) );
		}
	} );
}
