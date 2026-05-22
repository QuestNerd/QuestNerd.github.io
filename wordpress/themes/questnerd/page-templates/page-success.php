<?php
/**
 * Template Name: QuestNerd — Checkout Success
 *
 * Mirrors success.html.
 *
 * @package QuestNerd
 */
get_header(); ?>

<main class="qn-wrap">
	<section class="section">
		<article class="card entry-content" style="text-align:center;">
			<h1><?php esc_html_e( 'Thanks for your order! 🎉', 'questnerd' ); ?></h1>
			<p class="hero-lede"><?php esc_html_e( 'Your payment went through and Stripe has sent you a receipt by email.', 'questnerd' ); ?></p>
			<p hidden><?php esc_html_e( 'Order reference:', 'questnerd' ); ?> <code id="qn-order-ref">—</code></p>
			<p>
				<?php
				printf(
					wp_kses(
						/* translators: %s = contact URL */
						__( 'If your purchase included a digital download, you\'ll receive delivery instructions by email shortly. If anything seems off, just reply to the receipt or <a href="%s">contact QuestNerd</a> directly.', 'questnerd' ),
						array( 'a' => array( 'href' => array() ) )
					),
					esc_url( home_url( '/contact/' ) )
				);
				?>
			</p>
			<div class="hero-cta-row" style="justify-content:center;">
				<a class="qn-button"       href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Back to home', 'questnerd' ); ?></a>
				<a class="qn-button ghost" href="<?php echo esc_url( home_url( '/shop/' ) ); ?>"><?php esc_html_e( 'Keep shopping', 'questnerd' ); ?></a>
			</div>
		</article>

		<article id="qn-order-download" class="card" hidden style="margin-top:1.5rem;">
			<h2><?php esc_html_e( 'Your download', 'questnerd' ); ?></h2>
			<p class="meta"><?php esc_html_e( 'If your purchase included one of the files below, the email receipt has the download link. The list is shown here for reference.', 'questnerd' ); ?></p>
			<ul class="qn-files"></ul>
		</article>
	</section>

	<section class="section" id="cross-sell">
		<div class="section-head">
			<h2><?php esc_html_e( 'While you\'re here…', 'questnerd' ); ?></h2>
			<p class="meta"><?php esc_html_e( 'Other things people who buy from QuestNerd tend to like.', 'questnerd' ); ?></p>
		</div>
		<?php qn_render_product_grid( array(
			'featured' => true,
			'limit'    => 3,
			'empty'    => __( 'Mark some products Featured in QuestNerd → Products to populate cross-sells.', 'questnerd' ),
		) ); ?>
	</section>
</main>

<?php get_footer(); ?>
