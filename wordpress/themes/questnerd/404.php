<?php
/**
 * 404 page. Mirrors the static 404.html.
 *
 * @package QuestNerd
 */
get_header(); ?>

<main class="qn-wrap">
	<section class="section">
		<article class="card entry-content" style="text-align:center;">
			<h1><?php esc_html_e( '404 — Page not found', 'questnerd' ); ?></h1>
			<p class="hero-lede"><?php esc_html_e( 'That page wandered off the map. The print probably failed at 80%.', 'questnerd' ); ?></p>
			<p><?php esc_html_e( 'Try one of these instead:', 'questnerd' ); ?></p>
			<div class="hero-cta-row" style="justify-content:center;">
				<a class="qn-button"       href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Home', 'questnerd' ); ?></a>
				<a class="qn-button ghost" href="<?php echo esc_url( home_url( '/shop/' ) ); ?>"><?php esc_html_e( 'Shop', 'questnerd' ); ?></a>
				<a class="qn-button ghost" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Contact', 'questnerd' ); ?></a>
			</div>
		</article>
	</section>
</main>

<?php get_footer(); ?>
