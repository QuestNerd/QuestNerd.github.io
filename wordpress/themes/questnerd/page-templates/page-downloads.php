<?php
/**
 * Template Name: QuestNerd — PC Downloads
 *
 * Mirrors downloads.html.
 *
 * @package QuestNerd
 */
get_header(); ?>

<main class="qn-wrap">
	<section class="section">
		<div class="section-head">
			<h1><?php esc_html_e( 'PC Downloads', 'questnerd' ); ?></h1>
			<p class="meta"><?php esc_html_e( 'Software, tools, and resources for your PC. Free items download directly; paid items use secure Stripe Checkout.', 'questnerd' ); ?></p>
		</div>

		<h2><?php esc_html_e( 'Free downloads', 'questnerd' ); ?></h2>
		<?php qn_render_product_grid( array(
			'type'  => 'pc-download',
			'empty' => __( 'No free downloads yet. Add pc-download items in QuestNerd → Products.', 'questnerd' ),
		) ); ?>

		<h2 style="margin-top:2rem;"><?php esc_html_e( 'Paid downloads (Stripe Checkout)', 'questnerd' ); ?></h2>
		<p class="meta"><?php
			/* translators: HTML formatting */
			echo wp_kses_post( __( 'Click <strong>Buy now</strong> to pay securely on Stripe. After checkout you\'ll be returned to <code>/success/</code>.', 'questnerd' ) );
		?></p>
		<?php qn_render_product_grid( array(
			'type'  => 'stripe',
			'empty' => __( 'No paid downloads yet. Add Stripe items in QuestNerd → Products.', 'questnerd' ),
		) ); ?>
	</section>
</main>

<?php get_footer(); ?>
