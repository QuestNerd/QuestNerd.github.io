<?php
/**
 * QuestNerd theme bootstrap.
 *
 * Responsibilities:
 *   - Register theme support (title-tag, post-thumbnails, html5, custom-logo).
 *   - Register the primary navigation menu.
 *   - Enqueue the original site's CSS/JS bundle exactly as the static site
 *     loaded them (so Stripe Checkout, model-viewer, search, MakerWorld
 *     order form, newsletter handler, UTM capture, etc. keep working).
 *   - Bridge QN_CONFIG from a Customizer / wp_options bag into the
 *     window.QN_CONFIG object the existing JS expects.
 *   - Surface products/projects/filaments from the questnerd-content plugin
 *     as window.QN_PRODUCTS / window.QN_PROJECTS / window.QN_MAKERWORLD_*
 *     so all of the existing client-side code keeps rendering, searching,
 *     and checking out without modification.
 *   - Provide PHP helpers (qn_render_product_grid, qn_render_project_grid)
 *     used by the page templates to server-render grids for SEO.
 *
 * @package QuestNerd
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

define( 'QN_THEME_VERSION', '1.0.0' );
define( 'QN_THEME_DIR', get_template_directory() );
define( 'QN_THEME_URI', get_template_directory_uri() );

require_once QN_THEME_DIR . '/inc/template-helpers.php';
require_once QN_THEME_DIR . '/inc/data-bridge.php';
require_once QN_THEME_DIR . '/inc/customizer.php';

/**
 * Theme support + menus.
 */
function qn_theme_setup() {
	load_theme_textdomain( 'questnerd', QN_THEME_DIR . '/languages' );

	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'custom-logo', array(
		'height'      => 104,
		'width'       => 184,
		'flex-height' => true,
		'flex-width'  => true,
	) );
	add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption', 'script', 'style', 'navigation-widgets' ) );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'automatic-feed-links' );

	register_nav_menus( array(
		'primary' => __( 'Primary menu', 'questnerd' ),
		'footer-shop'    => __( 'Footer — Shop', 'questnerd' ),
		'footer-explore' => __( 'Footer — Explore', 'questnerd' ),
		'footer-legal'   => __( 'Footer — Legal', 'questnerd' ),
	) );
}
add_action( 'after_setup_theme', 'qn_theme_setup' );

/**
 * Enqueue styles & scripts.
 *
 * Mirrors the order used by the static-site <head>:
 *   config.js, products.js, projects.js, content-loader.js, utm.js,
 *   analytics.js, partials.js (no-op on WP — see note), nav.js, search.js,
 *   stripe-checkout.js, newsletter.js, main.js, detail.js (on singulars),
 *   makerworld.js (on the MakerWorld page).
 *
 * partials.js is still loaded so it can dispatch the `qn:partials-loaded`
 * event the rest of the JS subscribes to — but on WordPress the header
 * and footer are rendered by PHP, so it has no DOM nodes to inject and
 * the event fires harmlessly.
 */
