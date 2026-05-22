<?php
/**
 * Register CPTs:
 *   - qn_product   (Products)
 *   - qn_project   (Projects / portfolio)
 *   - qn_filament  (MakerWorld filament colors)
 * Plus a shared taxonomy `qn_tag` for both products and projects.
 *
 * @package QuestNerdContent
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

function qnc_register_post_types() {
	register_post_type( 'qn_product', array(
		'labels' => array(
			'name'               => __( 'Products', 'questnerd-content' ),
			'singular_name'      => __( 'Product', 'questnerd-content' ),
			'add_new_item'       => __( 'Add new product', 'questnerd-content' ),
			'edit_item'          => __( 'Edit product', 'questnerd-content' ),
			'new_item'           => __( 'New product', 'questnerd-content' ),
			'view_item'          => __( 'View product', 'questnerd-content' ),
			'all_items'          => __( 'All products', 'questnerd-content' ),
			'search_items'       => __( 'Search products', 'questnerd-content' ),
			'menu_name'          => __( 'QuestNerd', 'questnerd-content' ),
		),
		'public'              => true,
		'has_archive'         => false,
		'menu_icon'           => 'dashicons-products',
		'supports'            => array( 'title', 'editor', 'thumbnail', 'excerpt', 'page-attributes', 'custom-fields' ),
		'show_in_rest'        => true,
		'rest_base'           => 'qn-products',
		'rewrite'             => array( 'slug' => 'product', 'with_front' => false ),
		'menu_position'       => 22,
	) );

	register_post_type( 'qn_project', array(
		'labels' => array(
			'name'          => __( 'Projects', 'questnerd-content' ),
			'singular_name' => __( 'Project', 'questnerd-content' ),
			'add_new_item'  => __( 'Add new project', 'questnerd-content' ),
			'edit_item'     => __( 'Edit project', 'questnerd-content' ),
			'all_items'     => __( 'All projects', 'questnerd-content' ),
			'menu_name'     => __( 'Projects', 'questnerd-content' ),
		),
		'public'              => true,
		'has_archive'         => false,
		'menu_icon'           => 'dashicons-portfolio',
		'supports'            => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields' ),
		'show_in_rest'        => true,
		'rest_base'           => 'qn-projects',
		'rewrite'             => array( 'slug' => 'project', 'with_front' => false ),
		'show_in_menu'        => 'edit.php?post_type=qn_product',
	) );

	register_post_type( 'qn_filament', array(
		'labels' => array(
			'name'          => __( 'Filaments', 'questnerd-content' ),
			'singular_name' => __( 'Filament', 'questnerd-content' ),
			'add_new_item'  => __( 'Add new filament', 'questnerd-content' ),
			'edit_item'     => __( 'Edit filament', 'questnerd-content' ),
			'all_items'     => __( 'All filaments', 'questnerd-content' ),
			'menu_name'     => __( 'Filaments', 'questnerd-content' ),
		),
		'public'       => false,
		'show_ui'      => true,
		'menu_icon'    => 'dashicons-art',
		'supports'     => array( 'title', 'page-attributes', 'custom-fields' ),
		'show_in_rest' => true,
		'rest_base'    => 'qn-filaments',
		'show_in_menu' => 'edit.php?post_type=qn_product',
	) );

	register_taxonomy( 'qn_tag', array( 'qn_product', 'qn_project' ), array(
		'labels' => array(
			'name'          => __( 'QuestNerd tags', 'questnerd-content' ),
			'singular_name' => __( 'QuestNerd tag', 'questnerd-content' ),
		),
		'public'       => true,
		'hierarchical' => false,
		'show_in_rest' => true,
		'rewrite'      => array( 'slug' => 'qn-tag' ),
	) );

	qnc_register_post_meta();
}
add_action( 'init', 'qnc_register_post_types' );

/**
 * Register post meta for the REST API (so the React editor / Gutenberg
 * can see/edit these fields, and so qn_post_to_product() picks them up
 * after a WP-CLI or REST-driven import).
 */
