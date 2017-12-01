<?php

/**
 * The MODA Draft File
 *
 * This is the first plugin in the MODA plugin suit for Wordpress. It allows users
 * that are registered to the web site to create MODA. Other plugins provide 
 * search, browse, edit and review functionali
 * that starts the plugin.
 *
 * @link              emmc.info
 * @since             1.0.0
 * @package           Moda_create
 *
 * @wordpress-plugin
 * Plugin Name:       moda_create
 * Plugin URI:        emmc.info/moda
 * Description:       This is a short description of what the plugin does. It's displayed in the WordPress admin area.
 * Version:           1.0.0
 * Author:            Adham Hashibon
 * Author URI:        emmc.info
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       moda_create
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

define( 'PLUGIN_NAME_VERSION', '2.0.0' );
ini_set('display_errors', 'On');
error_reporting(E_ALL);

// enqueue the JS scripts so that WP knows about them
add_action( 'wp_enqueue_scripts', 'enqueue_moda_scripts' );
function enqueue_moda_scripts() {
    $plugin_url = plugin_dir_url(__FILE__);
    wp_enqueue_script( 'moda_draft_script', $plugin_url . '/js/moda_draft_script.js', array('jquery'), false, false );
    wp_localize_script('moda_draft_script', 'ajax_object',
        array( 'ajax_url' => admin_url( 'admin-ajax.php' ), 'nonce' => wp_create_nonce('moda_draft' ), 
    ) );
}

// Register a new shortcode: [moda_draft]
add_shortcode( 'moda_draft', 'moda_draft_form' );


// add form handlers the wordpress way: 
add_action( 'wp_ajax_save_draft_in_DB', 'save_draft_in_DB'); 
//===============================================================
function save_draft_in_DB () {
    // also used for updates
//===============================================================
    if( ! wp_verify_nonce( $_REQUEST['nonce'], 'moda_draft' ) ){
        wp_send_json_error();
    }
    // test user permissions
    // test db access
    // sanitize fields
    // pen db, save fields, and if no error proceed.

    $update_moda = false;
    global $wpdb, $current_user;
    // create a test page on WP and print out what this function recieved
    // need to use $wpdb->update or insert...
    if (isset($_POST)) {
        $x=print_r($_POST, true);
        if ($_POST['action'] == "save_draft_in_DB") {
            $y=$_POST['serialized'];
            $params = array();
            parse_str($y, $params);
            $m=$params['moda_title'];
            // now save to the database
            // later we add sanitization of the fields and compose a nice dialouge box to tell the user all saved or not ! 
        }
    }
  

     // if moda_id is set and is not none
    if  ( isset($_POST['moda_id'] ) && $_POST [ 'moda_id' ] != 0) {
        $update_moda = true;
        $params['moda_id'] = $_POST [ 'moda_id' ];    
    }
    else 
    {
        $update_moda = false;
        $params[ 'moda_id' ] = 1;
    }
    
    $params['update_moda'] = ($update_moda == true) ? 1:0;
    
    // we are in userland MODA, so 
    $params['publish_status'] = "user";
    $params['source_id']  = 0; // need to get from the id of the existing moda, unless it is new. 
    

    //=======================================================
    $this_table = 'main'; 
    //=======================================================
    $table_name = $wpdb->prefix . 'moda_' . $this_table;
    $data_values = array ( 
            'moda_title'      =>  $params['moda_title'],
            'user_case_short' =>  $params['user_case_short'],
            'project_acronym' =>  $params['project_acronym'],
            'project_website' =>  $params['project_website'],
            'publish_status'  =>  $params['publish_status']
        );
       
    
      if ($update_moda) {
            $wpdb->update ( 
                $table_name, 
                $data_values, 
                array ('id' => $params['moda_id'])
            );
        }
        else
        {
            $wpdb->insert (
            $table_name, 
            $data_values     
            );
            // current moda id, the one we just stored. 
            $moda_id = $wpdb->insert_id; // the autoincrement col. 
            // and add to $params
            $params['moda_id'] = $moda_id;
        }   
    


    //=======================================================
    // UPDATE latest_registry
    //=======================================================
    If ( !$update_moda ) {

        $this_table = 'latest_registry'; 
        
        $table_name = $wpdb->prefix . 'moda_' . $this_table;
        $wpdb->insert(
            $table_name, 
            array ( 
                'moda_id'         =>  $params['moda_id'],
            )
        );
    }
        

    $current_user= wp_get_current_user();
    $params['user_id'] = $current_user->ID; 

    //=======================================================
    // UPDATE main_author
    //=======================================================
    
    if ( !$update_moda ) {
        $this_table = 'main_author'; 
        
        $table_name = $wpdb->prefix . 'moda_' . $this_table;
        $wpdb->insert(
            $table_name, 
            array ( 
                'moda_id'         =>  $params['moda_id'],
                'user_id'         =>  $params['user_id'],
             )
            );     
    }

    //=======================================================
    $this_table = 'overview_section'; 
    //=======================================================
    $moda_keys = array( 
        'moda_id', 
        'overview_usercase', 
        'publication_overview',
        'access_condition',
        'workflow_rational'
    );
       
    moda_update_table ($this_table, $moda_keys, $params, $update_moda, 'moda_id');

   //=======================================================
   $this_table = 'workflow'; 
   //=======================================================
   $moda_keys = array( 
       'moda_id', 
       'source_model_id', 
       'target_model_id',
       'coupling_type'
    );
    moda_update_table ($this_table, $moda_keys, $params, $update_moda, 'moda_id');

    //=======================================================
    $this_table = 'model'; 
   //=======================================================
   
   moda_update_models_table ($params, $update_moda);
 
    $json_str = json_encode($params, JSON_PRETTY_PRINT);
    $my_post = array(
        'ID'                => 1,
        'post_title'        => "TEST2",
        'post_content'      => print_r($json_str, true).print_r($params,true),
    );
    $post_id = wp_update_post( $my_post, true );                         
    if (is_wp_error($post_id)) {
        $errors = $post_id->get_error_messages();
        foreach ($errors as $error) {
            echo $error;
        }
    }


    $this_table = 'model'; 
        
        $table_name = $wpdb->prefix . 'moda_' . $this_table;
        $wpdb->insert(
            $table_name, 
            array ( 
                'model_description'         =>  $json_str,
             )
            );     
    

    wp_send_json_success( array(
        'script_response' => 'Your MODA Data is Saved.',
        'moda_id'         => $params['moda_id']
    ) );
}

// the callback function that actually creates the moda form for inputting the posting the draft:
function moda_draft_form () {
    // test if the user is logged in, if not print a message that user should register or log in, and give a direct to the registration or login page. 
    global $current_user; 

    if ( empty( $current_user->ID) || !is_user_logged_in() ) {
        ob_start ();
?> 
        <div id = "login-message"> 
            You are not logged in. In order to use the MODA Portal App, please <a href="http://localhost/wp-login.php">Login</a> or <a href="http://localhost/register/">Register</a>
        </div>

<?php 
        
        $temp_content = ob_get_contents();
        ob_end_clean();
        
        return $temp_content;
    }

    ob_start();
?>

    <form id="moda_form" action="" method="post" class="moda_draft_form";"> 
            <mark id="message"></mark>
            <div id="save_button">
                <hr>
                <input class="tag__link btn btn-skin-dark-oh inverted" type="submit" name="submit" value="SAVE">
                <input class="tag__link btn btn-skin-dark-oh inverted" type="submit" name="dashboard" value="DASHBOARD">
                <input class="tag__link btn btn-skin-dark-oh inverted" type="submit" name="dashboard" value=" COLLABORATORS">
                <label>You can save your MODA and go to the dashboard at any time and continue later. </label>
                <hr>

            </div>

            <div id="overview_section_div">
            <fieldset id="moda_header_fieldset">
                <legend>
                    General Information: 
                </legend>
                <label>MODA Title:       <input type="text" id="moda_title" name="moda_title" value="moda title" size=25  min_length=4 max_lenth=200/></label>
                <label>Project Acronym:  <input type="text" id="project_acronym" name="project_acronym" value="project acronym"  size=25 min_length=4 max_lenth=200 /></label>   
                <label>Project website:  <input type="url" id="project_website" name="project_website" value="http://emmc.info"   size=40 spellcheck=true/></label>   
                <label>User case:  <input type="text" id="user_case_short" name="user_case_short" value="short user case description"  size=40 min_length=4 max_lenth=200 spellcheck=true/></label>   
            </fieldset>
            
                <h1 style="background-color:rgb(240,240,240);">Overview of the Simulation</h1> 
                    
                    <label>General description of the User Case: 
                        <textarea id="overview_usercase" name="overview_usercase"  wrap=soft cols=60 rows=3 minlength=100  maxlength="2000"  spellcheck=true>test</textarea><br>
                        <script>var inputs =document.getElementById("overview_usercase");
                            inputs.setAttribute('placeholder', placeholders["overview_usercase"]);
                        </script>
                    </label>
                    
                    <div class="add_select_models_div">
                                        
                        <fieldset><legend>Please add as many Physics based or data-based models as needed.<br /> <mark>This list of models will be fixed for the next steps</mark> (filling the MODA tables for each model)</legend>
                            <select required name="romm_name[]" >
                            <option value="">None</option> 
                                <option value="DFT">DFT</option> 
                                <option value="MD" >MD</option>
                                <option value="CFD" >CFD</option>
                                <option value="SM" >CFD</option>
                            </select>
                            <label>Description: <input type="text" size = "50" name="model_description[]"></label>
                        </fieldset>
                    </div>
                    <button class="add_model_button">Add More Models</button>

                     
                    <p id="existing_models" ></p>
                    <script>addExistingModel("CFD", "this is a CFD Model");</script>
                    <script>addExistingModel("MD", "this is a MD Model");</script>
                    </fieldset>

                    <fieldset id="publication_item">
                        <label>Publication peer-reviewing the data:    
                            <input type="text" id="publication" name="publication_overview" value="publication" size=50 min_length=4 max_lenth=200 spellcheck=true /> </label>
                            <p> Please give the publication which documents the data of this ONE simulation.  This article should ensure the quality of this data set (and not only the quality of the models).</p>
                    </fieldset>        
                    
                    <fieldset id="access_item"><label>Access conditions:
                        <input type="text" id="access_conditions" name="access_condition" value="access coditions" size=50 min_length=4 max_lenth=200 spellcheck=true /></label>
                        <p>Please list whether the model and/or data are free, commercial or open source. Please list the owner and the name of the software or database (include a web link if available).</p>
                    </fieldset>
                
                    <p> Please note: in this version once you click next the model selections are fixed and cannot be changed!</p>
                    <script>  
                      //thishtml=placeholders["models_help"];
                      //addElement ("overview_section_div", "p", "general_model_instructions", thishtml);
                    </script>
    
                <p><button class="btn btn-primary btn-more btn-skin-dark" type="button" id="next" onclick="processOverviewOfTheSimulation()"> To the next stage: filling the model(s) tables</button></p>
            </div>
    
</form>


<?php
    $temp_content = ob_get_contents();
    ob_end_clean();
     //moda_setupDB();
    return $temp_content;
}


// function to prepare or update the moda_draft tables for all users
function moda_setupDB () {
    global $wpdb;
    $charset_collate = $wpdb->get_charset_collate();
    
    // the following tables are to be generated ... 
    // todo: list the tables, 
    // create a function that creates each table
    // moda_create_table (table_name, array ( field=> array (type, attr))) or something similar, or just create each separately, like below for 


    // shortcut for the moda_draft DB tables
    //$wpdb->moda_all = $wpdb->prefix . 'moda_all';

    $db_version = get_option ('moda_db_version', 0); 

    // create tables on new installs
    if ( empty( $db_version ) ) {
        global $wpdb;
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';

        // ==========================
        $this_table = 'latest_registry'; 

        $table_name = $wpdb->prefix . 'moda_' . $this_table;
        $sql_query = "CREATE TABLE $table_name (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT,
            moda_id INT UNSIGNED NOT NULL,

            PRIMARY KEY  (id),
            KEY moda_id (moda_id)
           ) $charset_collate ;";

        dbDelta( $sql_query );
        // ==========================
        
        // ==========================
        $this_table = 'reviewer_registry'; 
        $table_name = $wpdb->prefix . 'moda_' . $this_table;
        $sql_query = "CREATE TABLE $table_name (
                    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                    moda_id INT UNSIGNED NOT NULL,
                    user_id BIGINT(20) UNSIGNED NOT NULL,
                    PRIMARY KEY  (id),
                    KEY moda_id (moda_id),
                    KEY user_id (user_id)
                   ) $charset_collate ;";
        
        dbDelta( $sql_query );
        // ==========================
                        
        // ==========================
        $this_table = 'contributing_author'; 
        $table_name = $wpdb->prefix . 'moda_' . $this_table;
        $sql_query = "CREATE TABLE $table_name (
                    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                    moda_id INT UNSIGNED NOT NULL,
                    user_id BIGINT(20) UNSIGNED NOT NULL,
                    PRIMARY KEY  (id),
                    KEY moda_id (moda_id),
                    KEY user_id (user_id)
                ) $charset_collate ;";

        dbDelta( $sql_query );
        // ==========================
        
        // ==========================
        $this_table = 'main_author'; 
        $table_name = $wpdb->prefix . 'moda_' . $this_table;
        $sql_query = "CREATE TABLE $table_name (
                    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                    moda_id INT UNSIGNED NOT NULL,
                    user_id BIGINT(20) UNSIGNED NOT NULL,
                    PRIMARY KEY  (id),
                    KEY moda_id (moda_id),
                    KEY user_id (user_id)
                ) $charset_collate ;";

        dbDelta( $sql_query );
        // ==========================

        // ==========================
        $this_table = 'clone_register'; 
        $table_name = $wpdb->prefix . 'moda_' . $this_table;
        $sql_query = "CREATE TABLE $table_name (
                    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                    source_id INT UNSIGNED NOT NULL,
                    new_id INT UNSIGNED NOT NULL,
                    time TIMESTAMP,
                    PRIMARY KEY  (id),
                    KEY source_id (source_id),
                    KEY new_id (new_id),
                    KEY time (time)
                ) $charset_collate ;";

        dbDelta( $sql_query );
        // ==========================
        

        // ==========================
        $this_table = 'main';
        // ==========================

        $table_name = $wpdb->prefix . 'moda_' . $this_table;
        $sql_query = "CREATE TABLE $table_name (
                    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                    source_id INT UNSIGNED NOT NULL,
                    time TIMESTAMP,
                    moda_title CHAR(255),
                    user_case_short CHAR(255),
                    project_acronym CHAR(100),
                    project_website CHAR(255),
                    publish_status CHAR(255),
                    PRIMARY KEY  (id),
                    KEY source_id (source_id),
                    KEY time (time),
                    KEY moda_title (moda_title),
                    KEY user_case_short (user_case_short),
                    KEY project_acronym (project_acronym),
                    KEY project_website (project_website),
                    KEY publish_status (publish_status)
                ) $charset_collate ;";

        dbDelta( $sql_query );
        
        // ==========================
        $this_table = 'overview_section'; 
        // ==========================

        $table_name = $wpdb->prefix . 'moda_' . $this_table;
        $sql_query = "CREATE TABLE $table_name (
                    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                    moda_id INT UNSIGNED NOT NULL,
                    overview_usercase VARCHAR(5000),
                    publication_overview VARCHAR(2000),
                    access_condition VARCHAR(2000),
                    workflow_rational VARCHAR(2000),
                    PRIMARY KEY  (id),
                    KEY moda_id (moda_id),
                    KEY overview_usercase (overview_usercase),
                    KEY publication_overview (publication_overview),
                    KEY access_condition (access_condition),
                    KEY workflow_rational (workflow_rational)
                ) $charset_collate ;";

        dbDelta( $sql_query );

        // ==========================
        $this_table = 'workflow'; 
        // ==========================

        $table_name = $wpdb->prefix . 'moda_' . $this_table;
        $sql_query = "CREATE TABLE $table_name (
                    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                    moda_id INT UNSIGNED NOT NULL,
                    source_model_id INT UNSIGNED NOT NULL,
                    target_model_id INT UNSIGNED NOT NULL,
                    coupling_type INT UNSIGNED NOT NULL,
                    PRIMARY KEY  (id),
                    KEY moda_id (moda_id),
                    KEY source_model_id (source_model_id),
                    KEY target_model_id (target_model_id)
                ) $charset_collate ;";
        dbDelta( $sql_query );
        // ==========================


        // ==========================
        $this_table = 'model'; 
        $table_name = $wpdb->prefix . 'moda_' . $this_table;
        $sql_query = "CREATE TABLE $table_name (
                    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                    moda_id INT UNSIGNED NOT NULL,
                    romm_name CHAR(200),
                    entity CHAR(200),
                    model_description TEXT,
                    PRIMARY KEY  (id),
                    KEY moda_id (moda_id),
                    KEY romm_name (romm_name),
                    KEY entity (entity)
                ) $charset_collate ;";
        dbDelta( $sql_query );
        // ==========================



        // ==========================
        $this_table = 'aspect_section'; 
        $table_name = $wpdb->prefix . 'moda_' . $this_table;
        $sql_query = "CREATE TABLE $table_name (
                    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                    model_id INT UNSIGNED NOT NULL,
                    aspect_description TEXT,
                    material VARCHAR(2000),
                    geometry TEXT,
                    time_lapse CHAR(250),
                    manufacturing TEXT,
                    publication_on_model VARCHAR(500),
                    PRIMARY KEY  (id),
                    KEY model_id (model_id),
                    KEY material (material)
                ) $charset_collate ;";
        dbDelta( $sql_query );
        // ==========================

// the generic physics takes information from other tables!

        // ==========================
        $this_table = 'physics_equation'; 
        $table_name = $wpdb->prefix . 'moda_' . $this_table;
        $sql_query = "CREATE TABLE $table_name (
                    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                    model_id INT UNSIGNED NOT NULL,
                    name VARCHAR(200),
                    description VARCHAR(1000),
                    math TEXT,
                    PRIMARY KEY  (id),
                    KEY model_id (model_id),
                    KEY name (name),
                    KEY description (description)
                ) $charset_collate ;";
        dbDelta( $sql_query );
        // ==========================


        // ==========================
        $this_table = 'physics_quantity'; 
        $table_name = $wpdb->prefix . 'moda_' . $this_table;
        $sql_query = "CREATE TABLE $table_name (
                    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                    model_id INT UNSIGNED NOT NULL,
                    name VARCHAR(200),
                    description VARCHAR(1000),
                    math TEXT,
                    PRIMARY KEY  (id),  
                    KEY model_id (model_id),
                    KEY name (name),
                    KEY description (description)
                ) $charset_collate ;";
        dbDelta( $sql_query );
        // ==========================

        // ==========================
        $this_table = 'material_relation'; 
        $table_name = $wpdb->prefix . 'moda_' . $this_table;
        $sql_query = "CREATE TABLE $table_name (
                    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                    model_id INT UNSIGNED NOT NULL,
                    name VARCHAR(200),
                    description VARCHAR(1000),
                    math TEXT,
                    PRIMARY KEY  (id),
                    KEY model_id (model_id),
                    KEY name (name),
                    KEY description (description)
                ) $charset_collate ;";
        dbDelta( $sql_query );
        // ==========================

        // ==========================
        $this_table = 'data_based_equation'; 
        $table_name = $wpdb->prefix . 'moda_' . $this_table;
        $sql_query = "CREATE TABLE $table_name (
                    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                    model_id INT UNSIGNED NOT NULL,
                    name VARCHAR(200),
                    description VARCHAR(1000),
                    math TEXT,
                    PRIMARY KEY  (id),
                    KEY model_id (model_id),
                    KEY name (name),
                    KEY description (description)
                ) $charset_collate ;";
        dbDelta( $sql_query );
        // ==========================


        // ==========================
        $this_table = 'data_based_model_section'; 
        $table_name = $wpdb->prefix . 'moda_' . $this_table;
        $sql_query = "CREATE TABLE $table_name (
                    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                    model_id INT UNSIGNED NOT NULL,
                    description TEXT,
                    PRIMARY KEY  (id),
                    KEY model_id (model_id)
                ) $charset_collate ;";
        dbDelta( $sql_query );
        // ==========================



        // ==========================
        $this_table = 'database'; 
        $table_name = $wpdb->prefix . 'moda_' . $this_table;
        $sql_query = "CREATE TABLE $table_name (
                    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                    model_id INT UNSIGNED NOT NULL,
                    type VARCHAR(1000),
                    description TEXT,
                    url VARCHAR(1000),
                    PRIMARY KEY  (id),
                    KEY model_id (model_id),
                    KEY type (type),
                    KEY url (url)
                ) $charset_collate ;";
        dbDelta( $sql_query );
        // ==========================


        // ==========================
        $this_table = 'solver_section'; 
        $table_name = $wpdb->prefix . 'moda_' . $this_table;
        $sql_query = "CREATE TABLE $table_name (
                    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                    model_id INT UNSIGNED NOT NULL,
                    solver VARCHAR(2000),
                    time_step CHAR(200),
                    pe TEXT,
                    mr TEXT, 
                    bc TEXT,
                    cond TEXT,
                    par TEXT,    
                    PRIMARY KEY  (id),
                    KEY model_id (model_id)
                ) $charset_collate ;";
        dbDelta( $sql_query );
        // ==========================

        // ==========================
        $this_table = 'detail_datamining_section'; 
        $table_name = $wpdb->prefix . 'moda_' . $this_table;
        $sql_query = "CREATE TABLE $table_name (
                    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                    model_id INT UNSIGNED NOT NULL,
                    numerical_operations VARCHAR(2000),
                    margin_error CHAR(200),
                    PRIMARY KEY  (id),
                    KEY model_id (model_id)
                ) $charset_collate ;";
        dbDelta( $sql_query );
        // ==========================



        // ==========================
        $this_table = 'software_tool'; 
        $table_name = $wpdb->prefix . 'moda_' . $this_table;
        $sql_query = "CREATE TABLE $table_name (
                    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                    sct_id INT UNSIGNED NOT NULL,
                    name VARCHAR(2000),
                    version CHAR(200),
                    url CHAR(255),
                    license CHAR(255),
                    description TEXT,
                    PRIMARY KEY  (id),
                    KEY sct_id (sct_id)
                ) $charset_collate ;";
        dbDelta( $sql_query );
        // ==========================

        // ==========================
        $this_table = 'post_processing'; 
        $table_name = $wpdb->prefix . 'moda_' . $this_table;
        $sql_query = "CREATE TABLE $table_name (
                    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                    model_id INT UNSIGNED NOT NULL,
                    output VARCHAR(3000),
                    method TEXT,
                    margin_error VARCHAR(255),
                    PRIMARY KEY  (id),
                    KEY model_id (model_id)
                ) $charset_collate ;";
        dbDelta( $sql_query );
        // ==========================



        $db_version = '1.0';

        update_option( 'moda_db_version', $sql_query );
       
        $my_post = array(
        'ID'                => 1,
        'post_title'        => "Testing",
        'post_content'      => "DB version: ".$db_version." Test <br />  ".$sql_query,
        );
        $post_id = wp_update_post( $my_post, true );                         
        
      }
        
} 

add_action( 'init', 'moda_setupDB', 0 );

//=========================================================================================
function moda_update_table ($this_table, $moda_keys, $params, $update_moda, $update_key) {
//=========================================================================================

    global $wpdb;

    $table_name = $wpdb->prefix . 'moda_' . $this_table;
    
    $data_values=array();
    
    foreach ($moda_keys as $moda_key) {
        if (array_key_exists ( $moda_key, $params ) ) {
            $data_values [$moda_key] =  $params[$moda_key];
        }   
    }
    
    if ( !empty ( $data_values ) ) {
        if ($update_moda) {
            $wpdb->update ( 
                $table_name, 
                $data_values, 
                array ($update_key => $params[$update_key])
            );
        }
        else
        {
            $wpdb->insert (
            $table_name, 
            $data_values     
            );
            
            $params[$this_table.'_id'] =$wpdb->insert_id;
        }   
    }

    return $params;

}


//============================================================    
function moda_update_models_table ($params, $update_moda) {
//============================================================    

if ( empty ($params  ['romm_name'] ) ) {
        //nothing to do really
        return $params;
    } 

    // we assume models are set befre the tables of each model, so we can safely delete the existing models 
    // if $update_moda = true we then regenerte the  model rows with same moda_id and store the new model_id in the $params
    // if $updat moda is false, we still generate the model rows and store the model_id in $params
    
    if ($update_moda) {
        moda_delete_records ('model', $params, 'moda_id');
    }
    
    unset( $params['model_id'] );
    $params['model_id'] = array();

    for ($moda_model = 0; $moda_model < count ( $params['romm_name']); $moda_model++) {
        
        $this_model_params = array (); // we need a local params for the each model
        
        $this_model_params ['moda_id'] = $params['moda_id'];
                
        foreach ( array ('romm_name', 'model_description','entity') as $moda_key ) {

            if ( !empty( $params[ $moda_key ][ $moda_model ] ) ) {
                $this_model_params [ $moda_key ] = $params[ $moda_key ][ $moda_model ];
            }
        }

        $moda_keys = array (
            'moda_id',
            'romm_name',
            'entity',
            'model_description'
        );

        $new_params = moda_update_table ('model', $moda_keys, $this_model_params, false, 'id');
        $params['model_id'][$moda_model] = $new_params['model_id']; 
    }
    return $params;
}

//===============================================================
function moda_delete_records ($this_table, $params, $moda_key) {
//===============================================================
    
    global $wpdb;
    
    $table_name = $wpdb->prefix . 'moda_' . $this_table;
    
    $moda_r=$wpdb->delete ($table_name, array( $moda_key => $params[$moda_key]) );
    
    return ($moda_r);

}