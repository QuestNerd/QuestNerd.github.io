<?php
/**
 * Single template for `qn_product` CPT (the WordPress equivalent of
 * /product.html?id=…). Renders the detail view in PHP for SEO, then
 * mounts a "you might also like" grid below.
 *
 * The pre-existing assets/js/detail.js can still optionally hydrate
 * this page — we expose `window.QN_DETAIL_ID` so it knows which
 * product it's looking at without needing the `?id=` query param.
 *
 * @package QuestNerd
 */
get_header();

while ( have_posts() ) : the_post();

$product   = qn_post_to_product( get_post() );
$type      = isset( $product['type'] ) ? $product['type'] : 'pc-download';
$labels    = qn_store_labels();
$cta_label = isset( $labels[ $type ] ) ? $labels[ $type ] : __( 'View', 'questnerd' );
$image     = $product['image'] ? $product['image'] : QN_THEME_URI . '/assets/img/questnerd-mark.svg';
$has_model = ! empty( $product['model'] );
?>

<script>window.QN_DETAIL_ID = <?php echo wp_json_encode( $product['id'] ); ?>;</script>

<main class="qn-wrap">
	<section class="section">
		<p class="meta"><a href="<?php echo esc_url( home_url( '/shop/' ) ); ?>"><?php esc_html_e( '← Back to shop', 'questnerd' ); ?></a></p>

		<article class="qn-detail" itemscope itemtype="https://schema.org/Product">
			<header class="section-head">
				<h1 itemprop="name"><?php echo esc_html( $product['title'] ); ?></h1>
				<?php if ( ! empty( $product['price'] ) ) : ?>
					<p class="product-price" itemprop="offers" itemscope itemtype="https://schema.org/Offer">
						<span itemprop="price"><?php echo esc_html( $product['price'] ); ?></span>
					</p>
				<?php endif; ?>
			</header>

			<div class="qn-detail-grid">
				<div class="qn-detail-media">
					<?php if ( $has_model ) : ?>
						<div class="model-viewer-wrap">
							<model-viewer src="<?php echo esc_url( $product['model'] ); ?>"
							              alt="<?php echo esc_attr( $product['title'] ); ?>"
							              camera-controls auto-rotate ar shadow-intensity="1" exposure="0.9"
							              style="width:100%; height:420px; background:#061008;"></model-viewer>
						</div>
					<?php else : ?>
						<img src="<?php echo esc_url( $image ); ?>" alt="<?php echo esc_attr( $product['title'] ); ?>" itemprop="image">
					<?php endif; ?>
				</div>

				<div class="qn-detail-body">
					<?php if ( ! empty( $product['description'] ) ) : ?>
						<p class="hero-lede" itemprop="description"><?php echo esc_html( $product['description'] ); ?></p>
					<?php endif; ?>

					<?php if ( ! empty( $product['longDescription'] ) ) : ?>
						<div class="entry-content"><?php echo wp_kses_post( $product['longDescription'] ); ?></div>
					<?php endif; ?>

					<div class="hero-cta-row">
						<?php if ( 'stripe' === $type ) : ?>
							<button type="button" class="qn-button qn-buy" data-qn-buy="<?php echo esc_attr( $product['id'] ); ?>"><?php echo esc_html( $cta_label ); ?></button>
						<?php else :
							$href = isset( $product['url'] ) && $product['url'] ? $product['url'] : '#';
							$is_external = (bool) preg_match( '#^https?://#', $href );
						?>
							<a class="qn-button" href="<?php echo esc_url( $href ); ?>"<?php echo $is_external ? ' target="_blank" rel="noopener noreferrer"' : ''; ?>><?php echo esc_html( $cta_label ); ?></a>
						<?php endif; ?>
					</div>

					<?php if ( ! empty( $product['specs'] ) && is_array( $product['specs'] ) ) : ?>
						<h2><?php esc_html_e( 'Specs', 'questnerd' ); ?></h2>
						<dl class="qn-specs">
							<?php foreach ( $product['specs'] as $spec ) :
								if ( ! is_array( $spec ) ) { continue; }
								$label = isset( $spec['label'] ) ? $spec['label'] : '';
								$value = isset( $spec['value'] ) ? $spec['value'] : '';
								if ( ! $label && ! $value ) { continue; }
							?>
								<dt><?php echo esc_html( $label ); ?></dt>
								<dd><?php echo esc_html( $value ); ?></dd>
							<?php endforeach; ?>
						</dl>
					<?php endif; ?>
				</div>
			</div>

			<?php if ( ! empty( $product['story'] ) ) : ?>
				<section class="card entry-content" style="margin-top:1.5rem;">
					<h2><?php esc_html_e( 'The story', 'questnerd' ); ?></h2>
					<?php echo wp_kses_post( $product['story'] ); ?>
				</section>
			<?php endif; ?>

			<?php if ( ! empty( $product['faq'] ) && is_array( $product['faq'] ) ) : ?>
				<section class="qn-faq" style="margin-top:1.5rem;">
					<h2><?php esc_html_e( 'FAQ', 'questnerd' ); ?></h2>
					<?php foreach ( $product['faq'] as $entry ) :
						if ( ! is_array( $entry ) ) { continue; }
						$q = isset( $entry['q'] ) ? $entry['q'] : '';
						$a = isset( $entry['a'] ) ? $entry['a'] : '';
						if ( ! $q && ! $a ) { continue; }
					?>
						<details>
							<summary><?php echo esc_html( $q ); ?></summary>
							<div><?php echo wp_kses_post( $a ); ?></div>
						</details>
					<?php endforeach; ?>
				</section>
			<?php endif; ?>
		</article>
	</section>

	<section class="section" id="related">
		<div class="section-head"><h2><?php esc_html_e( 'You might also like', 'questnerd' ); ?></h2></div>
		<?php qn_render_product_grid( array(
			'featured' => true,
			'limit'    => 3,
			'empty'    => __( 'No related items yet.', 'questnerd' ),
		) ); ?>
	</section>
</main>

<?php
endwhile;
get_footer();
