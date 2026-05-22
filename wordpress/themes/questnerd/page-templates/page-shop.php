<?php
/**
 * Template Name: QuestNerd — Shop (all catalog)
 *
 * Mirrors shop.html.
 *
 * @package QuestNerd
 */
get_header(); ?>

<main class="qn-wrap">
	<section class="section">
		<div class="section-head">
			<h1><?php esc_html_e( 'Shop', 'questnerd' ); ?></h1>
			<p class="meta"><?php esc_html_e( 'Everything QuestNerd makes — pulled from a single source of truth in QuestNerd → Products.', 'questnerd' ); ?></p>
		</div>

		<h2><?php esc_html_e( '3D Models (Digital — Cults3D)', 'questnerd' ); ?></h2>
		<?php qn_render_product_grid( array(
			'type'  => 'cults3d',
			'empty' => __( 'No digital models yet. Add Cults3D items in QuestNerd → Products.', 'questnerd' ),
		) ); ?>

		<h2 style="margin-top:2rem;"><?php esc_html_e( 'Physical Prints (Etsy)', 'questnerd' ); ?></h2>
		<?php qn_render_product_grid( array(
			'type'  => 'etsy',
			'empty' => __( 'No physical prints yet. Add Etsy items in QuestNerd → Products.', 'questnerd' ),
		) ); ?>

		<h2 style="margin-top:2rem;"><?php esc_html_e( 'Apps (Google Play)', 'questnerd' ); ?></h2>
		<?php qn_render_product_grid( array(
			'type'  => 'googleplay',
			'empty' => __( 'No apps yet. Add Google Play items in QuestNerd → Products.', 'questnerd' ),
		) ); ?>

		<h2 style="margin-top:2rem;"><?php esc_html_e( 'PC Downloads', 'questnerd' ); ?></h2>
		<?php qn_render_product_grid( array(
			'type'  => 'pc-download,stripe',
			'empty' => __( 'No PC downloads yet. Add pc-download or Stripe items in QuestNerd → Products.', 'questnerd' ),
		) ); ?>

		<h2 style="margin-top:2rem;"><?php esc_html_e( 'MakerWorld Print Service', 'questnerd' ); ?></h2>
		<p class="meta">
			<?php
			/* translators: link to makerworld */
			printf(
				wp_kses(
					/* translators: 1: makerworld URL, 2: order form URL */
					__( 'Want me to print anything from <a href="%1$s" target="_blank" rel="noopener noreferrer">makerworld.com</a>? Pick a print-time tier, choose your filament color, paste the URL, and I\'ll print and ship it. <a href="%2$s">Open the order form →</a>', 'questnerd' ),
					array( 'a' => array( 'href' => array(), 'target' => array(), 'rel' => array() ) )
				),
				'https://makerworld.com/',
				esc_url( home_url( '/makerworld-prints/' ) )
			);
			?>
		</p>
	</section>
</main>

<?php get_footer(); ?>
