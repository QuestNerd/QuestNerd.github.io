<?php
/**
 * Data bridge between the questnerd-content plugin's custom post types
 * and the JS / PHP rendering layers.
 *
 * Provides:
 *   - qn_get_products()  — array of product records (CPT-backed, falls
 *     back to assets/js/products.js seed data if no CPT entries exist).
 *   - qn_get_projects()  — same for portfolio entries.
 *   - qn_get_filaments() — same for MakerWorld filaments.
 *   - qn_get_makerworld_settings() — singleton settings (tiers, intro).
 *
 * Each record's shape exactly matches the JSON objects the static site
 * authored under content/products/, content/projects/, etc. — so client
 * JS doesn't need to learn a new schema.
 *
 * @package QuestNerd
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

/**
 * Map a `qn_product` post into the product-record shape.
 */
function qn_post_to_product( $post ) {
	$id   = $post->post_name ? $post->post_name : sanitize_title( $post->post_title );
	$meta = get_post_meta( $post->ID );
	$pick = function ( $key, $default = '' ) use ( $meta ) {
		return isset( $meta[ $key ][0] ) ? maybe_unserialize( $meta[ $key ][0] ) : $default;
	};

	$image = get_the_post_thumbnail_url( $post, 'large' );
	if ( ! $image ) { $image = $pick( '_qn_image', '' ); }

	$record = array(
		'id'              => $id,
		'type'            => $pick( '_qn_type', 'pc-download' ),
		'title'           => get_the_title( $post ),
		'description'     => $pick( '_qn_description', '' ),
		'longDescription' => $pick( '_qn_long_description', '' ),
		'story'           => $pick( '_qn_story', '' ),
		'price'           => $pick( '_qn_price', '' ),
		'featured'        => (bool) $pick( '_qn_featured', false ),
		'image'           => $image,
		'url'             => $pick( '_qn_url', '' ),
		'model'           => $pick( '_qn_model', '' ),
		'stripePriceId'   => $pick( '_qn_stripe_price_id', '' ),
		'specs'           => $pick( '_qn_specs', array() ),
		'faq'             => $pick( '_qn_faq', array() ),
		'tags'            => wp_get_post_terms( $post->ID, 'qn_tag', array( 'fields' => 'names' ) ),
	);

	return $record;
}

/**
 * Map a `qn_project` post into the project-record shape.
 */
function qn_post_to_project( $post ) {
	$id   = $post->post_name ? $post->post_name : sanitize_title( $post->post_title );
	$meta = get_post_meta( $post->ID );
	$pick = function ( $key, $default = '' ) use ( $meta ) {
		return isset( $meta[ $key ][0] ) ? maybe_unserialize( $meta[ $key ][0] ) : $default;
	};

	$image = get_the_post_thumbnail_url( $post, 'large' );
	if ( ! $image ) { $image = $pick( '_qn_image', '' ); }

	return array(
		'id'         => $id,
		'title'      => get_the_title( $post ),
		'date'       => $pick( '_qn_date', '' ),
		'role'       => $pick( '_qn_role', '' ),
		'summary'    => $pick( '_qn_summary', '' ),
		'story'      => apply_filters( 'the_content', $post->post_content ),
		'image'      => $image,
		'moneySpent' => $pick( '_qn_money_spent', '' ),
		'moneySaved' => $pick( '_qn_money_saved', '' ),
		'duration'   => $pick( '_qn_duration', '' ),
		'tech'       => $pick( '_qn_tech', array() ),
		'outcome'    => $pick( '_qn_outcome', '' ),
		'tags'       => wp_get_post_terms( $post->ID, 'qn_tag', array( 'fields' => 'names' ) ),
	);
}

/**
 * Fetch all published products.
 *
 * Cached for the duration of the request.
 */
function qn_get_products() {
	static $cache = null;
	if ( null !== $cache ) { return $cache; }

	if ( ! post_type_exists( 'qn_product' ) ) {
		$cache = array();
		return $cache;
	}

	$posts = get_posts( array(
		'post_type'      => 'qn_product',
		'post_status'    => 'publish',
		'posts_per_page' => -1,
		'orderby'        => array( 'menu_order' => 'ASC', 'date' => 'DESC' ),
	) );

	$cache = array_map( 'qn_post_to_product', $posts );
	return $cache;
}

/**
 * Fetch all published projects.
 */
function qn_get_projects() {
	static $cache = null;
	if ( null !== $cache ) { return $cache; }

	if ( ! post_type_exists( 'qn_project' ) ) {
		$cache = array();
		return $cache;
	}

	$posts = get_posts( array(
		'post_type'      => 'qn_project',
		'post_status'    => 'publish',
		'posts_per_page' => -1,
		'orderby'        => 'date',
		'order'          => 'DESC',
	) );

	$cache = array_map( 'qn_post_to_project', $posts );
	return $cache;
}

