<?php
/**
 * Single template for `qn_project` CPT (WP equivalent of
 * /project.html?id=…).
 *
 * @package QuestNerd
 */
get_header();

while ( have_posts() ) : the_post();

$project = qn_post_to_project( get_post() );
$image   = $project['image'] ? $project['image'] : QN_THEME_URI . '/assets/img/questnerd-mark.svg';
?>

<main class="qn-wrap">
	<section class="section">
		<p class="meta"><a href="<?php echo esc_url( home_url( '/portfolio/' ) ); ?>"><?php esc_html_e( '← Back to portfolio', 'questnerd' ); ?></a></p>

		<article class="qn-detail" itemscope itemtype="https://schema.org/CreativeWork">
			<header class="section-head">
				<h1 itemprop="name"><?php echo esc_html( $project['title'] ); ?></h1>
				<?php if ( ! empty( $project['date'] ) || ! empty( $project['role'] ) ) : ?>
					<p class="meta">
						<?php if ( ! empty( $project['date'] ) ) : ?>
							<span itemprop="datePublished"><?php echo esc_html( $project['date'] ); ?></span>
						<?php endif; ?>
						<?php if ( ! empty( $project['role'] ) ) : ?>
							· <?php echo esc_html( $project['role'] ); ?>
						<?php endif; ?>
					</p>
				<?php endif; ?>
			</header>

			<div class="qn-detail-grid">
				<div class="qn-detail-media">
					<img src="<?php echo esc_url( $image ); ?>" alt="<?php echo esc_attr( $project['title'] ); ?>" itemprop="image">
				</div>
				<div class="qn-detail-body">
					<?php if ( ! empty( $project['summary'] ) ) : ?>
						<p class="hero-lede" itemprop="abstract"><?php echo esc_html( $project['summary'] ); ?></p>
					<?php endif; ?>

					<dl class="qn-specs">
						<?php if ( ! empty( $project['duration'] ) ) : ?>
							<dt><?php esc_html_e( 'Duration', 'questnerd' ); ?></dt><dd><?php echo esc_html( $project['duration'] ); ?></dd>
						<?php endif; ?>
						<?php if ( ! empty( $project['moneySpent'] ) ) : ?>
							<dt><?php esc_html_e( 'Money spent', 'questnerd' ); ?></dt><dd><?php echo esc_html( $project['moneySpent'] ); ?></dd>
						<?php endif; ?>
						<?php if ( ! empty( $project['moneySaved'] ) ) : ?>
							<dt><?php esc_html_e( 'Money saved', 'questnerd' ); ?></dt><dd><?php echo esc_html( $project['moneySaved'] ); ?></dd>
						<?php endif; ?>
						<?php if ( ! empty( $project['tech'] ) && is_array( $project['tech'] ) ) : ?>
							<dt><?php esc_html_e( 'Tech', 'questnerd' ); ?></dt><dd><?php echo esc_html( implode( ', ', $project['tech'] ) ); ?></dd>
						<?php endif; ?>
						<?php if ( ! empty( $project['outcome'] ) ) : ?>
							<dt><?php esc_html_e( 'Outcome', 'questnerd' ); ?></dt><dd><?php echo esc_html( $project['outcome'] ); ?></dd>
						<?php endif; ?>
					</dl>
				</div>
			</div>

			<?php if ( ! empty( $project['story'] ) ) : ?>
				<section class="card entry-content" style="margin-top:1.5rem;">
					<h2><?php esc_html_e( 'The case study', 'questnerd' ); ?></h2>
					<?php echo wp_kses_post( $project['story'] ); ?>
				</section>
			<?php endif; ?>
		</article>
	</section>

	<section class="section" id="related">
		<div class="section-head"><h2><?php esc_html_e( 'More case studies', 'questnerd' ); ?></h2></div>
		<?php qn_render_project_grid( array(
			'limit' => 3,
			'empty' => __( 'No other case studies yet.', 'questnerd' ),
		) ); ?>
	</section>
</main>

<?php
endwhile;
get_footer();
