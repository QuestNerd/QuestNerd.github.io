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
			<p class="meta"><?php esc_html_e( 'QuestNerd tools, presets, and build resources. Listed here for visibility; direct downloads are currently disabled while packages are being refreshed.', 'questnerd' ); ?></p>
		</div>

		<h2><?php esc_html_e( 'Featured toolkits (coming soon)', 'questnerd' ); ?></h2>
		<?php qn_render_product_grid( array(
			'type'  => 'pc-download',
			'empty' => __( 'No free downloads yet. Add pc-download items in QuestNerd → Products.', 'questnerd' ),
		) ); ?>

		<h2 style="margin-top:2rem;"><?php esc_html_e( 'Premium tools (waitlist)', 'questnerd' ); ?></h2>
		<p class="meta"><?php
			/* translators: HTML formatting */
			echo wp_kses_post( __( 'These tools are listed for portfolio review. Checkout and direct downloads are temporarily disabled.', 'questnerd' ) );
		?></p>
		<?php qn_render_product_grid( array(
			'type'  => 'stripe',
			'empty' => __( 'No paid downloads yet. Add Stripe items in QuestNerd → Products.', 'questnerd' ),
		) ); ?>
	</section>
</main>

<?php get_footer(); ?>