/**
 * Fetch all published filaments.
 */
function qn_get_filaments() {
	static $cache = null;
	if ( null !== $cache ) { return $cache; }

	if ( ! post_type_exists( 'qn_filament' ) ) {
		$cache = array();
		return $cache;
	}

	$posts = get_posts( array(
		'post_type'      => 'qn_filament',
		'post_status'    => 'publish',
		'posts_per_page' => -1,
		'orderby'        => array( 'menu_order' => 'ASC', 'title' => 'ASC' ),
	) );

	$cache = array_map( function ( $post ) {
		$meta = get_post_meta( $post->ID );
		return array(
			'id'        => $post->post_name ? $post->post_name : sanitize_title( $post->post_title ),
			'name'      => get_the_title( $post ),
			'hex'       => isset( $meta['_qn_hex'][0] )       ? $meta['_qn_hex'][0]       : '',
			'material'  => isset( $meta['_qn_material'][0] )  ? $meta['_qn_material'][0]  : 'PLA',
			'available' => ! isset( $meta['_qn_available'][0] ) || $meta['_qn_available'][0] !== '0',
		);
	}, $posts );
	return $cache;
}

/**
 * Fetch the MakerWorld settings (tiers, intro). Stored as one WP option
 * by the questnerd-content plugin.
 */
function qn_get_makerworld_settings() {
	$opt = get_option( 'qn_makerworld_settings', array() );
	if ( ! is_array( $opt ) ) { $opt = array(); }
	return $opt;
}

/**
 * Build the QN_CONFIG payload to bridge into JS.
 */
function qn_get_config_for_js() {
	$site_url = trim( get_theme_mod( 'qn_site_url', home_url() ) );
	$out = array(
		'SITE_NAME'              => get_bloginfo( 'name' ),
		'SITE_TAGLINE'           => get_bloginfo( 'description' ),
		'SITE_URL'               => $site_url,
		'OG_IMAGE'               => get_theme_mod( 'qn_og_image', QN_THEME_URI . '/assets/img/og-image.svg' ),
		'CURRENT_YEAR'           => (int) current_time( 'Y' ),
		'STRIPE_PUBLISHABLE_KEY' => get_theme_mod( 'qn_stripe_pk', '' ),
		'CULTS3D_URL'            => get_theme_mod( 'qn_cults3d_url', '' ),
		'ETSY_URL'               => get_theme_mod( 'qn_etsy_url', '' ),
		'GOOGLE_PLAY_URL'        => get_theme_mod( 'qn_google_play_url', '' ),
		'CONTACT_EMAIL'          => get_theme_mod( 'qn_contact_email', get_option( 'admin_email' ) ),
		'MAKERWORLD_NOTIFY_URL'  => get_theme_mod( 'qn_makerworld_notify_url', '' ),
		'NEWSLETTER_ACTION'      => get_theme_mod( 'qn_newsletter_action', '' ),
		'NEWSLETTER_PROVIDER'    => get_theme_mod( 'qn_newsletter_provider', '' ),
		'ANALYTICS_DOMAIN'       => get_theme_mod( 'qn_analytics_domain', '' ),
		'ANALYTICS_SRC'          => get_theme_mod( 'qn_analytics_src', 'https://plausible.io/js/script.js' ),
		// content-loader.js can no-op on WP because data comes from CPTs, but
		// we still expose these in case anyone relies on the GitHub fallback.
		'CONTENT_REPO'           => get_theme_mod( 'qn_content_repo', '' ),
		'CONTENT_BRANCH'         => get_theme_mod( 'qn_content_branch', '' ),
	);
	return apply_filters( 'qn_config_for_js', $out );
}

/**
 * Build window.QN_PRODUCTS replacement.
 */
function qn_get_products_for_js() {
	$out = array();
	foreach ( qn_get_products() as $p ) {
		// Drop empty fields so the JS payload stays compact.
		$out[] = array_filter( $p, function ( $v ) {
			return $v !== '' && $v !== null && $v !== array();
		} );
	}
	return $out;
}

/**
 * Build window.QN_PROJECTS replacement.
 */
function qn_get_projects_for_js() {
	$out = array();
	foreach ( qn_get_projects() as $p ) {
		$out[] = array_filter( $p, function ( $v ) {
			return $v !== '' && $v !== null && $v !== array();
		} );
	}
	return $out;
}

/**
 * Build window.QN_MAKERWORLD_OVERRIDES.
 */
function qn_get_makerworld_overrides_for_js() {
	$filaments = qn_get_filaments();
	$settings  = qn_get_makerworld_settings();
	$out = array();
	if ( ! empty( $filaments ) ) { $out['filaments'] = $filaments; }
	if ( ! empty( $settings['tiers'] ) ) { $out['tiers'] = $settings['tiers']; }
	if ( ! empty( $settings['intro'] ) ) { $out['intro'] = $settings['intro']; }
	return $out;
}
