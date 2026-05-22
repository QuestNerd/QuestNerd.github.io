<?php
/**
 * Lightweight REST endpoints that expose the QuestNerd CPTs in the same
 * shape as the static site's /content/<collection>/*.json files. This
 * lets `assets/js/content-loader.js` keep working as a fallback (or be
 * pointed at WP entirely by setting CONTENT_REPO = '').
 *
 *   GET /wp-json/questnerd/v1/products
 *   GET /wp-json/questnerd/v1/projects
 *   GET /wp-json/questnerd/v1/filaments
 *   GET /wp-json/questnerd/v1/makerworld-settings
 *
 * @package QuestNerdContent
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

function qnc_register_rest_routes() {
	$ns = 'questnerd/v1';

	register_rest_route( $ns, '/products', array(
		'methods'             => 'GET',
		'permission_callback' => '__return_true',
		'callback'            => function () {
			return function_exists( 'qn_get_products' ) ? qn_get_products() : array();
		},
	) );

	register_rest_route( $ns, '/projects', array(
		'methods'             => 'GET',
		'permission_callback' => '__return_true',
		'callback'            => function () {
			return function_exists( 'qn_get_projects' ) ? qn_get_projects() : array();
		},
	) );

	register_rest_route( $ns, '/filaments', array(
		'methods'             => 'GET',
		'permission_callback' => '__return_true',
		'callback'            => function () {
			return function_exists( 'qn_get_filaments' ) ? qn_get_filaments() : array();
		},
	) );

	register_rest_route( $ns, '/makerworld-settings', array(
		'methods'             => 'GET',
		'permission_callback' => '__return_true',
		'callback'            => function () {
			return function_exists( 'qn_get_makerworld_settings' ) ? qn_get_makerworld_settings() : new stdClass();
		},
	) );
}
add_action( 'rest_api_init', 'qnc_register_rest_routes' );
