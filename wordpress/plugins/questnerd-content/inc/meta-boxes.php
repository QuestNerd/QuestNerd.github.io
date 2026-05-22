<?php
/**
 * Meta-box editors for the QuestNerd CPTs.
 *
 * Kept intentionally small — Gutenberg already handles title/body/featured
 * image, so these boxes only surface the QuestNerd-specific fields.
 *
 * @package QuestNerdContent
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

function qnc_register_meta_boxes() {
	add_meta_box( 'qnc_product_box', __( 'Product details', 'questnerd-content' ), 'qnc_render_product_box', 'qn_product', 'normal', 'high' );
	add_meta_box( 'qnc_project_box', __( 'Project details', 'questnerd-content' ), 'qnc_render_project_box', 'qn_project', 'normal', 'high' );
	add_meta_box( 'qnc_filament_box', __( 'Filament details', 'questnerd-content' ), 'qnc_render_filament_box', 'qn_filament', 'normal', 'high' );
}
add_action( 'add_meta_boxes', 'qnc_register_meta_boxes' );

function qnc_field( $post, $key, $label, $type = 'text', $help = '' ) {
	$id   = 'qnc_' . trim( $key, '_' );
	$val  = get_post_meta( $post->ID, $key, true );
	echo '<p style="margin:1em 0">';
	echo '<label for="' . esc_attr( $id ) . '" style="display:block;font-weight:600;margin-bottom:.25em;">' . esc_html( $label ) . '</label>';
	if ( 'textarea' === $type ) {
		echo '<textarea rows="4" style="width:100%" name="' . esc_attr( $key ) . '" id="' . esc_attr( $id ) . '">' . esc_textarea( $val ) . '</textarea>';
	} elseif ( 'checkbox' === $type ) {
		echo '<input type="checkbox" name="' . esc_attr( $key ) . '" id="' . esc_attr( $id ) . '" value="1" ' . checked( $val, '1', false ) . '>';
	} elseif ( 'select-type' === $type ) {
		$opts = array(
			''            => __( '— choose —', 'questnerd-content' ),
			'cults3d'     => 'cults3d (Cults3D listing)',
			'etsy'        => 'etsy (Etsy listing)',
			'googleplay'  => 'googleplay (Google Play listing)',
			'pc-download' => 'pc-download (free or direct download)',
			'stripe'      => 'stripe (paid via Stripe Checkout)',
		);
		echo '<select name="' . esc_attr( $key ) . '" id="' . esc_attr( $id ) . '">';
		foreach ( $opts as $k => $lbl ) {
			echo '<option value="' . esc_attr( $k ) . '"' . selected( $val, $k, false ) . '>' . esc_html( $lbl ) . '</option>';
		}
		echo '</select>';
	} else {
		echo '<input type="text" style="width:100%" name="' . esc_attr( $key ) . '" id="' . esc_attr( $id ) . '" value="' . esc_attr( $val ) . '">';
	}
	if ( $help ) {
		echo '<span class="description" style="display:block;margin-top:.25em;color:#646970;">' . esc_html( $help ) . '</span>';
	}
	echo '</p>';
}

function qnc_render_product_box( $post ) {
	wp_nonce_field( 'qnc_save_product', 'qnc_product_nonce' );
	qnc_field( $post, '_qn_type',             __( 'Type', 'questnerd-content' ), 'select-type', __( 'How a buyer reaches this item.', 'questnerd-content' ) );
	qnc_field( $post, '_qn_description',      __( 'Short description (card)', 'questnerd-content' ), 'textarea' );
	qnc_field( $post, '_qn_long_description', __( 'Long description (detail page)', 'questnerd-content' ), 'textarea' );
	qnc_field( $post, '_qn_story',            __( 'Story (detail page narrative)', 'questnerd-content' ), 'textarea' );
	qnc_field( $post, '_qn_price',            __( 'Price (display string, e.g. "$5.00" or "Free")', 'questnerd-content' ) );
	qnc_field( $post, '_qn_featured',         __( 'Featured on homepage?', 'questnerd-content' ), 'checkbox' );
	qnc_field( $post, '_qn_url',              __( 'External URL (Cults3D / Etsy / Google Play / direct download)', 'questnerd-content' ) );
	qnc_field( $post, '_qn_image',            __( 'Image URL (overrides the featured image if set)', 'questnerd-content' ), 'text', __( 'Optional — usually set the Featured Image instead.', 'questnerd-content' ) );
	qnc_field( $post, '_qn_model',            __( '3D model URL (.glb / .gltf) — enables model-viewer', 'questnerd-content' ) );
	qnc_field( $post, '_qn_stripe_price_id',  __( 'Stripe Price ID (price_…) — for `stripe` type only', 'questnerd-content' ) );

	// Specs (label/value rows) and FAQ (q/a rows) are stored as JSON in
	// a textarea — easiest universal editor. The data is parsed/sanitized
	// on save.
	echo '<p><label style="display:block;font-weight:600;margin-bottom:.25em;">' . esc_html__( 'Specs (JSON array of {label,value})', 'questnerd-content' ) . '</label>';
	echo '<textarea rows="5" style="width:100%;font-family:monospace" name="_qn_specs">' .
		esc_textarea( wp_json_encode( get_post_meta( $post->ID, '_qn_specs', true ) ?: array(), JSON_PRETTY_PRINT ) ) .
		'</textarea>';
	echo '<span class="description">e.g. [{"label":"Format","value":"STL"}]</span></p>';

	echo '<p><label style="display:block;font-weight:600;margin-bottom:.25em;">' . esc_html__( 'FAQ (JSON array of {q,a})', 'questnerd-content' ) . '</label>';
	echo '<textarea rows="5" style="width:100%;font-family:monospace" name="_qn_faq">' .
		esc_textarea( wp_json_encode( get_post_meta( $post->ID, '_qn_faq', true ) ?: array(), JSON_PRETTY_PRINT ) ) .
		'</textarea></p>';
}

function qnc_render_project_box( $post ) {
	wp_nonce_field( 'qnc_save_project', 'qnc_project_nonce' );
	qnc_field( $post, '_qn_date',        __( 'Date (e.g. "2026-01")', 'questnerd-content' ) );
	qnc_field( $post, '_qn_role',        __( 'Role', 'questnerd-content' ) );
	qnc_field( $post, '_qn_summary',     __( 'Summary (card subtitle)', 'questnerd-content' ), 'textarea' );
	qnc_field( $post, '_qn_image',       __( 'Image URL (overrides featured image)', 'questnerd-content' ) );
	qnc_field( $post, '_qn_money_spent', __( 'Money spent', 'questnerd-content' ) );
	qnc_field( $post, '_qn_money_saved', __( 'Money saved', 'questnerd-content' ) );
	qnc_field( $post, '_qn_duration',    __( 'Duration', 'questnerd-content' ) );
	qnc_field( $post, '_qn_outcome',     __( 'Outcome', 'questnerd-content' ) );

	echo '<p><label style="display:block;font-weight:600;margin-bottom:.25em;">' . esc_html__( 'Tech (JSON array of strings)', 'questnerd-content' ) . '</label>';
	echo '<textarea rows="3" style="width:100%;font-family:monospace" name="_qn_tech">' .
		esc_textarea( wp_json_encode( get_post_meta( $post->ID, '_qn_tech', true ) ?: array() ) ) .
		'</textarea>';
	echo '<span class="description">e.g. ["React","Stripe","Bambu X1C"]</span></p>';
}

function qnc_render_filament_box( $post ) {
	wp_nonce_field( 'qnc_save_filament', 'qnc_filament_nonce' );
	qnc_field( $post, '_qn_hex',       __( 'Hex color (e.g. #ff8800)', 'questnerd-content' ) );
	qnc_field( $post, '_qn_material',  __( 'Material (PLA / PETG / TPU / …)', 'questnerd-content' ) );
	qnc_field( $post, '_qn_available', __( 'Available?', 'questnerd-content' ), 'checkbox' );
}

/**
 * Save handler — wired to all three CPTs.
 */
