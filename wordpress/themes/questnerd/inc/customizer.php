<?php
/**
 * Customizer panel for QuestNerd settings.
 *
 * Surfaces the exact same set of switches that lived in
 * assets/js/config.js on the static site — but now editable from
 * WP Admin → Appearance → Customize.
 *
 * @package QuestNerd
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

function qn_register_customizer( $wp_customize ) {
	$wp_customize->add_section( 'qn_settings', array(
		'title'    => __( 'QuestNerd Settings', 'questnerd' ),
		'priority' => 30,
	) );

	$fields = array(
		'qn_site_url'              => array( 'label' => __( 'Site URL (absolute)', 'questnerd' ),       'default' => '' ),
		'qn_og_image'              => array( 'label' => __( 'Default OG image URL', 'questnerd' ),     'default' => '' ),
		'qn_stripe_pk'             => array( 'label' => __( 'Stripe Publishable Key (pk_…)', 'questnerd' ), 'default' => '' ),
		'qn_cults3d_url'           => array( 'label' => __( 'Cults3D shop URL', 'questnerd' ),         'default' => '' ),
		'qn_etsy_url'              => array( 'label' => __( 'Etsy shop URL', 'questnerd' ),            'default' => '' ),
		'qn_google_play_url'       => array( 'label' => __( 'Google Play dev page URL', 'questnerd' ),  'default' => '' ),
		'qn_contact_email'         => array( 'label' => __( 'Contact email', 'questnerd' ),            'default' => '' ),
		'qn_makerworld_notify_url' => array( 'label' => __( 'MakerWorld notify webhook URL', 'questnerd' ), 'default' => '' ),
		'qn_newsletter_action'     => array( 'label' => __( 'Newsletter form action URL', 'questnerd' ),    'default' => '' ),
		'qn_newsletter_provider'   => array( 'label' => __( 'Newsletter provider (formspree|mailchimp|buttondown|convertkit)', 'questnerd' ), 'default' => '' ),
		'qn_analytics_domain'      => array( 'label' => __( 'Plausible analytics domain', 'questnerd' ),  'default' => '' ),
		'qn_analytics_src'         => array( 'label' => __( 'Plausible script URL', 'questnerd' ),       'default' => 'https://plausible.io/js/script.js' ),
	);

	foreach ( $fields as $key => $cfg ) {
		$wp_customize->add_setting( $key, array(
			'default'           => $cfg['default'],
			'sanitize_callback' => 'sanitize_text_field',
			'transport'         => 'refresh',
		) );
		$wp_customize->add_control( $key, array(
			'label'   => $cfg['label'],
			'section' => 'qn_settings',
			'type'    => 'text',
		) );
	}
}
add_action( 'customize_register', 'qn_register_customizer' );
