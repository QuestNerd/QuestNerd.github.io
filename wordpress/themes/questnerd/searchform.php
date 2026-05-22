<?php
/**
 * Search form. Matches the static site's behaviour where pressing "/"
 * opens the Lunr-powered overlay rendered by assets/js/search.js.
 *
 * @package QuestNerd
 */
?>
<form role="search" method="get" class="search-form" action="<?php echo esc_url( home_url( '/' ) ); ?>">
	<label for="s" class="screen-reader-text"><?php esc_html_e( 'Search', 'questnerd' ); ?></label>
	<input type="search" id="s" name="s" placeholder="<?php esc_attr_e( 'Search…', 'questnerd' ); ?>" value="<?php echo esc_attr( get_search_query() ); ?>">
	<button type="submit" class="qn-button"><?php esc_html_e( 'Search', 'questnerd' ); ?></button>
</form>