function qnc_save_meta( $post_id, $post ) {
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) { return; }
	if ( ! current_user_can( 'edit_post', $post_id ) ) { return; }

	$type = $post->post_type;
	if ( 'qn_product' === $type && isset( $_POST['qnc_product_nonce'] ) && wp_verify_nonce( $_POST['qnc_product_nonce'], 'qnc_save_product' ) ) {
		qnc_save_string_keys( $post_id, array( '_qn_type', '_qn_description', '_qn_long_description', '_qn_story', '_qn_price', '_qn_url', '_qn_image', '_qn_model', '_qn_stripe_price_id' ) );
		update_post_meta( $post_id, '_qn_featured', isset( $_POST['_qn_featured'] ) ? '1' : '0' );
		qnc_save_json_key( $post_id, '_qn_specs', 'qnc_sanitize_kv_list' );
		qnc_save_json_key( $post_id, '_qn_faq',   'qnc_sanitize_qa_list' );
	} elseif ( 'qn_project' === $type && isset( $_POST['qnc_project_nonce'] ) && wp_verify_nonce( $_POST['qnc_project_nonce'], 'qnc_save_project' ) ) {
		qnc_save_string_keys( $post_id, array( '_qn_date', '_qn_role', '_qn_summary', '_qn_image', '_qn_money_spent', '_qn_money_saved', '_qn_duration', '_qn_outcome' ) );
		qnc_save_json_key( $post_id, '_qn_tech', 'qnc_sanitize_string_array' );
	} elseif ( 'qn_filament' === $type && isset( $_POST['qnc_filament_nonce'] ) && wp_verify_nonce( $_POST['qnc_filament_nonce'], 'qnc_save_filament' ) ) {
		qnc_save_string_keys( $post_id, array( '_qn_hex', '_qn_material' ) );
		update_post_meta( $post_id, '_qn_available', isset( $_POST['_qn_available'] ) ? '1' : '0' );
	}
}
add_action( 'save_post', 'qnc_save_meta', 10, 2 );

function qnc_save_string_keys( $post_id, $keys ) {
	foreach ( $keys as $k ) {
		if ( isset( $_POST[ $k ] ) ) {
			$v = is_string( $_POST[ $k ] ) ? wp_kses_post( wp_unslash( $_POST[ $k ] ) ) : '';
			update_post_meta( $post_id, $k, $v );
		}
	}
}

function qnc_save_json_key( $post_id, $key, $sanitizer ) {
	if ( ! isset( $_POST[ $key ] ) ) { return; }
	$raw = wp_unslash( $_POST[ $key ] );
	$decoded = json_decode( $raw, true );
	if ( ! is_array( $decoded ) ) { $decoded = array(); }
	$decoded = call_user_func( $sanitizer, $decoded );
	update_post_meta( $post_id, $key, $decoded );
}
