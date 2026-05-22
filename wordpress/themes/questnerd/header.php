<?php
/**
 * Site header. Mirrors partials/header.html from the static site but
 * resolves logo path, branding, and nav menu through WordPress.
 *
 * @package QuestNerd
 */
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php if ( function_exists( 'wp_body_open' ) ) { wp_body_open(); } ?>

<header class="site-header">
	<div class="qn-wrap site-header-inner">
		<div class="site-branding">
			<a class="qn-logo-link" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home" aria-label="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>">
				<?php if ( has_custom_logo() ) :
					the_custom_logo();
				else : ?>
					<img class="qn-logo" src="<?php echo esc_url( QN_THEME_URI . '/assets/img/questnerd-logo.svg' ); ?>" alt="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>" width="184" height="104">
				<?php endif; ?>
			</a>
		</div>
		<nav class="main-nav" aria-label="<?php esc_attr_e( 'Main menu', 'questnerd' ); ?>">
			<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-menu" aria-label="<?php esc_attr_e( 'Open menu', 'questnerd' ); ?>">
				<svg class="menu-toggle-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
					<line class="menu-toggle-bar menu-toggle-bar-1" x1="3" y1="6" x2="21" y2="6"/>
					<line class="menu-toggle-bar menu-toggle-bar-2" x1="3" y1="12" x2="21" y2="12"/>
					<line class="menu-toggle-bar menu-toggle-bar-3" x1="3" y1="18" x2="21" y2="18"/>
				</svg>
				<span class="screen-reader-text"><?php esc_html_e( 'Menu', 'questnerd' ); ?></span>
			</button>
			<?php qn_print_primary_menu(); ?>
			<button type="button" class="qn-search-trigger" data-qn-search-open aria-label="<?php esc_attr_e( 'Open site search (keyboard shortcut: forward slash)', 'questnerd' ); ?>" title="<?php esc_attr_e( 'Search (press /)', 'questnerd' ); ?>">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
				<span class="screen-reader-text"><?php esc_html_e( 'Search', 'questnerd' ); ?></span>
			</button>
		</nav>
	</div>
</header>
