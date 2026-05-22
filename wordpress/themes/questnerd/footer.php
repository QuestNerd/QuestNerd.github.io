<?php
/**
 * Site footer. Mirrors partials/footer.html.
 *
 * @package QuestNerd
 */
$year = (int) date( 'Y' );
?>
<footer class="site-footer">
	<div class="qn-wrap">
		<div class="footer-grid">
			<section>
				<h3><?php echo esc_html( get_bloginfo( 'name' ) ); ?></h3>
				<p><?php echo esc_html( get_bloginfo( 'description' ) ); ?></p>
			</section>
			<section>
				<h3><?php esc_html_e( 'Shop', 'questnerd' ); ?></h3>
				<?php if ( has_nav_menu( 'footer-shop' ) ) {
					wp_nav_menu( array(
						'theme_location' => 'footer-shop',
						'container'      => false,
						'depth'          => 1,
						'menu_class'     => '',
					) );
				} else { ?>
					<ul>
						<li><a href="<?php echo esc_url( home_url( '/shop/' ) ); ?>"><?php esc_html_e( 'All products', 'questnerd' ); ?></a></li>
						<li><a href="<?php echo esc_url( home_url( '/models/' ) ); ?>"><?php esc_html_e( '3D Models', 'questnerd' ); ?></a></li>
						<li><a href="<?php echo esc_url( home_url( '/apps/' ) ); ?>"><?php esc_html_e( 'Apps &amp; Games', 'questnerd' ); ?></a></li>
						<li><a href="<?php echo esc_url( home_url( '/downloads/' ) ); ?>"><?php esc_html_e( 'PC Downloads', 'questnerd' ); ?></a></li>
						<li><a href="<?php echo esc_url( home_url( '/makerworld-prints/' ) ); ?>"><?php esc_html_e( 'MakerWorld Prints', 'questnerd' ); ?></a></li>
					</ul>
				<?php } ?>
			</section>
			<section>
				<h3><?php esc_html_e( 'Explore', 'questnerd' ); ?></h3>
				<?php if ( has_nav_menu( 'footer-explore' ) ) {
					wp_nav_menu( array(
						'theme_location' => 'footer-explore',
						'container'      => false,
						'depth'          => 1,
						'menu_class'     => '',
					) );
				} else { ?>
					<ul>
						<li><a href="<?php echo esc_url( home_url( '/portfolio/' ) ); ?>"><?php esc_html_e( 'Portfolio', 'questnerd' ); ?></a></li>
						<li><a href="<?php echo esc_url( home_url( '/about/' ) ); ?>"><?php esc_html_e( 'About', 'questnerd' ); ?></a></li>
						<li><a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Contact', 'questnerd' ); ?></a></li>
						<li><a data-config-mailto href="mailto:<?php echo esc_attr( get_theme_mod( 'qn_contact_email', get_option( 'admin_email' ) ) ); ?>"><?php esc_html_e( 'Email QuestNerd', 'questnerd' ); ?></a></li>
					</ul>
				<?php } ?>
			</section>
			<section>
				<h3><?php esc_html_e( 'Find me on', 'questnerd' ); ?></h3>
				<ul>
					<li><a data-config-href="CULTS3D_URL" href="#" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'Cults3D (digital models)', 'questnerd' ); ?></a></li>
					<li><a data-config-href="ETSY_URL" href="#" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'Etsy (physical prints)', 'questnerd' ); ?></a></li>
					<li><a data-config-href="GOOGLE_PLAY_URL" href="#" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'Google Play (apps)', 'questnerd' ); ?></a></li>
				</ul>
			</section>
			<section>
				<h3><?php esc_html_e( 'Legal', 'questnerd' ); ?></h3>
				<?php if ( has_nav_menu( 'footer-legal' ) ) {
					wp_nav_menu( array(
						'theme_location' => 'footer-legal',
						'container'      => false,
						'depth'          => 1,
						'menu_class'     => '',
					) );
				} else { ?>
					<ul>
						<li><a href="<?php echo esc_url( home_url( '/privacy-policy/' ) ); ?>"><?php esc_html_e( 'Privacy policy', 'questnerd' ); ?></a></li>
						<li><a href="<?php echo esc_url( home_url( '/terms/' ) ); ?>"><?php esc_html_e( 'Terms of service', 'questnerd' ); ?></a></li>
						<li><a href="<?php echo esc_url( home_url( '/shipping-returns/' ) ); ?>"><?php esc_html_e( 'Shipping &amp; returns', 'questnerd' ); ?></a></li>
					</ul>
				<?php } ?>
			</section>
		</div>
		<div class="footer-bottom">
			<p>&copy; <span data-config-text="CURRENT_YEAR"><?php echo esc_html( $year ); ?></span> <span data-config-text="SITE_NAME"><?php echo esc_html( get_bloginfo( 'name' ) ); ?></span>. <?php esc_html_e( 'All rights reserved.', 'questnerd' ); ?></p>
			<div class="payment-row">
				<ul aria-label="<?php esc_attr_e( 'Accepted payment methods', 'questnerd' ); ?>">
					<li class="pay">VISA</li>
					<li class="pay">MASTERCARD</li>
					<li class="pay">AMEX</li>
					<li class="pay">DISCOVER</li>
					<li class="pay">PAYPAL</li>
					<li class="pay">APPLE&nbsp;PAY</li>
					<li class="pay">GOOGLE&nbsp;PAY</li>
					<li class="pay">STRIPE</li>
				</ul>
			</div>
		</div>
	</div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
