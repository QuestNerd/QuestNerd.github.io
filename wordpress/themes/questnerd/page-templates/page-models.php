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
			<p class="meta"><?php esc_html_e( 'Digital STL/OBJ downloads on Cults3D, and ready-to-ship physical prints on Etsy.', 'questnerd' ); ?></p>
		</div>

		<div class="card" style="display:flex; gap:1rem; flex-wrap:wrap; align-items:center; justify-content:space-between;">
			<p style="margin:0;"><?php esc_html_e( 'Prefer to browse on the storefront directly?', 'questnerd' ); ?></p>
			<div class="hero-cta-row">
				<a class="qn-button"       data-config-href="CULTS3D_URL" href="#" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'Open Cults3D shop', 'questnerd' ); ?></a>
				<a class="qn-button ghost" data-config-href="ETSY_URL"    href="#" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'Open Etsy shop', 'questnerd' ); ?></a>
			</div>
		</div>

		<h2 style="margin-top:2rem;"><?php esc_html_e( 'Digital downloads — Cults3D', 'questnerd' ); ?></h2>
		<p class="meta"><?php esc_html_e( 'Print at home. Pre-supported STL/OBJ files with print profiles where available.', 'questnerd' ); ?></p>
		<?php qn_render_product_grid( array(
			'type'  => 'cults3d',
			'empty' => __( 'No digital models yet. Add Cults3D items in QuestNerd → Products.', 'questnerd' ),
		) ); ?>

		<h2 style="margin-top:2rem;"><?php esc_html_e( 'Physical prints — Etsy', 'questnerd' ); ?></h2>
		<p class="meta"><?php esc_html_e( 'Hand-printed by QuestNerd. Ships worldwide via Etsy.', 'questnerd' ); ?></p>
		<?php qn_render_product_grid( array(
			'type'  => 'etsy',
			'empty' => __( 'No physical prints yet. Add Etsy items in QuestNerd → Products.', 'questnerd' ),
		) ); ?>
	</section>
</main>

<?php get_footer(); ?>
