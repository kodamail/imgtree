//---------------------------------------------------------------------------//
//
// global variables
//
//   See head of js/common.js for available variables.
//   If you're setting xml_tree_filename, for example, then add
//     var xml_tree_filename = "your-value";
//   below.
//
//---------------------------------------------------------------------------//
//
// top directory of image files (change appropriately)
var img_dir           = './img';
var xml_tree_filename = 'list.xml';
//var img_dir           = './test_img';
//var xml_tree_filename = 'test_list.xml';

// detailed style
var xml_type_list_filename = 'usr/default/type.xml';
var xml_disp_list_filename = 'usr/default/disp.xml';
var cnf_filename           = '';
//var xml_type_list_filename = 'usr/nicam/type.xml';
//var xml_disp_list_filename = 'usr/nicam/disp.xml';
//var cnf_filename           = 'usr/nicam/cnf.js';

// maximum number of panels for horizontal and vertical direction
// -1: auto
var disp_nx = -1, disp_ny = -1;
//var disp_nx = 2; var disp_ny = 1;

// whether or not to show sync panel
var sync_panel = 0;
//var sync_panel = 1;

// whether or not to show controller
var controller = 1;

// whether or not to make panel flexible
var panel_flex = 0;



// comment in when debug mode
var debug = 0;
//var debug = 1;

// sidebar link
var ln_name = {};
var ln_link = {};
if( cnf_filename != '' )
{
    document.write('<script type="text/javascript" src="' + cnf_filename + '"></script>');
}
