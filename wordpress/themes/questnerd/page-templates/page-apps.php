<?php
/**
 * Template Name: QuestNerd — Apps & Games
 *
 * Mirrors apps.html.
 *
 * @package QuestNerd
 */
get_header(); ?>

<main class="qn-wrap">
	<section class="section">
		<div class="section-head">
			<h1><?php esc_html_e( 'Apps &amp; Games', 'questnerd' ); ?></h1>
			<p class="meta"><?php esc_html_e( 'Original Android apps and games, available on Google Play.', 'questnerd' ); ?></p>
		</div>

		<div class="card" style="display:flex; gap:1rem; flex-wrap:wrap; align-items:center; justify-content:space-between;">
			<p style="margin:0;"><?php esc_html_e( 'Browse everything QuestNerd has published on Google Play.', 'questnerd' ); ?></p>
			<a class="qn-button" data-config-href="GOOGLE_PLAY_URL" href="#" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'Open Google Play developer page', 'questnerd' ); ?></a>
		</div>

		<div style="margin-top:2rem;">
			<?php qn_render_product_grid( array(
				'type'  => 'googleplay',
				'empty' => __( 'No apps yet. Add Google Play items in QuestNerd → Products.', 'questnerd' ),
			) ); ?>
		</div>
	</section>
</main>

<?php get_footer(); ?>
