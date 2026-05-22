<?php
/**
 * Template Name: QuestNerd — Home (front page)
 *
 * Mirrors index.html from the static site.
 *
 * @package QuestNerd
 */
get_header();

$tagline = get_bloginfo( 'description' );
?>

<main class="qn-wrap">
	<section class="hero">
		<div class="hero-grid">
			<div>
				<h1><?php esc_html_e( 'Build. Print. Play.', 'questnerd' ); ?> <span class="accent"><?php esc_html_e( 'Ship', 'questnerd' ); ?></span>.</h1>
				<p class="hero-lede"><?php echo esc_html( $tagline ? $tagline : __( 'QuestNerd is the hub for high-quality 3D printed products, digital STL/OBJ models, original apps and games, and the project portfolio behind it all — built by one engineer who actually ships.', 'questnerd' ) ); ?></p>
				<div class="hero-cta-row">
					<a class="qn-button"       href="<?php echo esc_url( home_url( '/shop/' ) ); ?>"><?php esc_html_e( 'Shop 3D Prints &amp; Models', 'questnerd' ); ?></a>
					<a class="qn-button ghost" href="<?php echo esc_url( home_url( '/portfolio/' ) ); ?>"><?php esc_html_e( 'See the portfolio', 'questnerd' ); ?></a>
				</div>
				<div class="trust-row">
					<span class="badge"><?php esc_html_e( 'Secure checkout', 'questnerd' ); ?></span>
					<span class="badge"><?php esc_html_e( 'Worldwide shipping', 'questnerd' ); ?></span>
					<span class="badge"><?php esc_html_e( 'Interactive 3D previews', 'questnerd' ); ?></span>
					<span class="badge"><?php esc_html_e( 'Built &amp; supported by the maker', 'questnerd' ); ?></span>
				</div>
			</div>
			<aside class="hero-art" aria-hidden="true">
				<img class="qn-logo" src="<?php echo esc_url( QN_THEME_URI . '/assets/img/questnerd-mark.svg' ); ?>" alt="" width="360" height="360">
			</aside>
		</div>
	</section>

	<section class="section" id="featured">
		<div class="section-head">
			<h2><?php esc_html_e( 'Featured 3D Prints &amp; Models', 'questnerd' ); ?></h2>
			<p class="meta"><a href="<?php echo esc_url( home_url( '/shop/' ) ); ?>"><?php esc_html_e( 'Browse the full shop →', 'questnerd' ); ?></a></p>
		</div>
		<?php qn_render_product_grid( array(
			'featured' => true,
			'limit'    => 4,
			'empty'    => __( 'Add featured products (mark them Featured in the QuestNerd → Products admin).', 'questnerd' ),
		) ); ?>
	</section>

	<section class="section" id="apps-games">
		<div class="section-head">
			<h2><?php esc_html_e( 'Apps &amp; Games', 'questnerd' ); ?></h2>
			<p class="meta"><a href="<?php echo esc_url( home_url( '/apps/' ) ); ?>"><?php esc_html_e( 'See all apps &amp; games →', 'questnerd' ); ?></a></p>
		</div>
		<?php qn_render_product_grid( array(
			'type'  => 'googleplay',
			'limit' => 3,
			'empty' => __( 'Add Google Play entries in QuestNerd → Products.', 'questnerd' ),
		) ); ?>
	</section>

	<section class="section" id="model-viewer-demo">
		<div class="section-head">
			<h2><?php esc_html_e( 'Spin it before you buy it', 'questnerd' ); ?></h2>
			<p class="meta"><?php esc_html_e( 'Every model listing can support an interactive 3D preview.', 'questnerd' ); ?></p>
		</div>
		<div class="card">
			<p><?php
				/* translators: HTML allowed inside */
				echo wp_kses_post( __( 'Embed any <code>.glb</code> / <code>.gltf</code> file into a product page by dropping a <code>&lt;model-viewer&gt;</code> element into the HTML — visitors can rotate, zoom, and inspect the model in their browser, on mobile or desktop, with no plugins.', 'questnerd' ) ); ?></p>
			<div class="model-viewer-wrap">
				<model-viewer
					src="<?php echo esc_url( QN_THEME_URI . '/assets/models/sample-cube.glb' ); ?>"
					alt="<?php esc_attr_e( 'Interactive 3D preview — a sample QuestNerd cube', 'questnerd' ); ?>"
					camera-controls
					auto-rotate
					ar
					shadow-intensity="1"
					exposure="0.9"
					style="width:100%; height:360px; background:#061008;">
				</model-viewer>
			</div>
			<p class="meta"><?php esc_html_e( 'Drag to rotate · scroll to zoom · tap the AR icon on mobile. Set the “3D model URL” field on any product to surface a live 3D preview on its product page.', 'questnerd' ); ?></p>
		</div>
	</section>

	<section class="section" id="portfolio">
		<div class="section-head">
			<h2><?php esc_html_e( 'Portfolio &amp; Case Studies', 'questnerd' ); ?></h2>
			<p class="meta"><a href="<?php echo esc_url( home_url( '/portfolio/' ) ); ?>"><?php esc_html_e( 'Read every project →', 'questnerd' ); ?></a></p>
		</div>
		<?php qn_render_project_grid( array(
			'limit' => 2,
			'empty' => __( 'No projects yet. Add entries in QuestNerd → Projects.', 'questnerd' ),
		) ); ?>
	</section>

	<section class="section" id="downloads-cta">
		<div class="section-head">
			<h2><?php esc_html_e( 'PC Downloads', 'questnerd' ); ?></h2>
			<p class="meta"><a href="<?php echo esc_url( home_url( '/downloads/' ) ); ?>"><?php esc_html_e( 'All downloads →', 'questnerd' ); ?></a></p>
		</div>
		<?php qn_render_product_grid( array(
			'type'  => 'pc-download,stripe',
			'limit' => 3,
			'empty' => __( 'Add PC downloads in QuestNerd → Products.', 'questnerd' ),
		) ); ?>
	</section>

	<section class="section">
		<div class="newsletter">
			<div>
				<h2><?php esc_html_e( 'Get drops, devlogs, and discount codes', 'questnerd' ); ?></h2>
				<p class="meta"><?php esc_html_e( 'Occasional emails. Early access to new prints and apps. Unsubscribe anytime.', 'questnerd' ); ?></p>
			</div>
			<form data-qn-newsletter aria-label="<?php esc_attr_e( 'Newsletter signup', 'questnerd' ); ?>">
				<label class="screen-reader-text" for="qn-newsletter-email"><?php esc_html_e( 'Email address', 'questnerd' ); ?></label>
				<input id="qn-newsletter-email" type="email" name="email" placeholder="you@example.com" required>
				<button type="submit"><?php esc_html_e( 'Subscribe', 'questnerd' ); ?></button>
				<p class="qn-newsletter-msg meta" hidden role="status"></p>
			</form>
		</div>
	</section>
</main>

<?php get_footer(); ?>
