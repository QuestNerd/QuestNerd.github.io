<?php
/**
 * Settings → QuestNerd MakerWorld
 *
 * Stores tier definitions and intro copy in the `qn_makerworld_settings`
 * option. The theme reads this via qn_get_makerworld_settings() and
 * exposes it on the front-end as window.QN_MAKERWORLD_OVERRIDES.
 *
 * @package QuestNerdContent
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

function qnc_register_settings_page() {
	add_submenu_page(
		'edit.php?post_type=qn_product',
		__( 'MakerWorld settings', 'questnerd-content' ),
		__( 'MakerWorld', 'questnerd-content' ),
		'manage_options',
		'qnc-makerworld',
		'qnc_render_settings_page'
	);
}
add_action( 'admin_menu', 'qnc_register_settings_page' );

function qnc_register_settings() {
	register_setting( 'qnc_makerworld', 'qn_makerworld_settings', array(
		'type'              => 'array',
		'sanitize_callback' => 'qnc_sanitize_makerworld_settings',
		'default'           => array( 'intro' => '', 'tiers' => array() ),
	) );
}
add_action( 'admin_init', 'qnc_register_settings' );

function qnc_sanitize_makerworld_settings( $value ) {
	$out = array( 'intro' => '', 'tiers' => array() );
	if ( ! is_array( $value ) ) { return $out; }
	if ( isset( $value['intro'] ) ) {
		$out['intro'] = wp_kses_post( $value['intro'] );
	}
	if ( isset( $value['tiers_json'] ) ) {
		$decoded = json_decode( wp_unslash( $value['tiers_json'] ), true );
		if ( is_array( $decoded ) ) {
			foreach ( $decoded as $tier ) {
				if ( ! is_array( $tier ) ) { continue; }
				$out['tiers'][] = array(
					'label'         => isset( $tier['label'] )         ? sanitize_text_field( $tier['label'] )         : '',
					'price'         => isset( $tier['price'] )         ? sanitize_text_field( $tier['price'] )         : '',
					'maxHours'      => isset( $tier['maxHours'] )      ? (float) $tier['maxHours']                     : 0,
					'stripePriceId' => isset( $tier['stripePriceId'] ) ? sanitize_text_field( $tier['stripePriceId'] ) : '',
				);
			}
		}
	}
	return $out;
}

function qnc_render_settings_page() {
	if ( ! current_user_can( 'manage_options' ) ) { return; }
	$current = get_option( 'qn_makerworld_settings', array( 'intro' => '', 'tiers' => array() ) );
	if ( ! is_array( $current ) ) { $current = array( 'intro' => '', 'tiers' => array() ); }
	$tiers_json = wp_json_encode( isset( $current['tiers'] ) ? $current['tiers'] : array(), JSON_PRETTY_PRINT );
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'QuestNerd MakerWorld settings', 'questnerd-content' ); ?></h1>
		<form method="post" action="options.php">
			<?php settings_fields( 'qnc_makerworld' ); ?>
			<table class="form-table">
				<tr>
					<th><label for="qnmw_intro"><?php esc_html_e( 'Intro copy (shown above the order form)', 'questnerd-content' ); ?></label></th>
					<td>
						<textarea id="qnmw_intro" name="qn_makerworld_settings[intro]" rows="3" class="large-text"><?php echo esc_textarea( isset( $current['intro'] ) ? $current['intro'] : '' ); ?></textarea>
					</td>
				</tr>
				<tr>
					<th><label for="qnmw_tiers"><?php esc_html_e( 'Tiers (JSON array)', 'questnerd-content' ); ?></label></th>
					<td>
						<textarea id="qnmw_tiers" name="qn_makerworld_settings[tiers_json]" rows="12" class="large-text code"><?php echo esc_textarea( $tiers_json ); ?></textarea>
						<p class="description">
							<?php esc_html_e( 'Each tier: { "label": "Small print", "price": "$8", "maxHours": 4, "stripePriceId": "price_…" }', 'questnerd-content' ); ?>
						</p>
					</td>
				</tr>
			</table>
			<?php submit_button(); ?>
		</form>
	</div>
	<?php
}
