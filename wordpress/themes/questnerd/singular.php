<?php
/**
 * Generic singular template fallback (single posts).
 *
 * @package QuestNerd
 */
get_header(); ?>

<main class="qn-wrap">
	<?php while ( have_posts() ) : the_post(); ?>
		<section class="section">
			<div class="section-head">
				<h1><?php the_title(); ?></h1>
				<?php if ( 'post' === get_post_type() ) : ?>
					<p class="meta"><?php echo esc_html( get_the_date() ); ?></p>
				<?php endif; ?>
			</div>
			<article id="post-<?php the_ID(); ?>" <?php post_class( 'card entry-content' ); ?>>
				<?php if ( has_post_thumbnail() ) : the_post_thumbnail( 'large' ); endif; ?>
				<?php the_content(); ?>
			</article>
		</section>
	<?php endwhile; ?>
</main>

<?php get_footer(); ?>
