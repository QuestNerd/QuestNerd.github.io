<?php
/**
 * Default page template — used by static pages (About, Contact, Privacy,
 * Terms, Shipping & Returns, etc.) whose body is just the post content.
 *
 * @package QuestNerd
 */
get_header(); ?>

<main class="qn-wrap">
	<?php while ( have_posts() ) : the_post(); ?>
		<section class="section">
			<div class="section-head">
				<h1><?php the_title(); ?></h1>
			</div>
			<article id="post-<?php the_ID(); ?>" <?php post_class( 'card entry-content' ); ?>>
				<?php the_content(); ?>
			</article>
		</section>
	<?php endwhile; ?>
</main>

<?php get_footer(); ?>
