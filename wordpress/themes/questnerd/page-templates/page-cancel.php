<?php
/**
 * Template Name: QuestNerd — Checkout Cancelled
 *
 * Mirrors cancel.html.
 *
 * @package QuestNerd
 */
get_header(); ?>

<main class="qn-wrap">
	<section class="section">
		<article class="card entry-content" style="text-align:center;">
			<h1><?php esc_html_e( 'Checkout cancelled', 'questnerd' ); ?></h1>
			<p class="hero-lede"><?php esc_html_e( 'No charge was made. You can go back and try again any time.', 'questnerd' ); ?></p>
			<div class="hero-cta-row" style="justify-content:center;">
				<a class="qn-button"       href="<?php echo esc_url( home_url( '/downloads/' ) ); ?>"><?php esc_html_e( 'Back to downloads', 'questnerd' ); ?></a>
				<a class="qn-button ghost" href="<?php echo esc_url( home_url( '/shop/' ) ); ?>"><?php esc_html_e( 'Browse the shop', 'questnerd' ); ?></a>
			</div>
			<p class="meta" style="margin-top:1.5rem;">
				<?php
				printf(
					wp_kses(
						/* translators: %s = contact URL */
						__( 'Trouble checking out? <a href="%s">Email QuestNerd</a> and we\'ll sort it out.', 'questnerd' ),
						array( 'a' => array( 'href' => array() ) )
					),
					esc_url( home_url( '/contact/' ) )
				);
				?>
			</p>
		</article>
	</section>
</main>

<?php get_footer(); ?>
