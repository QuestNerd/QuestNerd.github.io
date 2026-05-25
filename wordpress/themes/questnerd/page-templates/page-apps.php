<?php
/**
 * Template Name: QuestNerd — Games
 *
 * Mirrors games.html.
 *
 * @package QuestNerd
 */
get_header(); ?>

<main class="qn-wrap">
	<section class="section">
		<div class="section-head">
			<h1><?php esc_html_e( 'Games', 'questnerd' ); ?></h1>
			<p class="meta"><?php esc_html_e( 'Cozy experiments, weird little prototypes, Android builds, and playable ideas from QuestNerd.', 'questnerd' ); ?></p>
		</div>

		<div class="card" style="display:flex; gap:1rem; flex-wrap:wrap; align-items:center; justify-content:space-between;">
			<p style="margin:0;"><?php echo wp_kses_post( __( 'The current flagship concept is <strong>Skelepet</strong>: a black-and-white skeleton pet game built around tiny daily check-ins, minigames, and low-pressure progression.', 'questnerd' ) ); ?></p>
			<a class="qn-button" href="#skelepet"><?php esc_html_e( 'Read the Skelepet dev note', 'questnerd' ); ?></a>
		</div>

		<div style="margin-top:2rem;">
			<?php qn_render_product_grid( array(
				'type'  => 'googleplay',
				'empty' => __( 'No games yet. Add Google Play items in QuestNerd → Products.', 'questnerd' ),
			) ); ?>
		</div>

		<div class="card" id="skelepet" style="margin-top:2rem;">
			<h2><?php esc_html_e( 'Skelepet spotlight', 'questnerd' ); ?></h2>
			<p class="meta"><?php esc_html_e( 'A cozy skeleton-pet Android prototype with a tiny undead buddy, short care loops, and a deliberately simple black-and-white style.', 'questnerd' ); ?></p>
			<p><?php esc_html_e( 'Skelepet is planned as a Tamagotchi-style game where the character starts in an egg and grows through food, sleep, play, wellness checks, unlockable backgrounds, and Skelecoins.', 'questnerd' ); ?></p>
			<p><?php esc_html_e( 'The scope is intentionally focused: lightweight screens, readable icons, short sessions, and minigames like tic-tac-toe, hangman, and a slot machine. The goal is fun daily interaction without aggressive streak pressure.', 'questnerd' ); ?></p>
			<div class="trust-row">
				<span class="badge"><?php esc_html_e( 'Android / Kotlin', 'questnerd' ); ?></span>
				<span class="badge"><?php esc_html_e( 'Retro black &amp; white', 'questnerd' ); ?></span>
				<span class="badge"><?php esc_html_e( 'Tiny daily loops', 'questnerd' ); ?></span>
				<span class="badge"><?php esc_html_e( 'Prototype in progress', 'questnerd' ); ?></span>
			</div>
		</div>

	</section>
</main>

<?php get_footer(); ?>
