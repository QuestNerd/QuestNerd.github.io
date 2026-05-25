<?php
/**
 * Server-side card/grid renderers.
 *
 * These functions output the exact same HTML produced by
 * assets/js/main.js:renderCard / renderProjectCard so the existing
 * stylesheet (assets/css/style.css) styles them without any tweaks, and
 * so the buy-button wiring in main.js:wireBuyButtons() still picks them
 * up via the `data-qn-buy` attribute.
 *
 * @package QuestNerd
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

/**
 * Internal: store-name labels (mirrors STORE_LABELS in main.js).
 */
function qn_store_labels() {
	return array(
		'cults3d'     => __( 'View on Cults3D',     'questnerd' ),
		'etsy'        => __( 'View on Etsy',        'questnerd' ),
		'googleplay'  => __( 'Get it on Google Play','questnerd' ),
		'pc-download' => __( 'Download',            'questnerd' ),
		'stripe'      => __( 'Buy now',             'questnerd' ),
	);
}

/**
 * Render a single product card given a product array (same shape as the
 * objects in window.QN_PRODUCTS).
 */
function qn_render_product_card( $product ) {
	$labels      = qn_store_labels();
	$type        = isset( $product['type'] ) ? $product['type'] : 'pc-download';
	$type_label  = isset( $labels[ $type ] ) ? $labels[ $type ] : __( 'View', 'questnerd' );
	$title       = isset( $product['title'] ) ? $product['title'] : __( 'Untitled', 'questnerd' );
	$desc        = isset( $product['description'] ) ? $product['description'] : '';
	$price       = isset( $product['price'] ) ? $product['price'] : '';
	$image       = isset( $product['image'] ) && $product['image']
		? $product['image']
		: QN_THEME_URI . '/assets/img/questnerd-mark.svg';
	$id          = isset( $product['id'] ) ? $product['id'] : '';
	$detail_url  = qn_product_permalink( $id, $product );
	$has_model   = ! empty( $product['model'] );

	ob_start();
	?>
	<article class="product-card" aria-label="<?php echo esc_attr( $title ); ?>">
		<a class="product-thumb-link" href="<?php echo esc_url( $detail_url ); ?>" aria-label="<?php echo esc_attr( sprintf( __( 'View details for %s', 'questnerd' ), $title ) ); ?>">
			<div class="product-thumb">
				<?php if ( $has_model ) : ?>
					<span class="qn-badge-3d" title="<?php esc_attr_e( 'Interactive 3D preview available', 'questnerd' ); ?>">3D</span>
				<?php endif; ?>
				<img src="<?php echo esc_url( $image ); ?>" alt="<?php echo esc_attr( $title ); ?>">
			</div>
		</a>
		<h3 class="product-title"><a href="<?php echo esc_url( $detail_url ); ?>"><?php echo esc_html( $title ); ?></a></h3>
		<?php if ( $desc ) : ?>
			<p class="meta"><?php echo esc_html( $desc ); ?></p>
		<?php endif; ?>
		<?php if ( $price ) : ?>
			<p class="product-price"><?php echo esc_html( $price ); ?></p>
		<?php endif; ?>
		<div class="product-card-actions">
			<?php if ( 'stripe' === $type ) : ?>
				<button type="button" class="qn-button qn-buy" data-qn-buy="<?php echo esc_attr( $id ); ?>"><?php echo esc_html( $type_label ); ?></button>
			<?php else :
				$href = isset( $product['url'] ) && $product['url'] && '#' !== $product['url'] ? $product['url'] : '#';
				$is_external = (bool) preg_match( '#^https?://#', $href );
			?>
				<a class="qn-button ghost" href="<?php echo esc_url( $href ); ?>"<?php echo $is_external ? ' target="_blank" rel="noopener noreferrer"' : ''; ?>><?php echo esc_html( $type_label ); ?></a>
			<?php endif; ?>
			<a class="qn-button ghost" href="<?php echo esc_url( $detail_url ); ?>"><?php esc_html_e( 'Details', 'questnerd' ); ?></a>
		</div>
	</article>
	<?php
	return ob_get_clean();
}

/**
 * Render a single project card.
 */
function qn_render_project_card( $project ) {
	$title   = isset( $project['title'] ) ? $project['title'] : __( 'Untitled project', 'questnerd' );
	$summary = isset( $project['summary'] ) ? $project['summary'] : '';
	$date    = isset( $project['date'] ) ? $project['date'] : '';
	$image   = isset( $project['image'] ) && $project['image']
		? $project['image']
		: QN_THEME_URI . '/assets/img/questnerd-mark.svg';
	$id      = isset( $project['id'] ) ? $project['id'] : '';
	$href    = qn_project_permalink( $id, $project );

	ob_start();
	?>
	<article class="product-card" aria-label="<?php echo esc_attr( $title ); ?>">
		<a class="product-thumb-link" href="<?php echo esc_url( $href ); ?>">
			<div class="product-thumb"><img src="<?php echo esc_url( $image ); ?>" alt="<?php echo esc_attr( $title ); ?>"></div>
		</a>
		<h3 class="product-title"><a href="<?php echo esc_url( $href ); ?>"><?php echo esc_html( $title ); ?></a></h3>
		<?php if ( $date ) : ?>
			<p class="meta"><?php echo esc_html( $date ); ?></p>
		<?php endif; ?>
		<?php if ( $summary ) : ?>
			<p class="meta"><?php echo esc_html( $summary ); ?></p>
		<?php endif; ?>
		<a class="qn-button ghost" href="<?php echo esc_url( $href ); ?>"><?php esc_html_e( 'Read case study', 'questnerd' ); ?></a>
	</article>
	<?php
	return ob_get_clean();
}

