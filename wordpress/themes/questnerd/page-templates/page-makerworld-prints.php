<?php
/**
 * Template Name: QuestNerd — MakerWorld Prints
 *
 * Mirrors makerworld-prints.html. The order form itself is mounted by
 * assets/js/makerworld.js into `[data-mw-host]`.
 *
 * @package QuestNerd
 */
get_header(); ?>

<main class="qn-wrap">
	<section class="section">
		<div class="section-head">
			<h1><?php esc_html_e( 'MakerWorld Print Service', 'questnerd' ); ?></h1>
			<p class="meta">
				<?php
				printf(
					wp_kses(
						/* translators: %s = makerworld URL */
						__( 'Find anything you want on <a href="%s" target="_blank" rel="noopener noreferrer">makerworld.com</a>, pick how long it takes to print, choose a filament color, and I\'ll print it and ship it to you.', 'questnerd' ),
						array( 'a' => array( 'href' => array(), 'target' => array(), 'rel' => array() ) )
					),
					'https://makerworld.com/'
				);
				?>
			</p>
		</div>

		<div class="card mw-card">
			<div data-mw-host>
				<p class="meta"><?php esc_html_e( 'Loading order form…', 'questnerd' ); ?></p>
			</div>
		</div>

		<section class="qn-faq" style="margin-top:2rem;">
			<h2><?php esc_html_e( 'How it works', 'questnerd' ); ?></h2>
			<details open>
				<summary><?php esc_html_e( '1. Pick a print-time tier', 'questnerd' ); ?></summary>
				<div>
					<p><?php echo wp_kses_post( sprintf(
						/* translators: %s = contact page URL */
						__( 'Every model on MakerWorld lists its estimated print time. Pick the tier that covers it: <strong>1 hour or less</strong>, <strong>1 to 6 hours</strong>, <strong>6 to 12 hours</strong>, or <strong>12 to 24 hours</strong>. If the print is longer than 24 hours or has unusual requirements, <a href="%s">message me first</a> for a custom quote.', 'questnerd' ),
						esc_url( home_url( '/contact/' ) )
					) ); ?></p>
				</div>
			</details>
			<details>
				<summary><?php esc_html_e( '2. Choose a filament color', 'questnerd' ); ?></summary>
				<div>
					<p><?php esc_html_e( 'Standard PLA colors are included in the base price. Premium colors (silks, gradients, exotic blends) carry a small upcharge that\'s added on at checkout.', 'questnerd' ); ?></p>
				</div>
			</details>
			<details>
				<summary><?php esc_html_e( '3. Paste the MakerWorld URL', 'questnerd' ); ?></summary>
				<div>
					<p><?php echo wp_kses_post( __( 'I only accept links on <code>makerworld.com</code>. Paste the URL for the exact model (and specific profile/variant, if relevant).', 'questnerd' ) ); ?></p>
				</div>
			</details>
			<details>
				<summary><?php esc_html_e( '4. Pay through Stripe, then I print &amp; ship', 'questnerd' ); ?></summary>
				<div>
					<p><?php esc_html_e( 'You\'ll be handed off to Stripe for secure checkout. The order details — including your MakerWorld URL and chosen filament — come straight to me. Shipping is calculated by Stripe at checkout. I\'ll email you a tracking number once it ships.', 'questnerd' ); ?></p>
				</div>
			</details>
		</section>
	</section>
</main>

<?php get_footer(); ?>
