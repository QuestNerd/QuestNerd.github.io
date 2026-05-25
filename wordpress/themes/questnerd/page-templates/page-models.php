<?php
/**
 * Template Name: QuestNerd — 3D Models
 *
 * Mirrors models.html.
 *
 * @package QuestNerd
 */
get_header(); ?>

<main class="qn-wrap">
	<section class="section">
		<div class="section-head">
			<h1><?php esc_html_e( '3D Models', 'questnerd' ); ?></h1>
			<p class="meta"><?php esc_html_e( 'Live QuestNerd model/storefront cards: practical prints, toy storage helpers, wearable accessories, and ready-to-request print flows.', 'questnerd' ); ?></p>
		</div>

		<div class="card" style="display:flex; gap:1rem; flex-wrap:wrap; align-items:center; justify-content:space-between;">
			<p style="margin:0;"><?php esc_html_e( 'Prefer to browse on the storefront directly?', 'questnerd' ); ?></p>
			<div class="hero-cta-row">
				<a class="qn-button" data-config-href="CULTS3D_URL" href="#" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'Open Cults3D shop', 'questnerd' ); ?></a>
				<a class="qn-button ghost" href="<?php echo esc_url( home_url( '/makerworld-prints/' ) ); ?>"><?php esc_html_e( 'Request a custom print', 'questnerd' ); ?></a>
			</div>
		</div>

		<h2 style="margin-top:2rem;"><?php esc_html_e( 'Cults3D models — QuestNerd', 'questnerd' ); ?></h2>
		<p class="meta"><?php esc_html_e( 'Print-at-home models, functional accessories, and model projects linked back to the QuestNerd Cults3D presence.', 'questnerd' ); ?></p>
		<?php qn_render_product_grid( array(
			'type'  => 'cults3d',
			'empty' => __( 'No digital models yet. Add Cults3D items in QuestNerd → Products.', 'questnerd' ),
		) ); ?>

		<h2 style="margin-top:2rem;"><?php esc_html_e( 'Custom prints and services', 'questnerd' ); ?></h2>
		<p class="meta"><?php esc_html_e( 'For people who found a model they want printed instead of downloaded.', 'questnerd' ); ?></p>
		<?php qn_render_product_grid( array(
			'type'  => 'etsy',
			'empty' => __( 'No print-service cards yet. Add Etsy/service items in QuestNerd → Products.', 'questnerd' ),
		) ); ?>
	</section>
</main>

<?php get_footer(); ?>
