<?php
/**
 * Template Name: QuestNerd — Games
 *
 * Mirrors apps.html.
 *
 * @package QuestNerd
 */
get_header(); ?>

<main class="qn-wrap">
	<section class="section">
		<div class="section-head">
			<h1><?php esc_html_e( 'Games', 'questnerd' ); ?></h1>
			<p class="meta"><?php esc_html_e( 'Games, prototypes, and playable experiments built under QuestNerd.', 'questnerd' ); ?></p>
		</div>

		<div class="card" style="display:flex; gap:1rem; flex-wrap:wrap; align-items:center; justify-content:space-between;">
			<p style="margin:0;"><?php esc_html_e( 'Skelepet and other QuestNerd game builds are tracked here as they ship.', 'questnerd' ); ?></p>
			<a class="qn-button" data-config-href="GOOGLE_PLAY_URL" href="#" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'Open QuestNerd game listings', 'questnerd' ); ?></a>
		</div>

		<div style="margin-top:2rem;">
			<?php qn_render_product_grid( array(
				'type'  => 'googleplay',
				'empty' => __( 'No games yet. Add Google Play items in QuestNerd → Products.', 'questnerd' ),
			) ); ?>
		</div>


		<div class="card" style="margin-top:2rem;">
			<h2><?php esc_html_e( 'Skelepet spotlight', 'questnerd' ); ?></h2>
			<p class="meta"><?php esc_html_e( 'Skelepet is a cozy pet-care experiment where players collect bones, craft outfits, and keep a tiny undead buddy happy through short daily check-ins.', 'questnerd' ); ?></p>
			<p><?php esc_html_e( 'The design goal is low-pressure progression: sessions are 2–5 minutes, with lightweight goals and no punitive streak systems.', 'questnerd' ); ?></p>
		</div>

	</section>
</main>

<?php get_footer(); ?>