/**
 * Render a grid of product cards matching the provided filters.
 *
 * @param array $args {
 *   @type string|array $type     Comma-separated string or array of types to include.
 *   @type bool         $featured Only featured items.
 *   @type int          $limit    Max items (0 = no limit).
 *   @type string       $empty    Message shown when the filter matches nothing.
 * }
 */
function qn_render_product_grid( $args = array() ) {
	$args = wp_parse_args( $args, array(
		'type'     => '',
		'featured' => false,
		'limit'    => 0,
		'empty'    => __( 'No items yet.', 'questnerd' ),
	) );

	$types = $args['type'];
	if ( is_string( $types ) ) {
		$types = array_filter( array_map( 'trim', explode( ',', $types ) ) );
	}

	$products = qn_get_products();
	$products = array_values( array_filter( $products, function ( $p ) use ( $types, $args ) {
		if ( $args['featured'] && empty( $p['featured'] ) ) {
			return false;
		}
		if ( ! empty( $types ) && ( empty( $p['type'] ) || ! in_array( $p['type'], $types, true ) ) ) {
			return false;
		}
		return true;
	} ) );

	if ( $args['limit'] > 0 ) {
		$products = array_slice( $products, 0, (int) $args['limit'] );
	}

	if ( empty( $products ) ) {
		echo '<p class="meta">' . esc_html( $args['empty'] ) . '</p>';
		return;
	}

	echo '<div class="product-grid">';
	foreach ( $products as $p ) {
		echo qn_render_product_card( $p ); // already escaped inside renderer
	}
	echo '</div>';
}

/**
 * Render the portfolio grid.
 *
 * @param array $args {
 *   @type int    $limit
 *   @type string $empty
 * }
 */
function qn_render_project_grid( $args = array() ) {
	$args = wp_parse_args( $args, array(
		'limit' => 0,
		'empty' => __( 'No projects yet.', 'questnerd' ),
	) );

	$projects = qn_get_projects();
	// Sort by date desc (string compare on "YYYY-MM" / ISO dates).
	usort( $projects, function ( $a, $b ) {
		return strcmp(
			isset( $b['date'] ) ? (string) $b['date'] : '',
			isset( $a['date'] ) ? (string) $a['date'] : ''
		);
	} );
	if ( $args['limit'] > 0 ) {
		$projects = array_slice( $projects, 0, (int) $args['limit'] );
	}

	if ( empty( $projects ) ) {
		echo '<p class="meta">' . esc_html( $args['empty'] ) . '</p>';
		return;
	}

	echo '<div class="product-grid">';
	foreach ( $projects as $p ) {
		echo qn_render_project_card( $p );
	}
	echo '</div>';
}

/**
 * Resolve a product's permalink. Prefers a WP `qn_product` post with the
 * matching slug, falls back to a query-string URL so the existing
 * detail.js can still hydrate.
 */
function qn_product_permalink( $id, $product = array() ) {
	if ( $id ) {
		$post = get_page_by_path( $id, OBJECT, 'qn_product' );
		if ( $post ) {
			return get_permalink( $post );
		}
	}
	return add_query_arg( 'id', $id, home_url( '/product/' ) );
}

/**
 * Resolve a project's permalink.
 */
function qn_project_permalink( $id, $project = array() ) {
	if ( $id ) {
		$post = get_page_by_path( $id, OBJECT, 'qn_project' );
		if ( $post ) {
			return get_permalink( $post );
		}
	}
	return add_query_arg( 'id', $id, home_url( '/project/' ) );
}

/**
 * Convenience wrapper to print the primary nav as a plain <ul>. The
 * static site's CSS targets `#primary-menu li a` so we keep that markup.
 */
function qn_print_primary_menu() {
	if ( has_nav_menu( 'primary' ) ) {
		wp_nav_menu( array(
			'theme_location'  => 'primary',
			'container'       => false,
			'menu_id'         => 'primary-menu',
			'menu_class'      => '',
			'fallback_cb'     => false,
			'depth'           => 1,
			'items_wrap'      => '<ul id="%1$s">%3$s</ul>',
		) );
		return;
	}

	// Default menu if the admin hasn't configured one yet.
	$items = array(
		'/'                    => __( 'Home',             'questnerd' ),
		'/shop/'               => __( 'Shop',             'questnerd' ),
		'/models/'             => __( '3D Models',        'questnerd' ),
		'/games/'              => __( 'Games',            'questnerd' ),
		'/tools-lab/'          => __( 'Tools Lab',        'questnerd' ),
		'/downloads/'          => __( 'Downloads',        'questnerd' ),
		'/makerworld-prints/'  => __( 'MakerWorld Prints','questnerd' ),
		'/portfolio/'          => __( 'Portfolio',        'questnerd' ),
		'/about/'              => __( 'About',            'questnerd' ),
		'/contact/'            => __( 'Contact',          'questnerd' ),
	);
	echo '<ul id="primary-menu">';
	foreach ( $items as $path => $label ) {
		printf( '<li><a href="%s">%s</a></li>', esc_url( home_url( $path ) ), esc_html( $label ) );
	}
	echo '</ul>';
}
