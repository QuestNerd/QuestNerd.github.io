<?php
/**
 * Plugin Name: QuestNerd Content
 * Plugin URI: https://www.questnerd.com/
 * Description: Custom post types (Products, Projects, Filaments) and JSON importer for the QuestNerd WordPress theme. Mirrors the data model used by the original static QuestNerd.github.io site so the theme can render shop pages, portfolio, and the MakerWorld order form from familiar fields.
 * Version: 1.0.0
 * Author: QuestNerd
 * License: GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Requires PHP: 7.4
 * Text Domain: questnerd-content
 *
 * @package QuestNerdContent
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

define( 'QNC_VERSION', '1.0.0' );
define( 'QNC_DIR', plugin_dir_path( __FILE__ ) );
define( 'QNC_URL', plugin_dir_url( __FILE__ ) );

require_once QNC_DIR . 'inc/post-types.php';
require_once QNC_DIR . 'inc/meta-boxes.php';
require_once QNC_DIR . 'inc/rest.php';
require_once QNC_DIR . 'inc/importer.php';
require_once QNC_DIR . 'inc/settings.php';

register_activation_hook( __FILE__, function () {
	qnc_register_post_types();
	flush_rewrite_rules();
} );

register_deactivation_hook( __FILE__, function () {
	flush_rewrite_rules();
} );