function qn_enqueue_assets() {
	$asset_uri = QN_THEME_URI . '/assets';
	$ver       = QN_THEME_VERSION;

	wp_enqueue_style( 'qn-style', $asset_uri . '/css/style.css', array(), $ver );

	// model-viewer module (only enqueued where it's needed — front page + product detail).
	if ( is_front_page() || is_singular( 'qn_product' ) ) {
		wp_enqueue_script_module(
			'qn-model-viewer',
			'https://unpkg.com/@google/model-viewer@3.5.0/dist/model-viewer.min.js',
			array(),
			'3.5.0'
		);
	}

	// Note: WordPress strips arbitrary script attributes. We register the
	// scripts plain and add `defer` via `script_loader_tag` below.
	wp_enqueue_script( 'qn-config',           $asset_uri . '/js/config.js',           array(),                $ver, false );
	wp_enqueue_script( 'qn-products',         $asset_uri . '/js/products.js',         array( 'qn-config' ),   $ver, false );
	wp_enqueue_script( 'qn-projects',         $asset_uri . '/js/projects.js',         array( 'qn-config' ),   $ver, false );
	wp_enqueue_script( 'qn-content-loader',   $asset_uri . '/js/content-loader.js',   array( 'qn-products', 'qn-projects' ), $ver, false );
	wp_enqueue_script( 'qn-utm',              $asset_uri . '/js/utm.js',              array( 'qn-config' ),   $ver, false );
	wp_enqueue_script( 'qn-analytics',        $asset_uri . '/js/analytics.js',        array( 'qn-config' ),   $ver, false );
	wp_enqueue_script( 'qn-stripe-checkout',  $asset_uri . '/js/stripe-checkout.js',  array( 'qn-config' ),   $ver, false );
	wp_enqueue_script( 'qn-partials',         $asset_uri . '/js/partials.js',         array(),                $ver, false );
	wp_enqueue_script( 'qn-nav',              $asset_uri . '/js/nav.js',              array(),                $ver, false );
	wp_enqueue_script( 'qn-search',           $asset_uri . '/js/search.js',           array( 'qn-products' ), $ver, false );
	wp_enqueue_script( 'qn-newsletter',       $asset_uri . '/js/newsletter.js',       array( 'qn-config' ),   $ver, false );
	wp_enqueue_script( 'qn-main',             $asset_uri . '/js/main.js',             array( 'qn-products', 'qn-projects', 'qn-stripe-checkout' ), $ver, false );

	if ( is_singular( array( 'qn_product', 'qn_project' ) ) ) {
		wp_enqueue_script( 'qn-detail', $asset_uri . '/js/detail.js', array( 'qn-products', 'qn-projects' ), $ver, false );
	}

	if ( is_page_template( 'page-templates/page-makerworld-prints.php' ) ) {
		wp_enqueue_script( 'qn-makerworld-config', $asset_uri . '/js/makerworld-config.js', array( 'qn-config' ),         $ver, false );
		wp_enqueue_script( 'qn-makerworld',        $asset_uri . '/js/makerworld.js',        array( 'qn-makerworld-config', 'qn-stripe-checkout' ), $ver, false );
	}

	/*
	 * Inject a small inline script BEFORE qn-config that exposes the WP
	 * customizer settings to JS as window.QN_CONFIG defaults. config.js
	 * then merges its (default) literals over top, and finally any
	 * filter-altered overrides from PHP are merged on top of those.
	 */
	$config = qn_get_config_for_js();
	wp_add_inline_script(
		'qn-config',
		'window.QN_CONFIG = Object.assign({}, window.QN_CONFIG || {}, ' . wp_json_encode( $config ) . ');',
		'after'
	);

	/*
	 * Replace the legacy hand-edited products/projects arrays with the
	 * CPT-backed equivalents. The static products.js/projects.js still
	 * load (so they can seed defaults if WP has no entries yet) but we
	 * append a second assignment that wins.
	 */
	$products = qn_get_products_for_js();
	$projects = qn_get_projects_for_js();
	wp_add_inline_script(
		'qn-products',
		'window.QN_PRODUCTS = (window.QN_PRODUCTS || []).concat(' . wp_json_encode( $products ) . ');',
		'after'
	);
	wp_add_inline_script(
		'qn-projects',
		'window.QN_PROJECTS = (window.QN_PROJECTS || []).concat(' . wp_json_encode( $projects ) . ');',
		'after'
	);

	$maker = qn_get_makerworld_overrides_for_js();
	if ( ! empty( $maker ) ) {
		wp_add_inline_script(
			'qn-config',
			'window.QN_MAKERWORLD_OVERRIDES = ' . wp_json_encode( $maker ) . ';',
			'after'
		);
	}
}
add_action( 'wp_enqueue_scripts', 'qn_enqueue_assets' );

/**
 * Add `defer` to all theme scripts — the static site loaded them deferred.
 */
function qn_defer_theme_scripts( $tag, $handle ) {
	if ( strpos( $handle, 'qn-' ) === 0 && strpos( $tag, ' defer' ) === false ) {
		$tag = str_replace( ' src=', ' defer src=', $tag );
	}
	return $tag;
}
add_filter( 'script_loader_tag', 'qn_defer_theme_scripts', 10, 2 );

/**
 * Output a small <link rel="icon"> for the SVG favicon (matches the
 * static site's <link rel="icon" type="image/svg+xml" ...>).
 */
function qn_favicon_link() {
	$icon = QN_THEME_URI . '/assets/img/questnerd-mark.svg';
	echo '<link rel="icon" type="image/svg+xml" href="' . esc_url( $icon ) . "\">\n";
}
add_action( 'wp_head', 'qn_favicon_link', 5 );

/**
 * Replicate the static site's social-share <meta> tags.
 *
 * - Single product/project posts: use the post's title, excerpt, and
 *   featured image when available.
 * - Other pages: pull from the front page title/description.
 */
function qn_social_meta() {
	$title = wp_get_document_title();
	$desc  = '';
	$image = '';

	if ( is_singular() ) {
		$desc  = get_the_excerpt();
		$thumb = get_the_post_thumbnail_url( null, 'full' );
		if ( $thumb ) { $image = $thumb; }
	}
	if ( ! $desc ) {
		$desc = get_bloginfo( 'description' );
	}
	if ( ! $image ) {
		$og = get_theme_mod( 'qn_og_image', '' );
		$image = $og ? $og : QN_THEME_URI . '/assets/img/og-image.svg';
	}

	echo '<meta name="description" content="' . esc_attr( wp_strip_all_tags( $desc ) ) . "\">\n";
	echo '<meta property="og:title" content="' . esc_attr( $title ) . "\">\n";
	echo '<meta property="og:description" content="' . esc_attr( wp_strip_all_tags( $desc ) ) . "\">\n";
	echo '<meta property="og:type" content="' . ( is_singular() ? 'article' : 'website' ) . "\">\n";
	echo '<meta property="og:image" content="' . esc_url( $image ) . "\">\n";
	echo "<meta name=\"twitter:card\" content=\"summary_large_image\">\n";
}
add_action( 'wp_head', 'qn_social_meta', 6 );