function qnc_register_post_meta() {
	$product_meta = array(
		'_qn_type'             => array( 'type' => 'string' ),
		'_qn_description'      => array( 'type' => 'string' ),
		'_qn_long_description' => array( 'type' => 'string' ),
		'_qn_story'            => array( 'type' => 'string' ),
		'_qn_price'            => array( 'type' => 'string' ),
		'_qn_featured'         => array( 'type' => 'boolean' ),
		'_qn_image'            => array( 'type' => 'string' ),
		'_qn_url'              => array( 'type' => 'string' ),
		'_qn_model'            => array( 'type' => 'string' ),
		'_qn_stripe_price_id'  => array( 'type' => 'string' ),
		'_qn_specs'            => array( 'type' => 'array', 'sanitize_callback' => 'qnc_sanitize_kv_list' ),
		'_qn_faq'              => array( 'type' => 'array', 'sanitize_callback' => 'qnc_sanitize_qa_list' ),
	);
	foreach ( $product_meta as $key => $args ) {
		register_post_meta( 'qn_product', $key, array_merge( array(
			'single'        => true,
			'show_in_rest'  => true,
			'auth_callback' => function () { return current_user_can( 'edit_posts' ); },
		), $args ) );
	}

	$project_meta = array(
		'_qn_date'        => array( 'type' => 'string' ),
		'_qn_role'        => array( 'type' => 'string' ),
		'_qn_summary'     => array( 'type' => 'string' ),
		'_qn_image'       => array( 'type' => 'string' ),
		'_qn_money_spent' => array( 'type' => 'string' ),
		'_qn_money_saved' => array( 'type' => 'string' ),
		'_qn_duration'    => array( 'type' => 'string' ),
		'_qn_outcome'     => array( 'type' => 'string' ),
		'_qn_tech'        => array( 'type' => 'array', 'sanitize_callback' => 'qnc_sanitize_string_array' ),
	);
	foreach ( $project_meta as $key => $args ) {
		register_post_meta( 'qn_project', $key, array_merge( array(
			'single'        => true,
			'show_in_rest'  => true,
			'auth_callback' => function () { return current_user_can( 'edit_posts' ); },
		), $args ) );
	}

	$fil_meta = array(
		'_qn_hex'       => array( 'type' => 'string' ),
		'_qn_material'  => array( 'type' => 'string' ),
		'_qn_available' => array( 'type' => 'boolean' ),
	);
	foreach ( $fil_meta as $key => $args ) {
		register_post_meta( 'qn_filament', $key, array_merge( array(
			'single'        => true,
			'show_in_rest'  => true,
			'auth_callback' => function () { return current_user_can( 'edit_posts' ); },
		), $args ) );
	}
}

function qnc_sanitize_string_array( $value ) {
	if ( ! is_array( $value ) ) { return array(); }
	return array_values( array_map( 'sanitize_text_field', $value ) );
}

function qnc_sanitize_kv_list( $value ) {
	if ( ! is_array( $value ) ) { return array(); }
	$out = array();
	foreach ( $value as $row ) {
		if ( ! is_array( $row ) ) { continue; }
		$out[] = array(
			'label' => isset( $row['label'] ) ? sanitize_text_field( $row['label'] ) : '',
			'value' => isset( $row['value'] ) ? sanitize_text_field( $row['value'] ) : '',
		);
	}
	return $out;
}

function qnc_sanitize_qa_list( $value ) {
	if ( ! is_array( $value ) ) { return array(); }
	$out = array();
	foreach ( $value as $row ) {
		if ( ! is_array( $row ) ) { continue; }
		$out[] = array(
			'q' => isset( $row['q'] ) ? sanitize_text_field( $row['q'] ) : '',
			'a' => isset( $row['a'] ) ? wp_kses_post( $row['a'] ) : '',
		);
	}
	return $out;
}
