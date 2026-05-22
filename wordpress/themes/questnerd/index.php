<?php
/**
 * Main index — used for the blog index and as a generic catch-all.
 *
 * @package QuestNerd
 */
get_header(); ?>

<main class="qn-wrap">
	<section class="section">
		<?php if ( have_posts() ) : ?>
			<div class="section-head">
				<h1><?php single_post_title(); ?></h1>
			</div>
			<?php while ( have_posts() ) : the_post(); ?>
				<article id="post-<?php the_ID(); ?>" <?php post_class( 'card entry-content' ); ?>>
					<h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
					<?php the_excerpt(); ?>
				</article>
			<?php endwhile; ?>
			<?php the_posts_pagination(); ?>
		<?php else : ?>
			<div class="section-head">
				<h1><?php esc_html_e( 'Nothing found', 'questnerd' ); ?></h1>
			</div>
			<p class="meta"><?php esc_html_e( 'Sorry, no content matched your criteria.', 'questnerd' ); ?></p>
		<?php endif; ?>
	</section>
</main>

<?php get_footer(); ?>
