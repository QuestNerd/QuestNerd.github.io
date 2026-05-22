<?php
/**
 * Template Name: QuestNerd — Portfolio
 *
 * Mirrors portfolio.html.
 *
 * @package QuestNerd
 */
get_header(); ?>

<main class="qn-wrap">
	<section class="section">
		<div class="section-head">
			<h1><?php esc_html_e( 'Portfolio &amp; Case Studies', 'questnerd' ); ?></h1>
			<p class="meta"><?php esc_html_e( 'A look behind the products — the projects, prints, and apps that ship out of the workshop.', 'questnerd' ); ?></p>
		</div>

		<?php qn_render_project_grid( array(
			'empty' => __( 'No portfolio entries yet. Add some in QuestNerd → Projects.', 'questnerd' ),
		) ); ?>

		<div class="card" style="margin-top:2rem;">
			<h2><?php esc_html_e( 'Want to discuss a project?', 'questnerd' ); ?></h2>
			<p class="meta"><?php esc_html_e( 'Custom commissions, collaborations, and bug reports are all welcome.', 'questnerd' ); ?></p>
			<p>
				<a class="qn-button"       href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Get in touch', 'questnerd' ); ?></a>
				<a class="qn-button ghost" href="<?php echo esc_url( home_url( '/about/' ) ); ?>"><?php esc_html_e( 'About QuestNerd', 'questnerd' ); ?></a>
			</p>
		</div>
	</section>
</main>

<?php get_footer(); ?>
