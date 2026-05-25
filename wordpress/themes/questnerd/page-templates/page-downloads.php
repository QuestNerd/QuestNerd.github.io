<?php
/**
 * Template Name: QuestNerd — Downloads
 *
 * Mirrors downloads.html.
 *
 * @package QuestNerd
 */
get_header(); ?>

<main class="qn-wrap">
	<section class="section">
		<div class="section-head">
			<h1><?php esc_html_e( 'Downloads', 'questnerd' ); ?></h1>
			<p class="meta"><?php esc_html_e( 'Tool previews, print-workflow helpers, desktop utilities, and operations playbooks from QuestNerd. These cards are roadmap entries until each item is packaged and tested.', 'questnerd' ); ?></p>
		</div>

		<div class="card">
			<h2><?php esc_html_e( 'Preview shelf', 'questnerd' ); ?></h2>
			<p><?php esc_html_e( 'This page lists useful tools and playbooks before release. Live files and checkout stay off until each item has clear instructions and support notes.', 'questnerd' ); ?></p>
		</div>

		<h2 style="margin-top:2rem;"><?php esc_html_e( 'Tool previews', 'questnerd' ); ?></h2>
		<?php qn_render_product_grid( array(
			'type'  => 'pc-download',
			'empty' => __( 'No tool previews yet. Add pc-download items in QuestNerd → Products.', 'questnerd' ),
		) ); ?>

		<h2 style="margin-top:2rem;"><?php esc_html_e( 'Premium / waitlist ideas', 'questnerd' ); ?></h2>
		<p class="meta"><?php esc_html_e( 'Listed for future packaging and portfolio review. Checkout stays off until each product is ready to support.', 'questnerd' ); ?></p>
		<?php qn_render_product_grid( array(
			'type'  => 'stripe',
			'empty' => __( 'No premium previews yet. Add Stripe items in QuestNerd → Products.', 'questnerd' ),
		) ); ?>
	</section>
</main>

<?php get_footer(); ?>
