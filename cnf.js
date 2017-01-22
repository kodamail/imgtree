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
var img_dir = './img';
var xml_tree_filename = 'list.xml';

// comment out below if you prepare your own in img_dir
var xml_type_list_filename = 'usr/default/type.xml';
var xml_disp_list_filename = 'usr/default/disp.xml';
var cnf_filename           = '';
//var xml_type_list_filename = 'usr/nicam/type.xml';
//var xml_disp_list_filename = 'usr/nicam/disp.xml';
//var cnf_filename           = 'usr/nicam/cnf.js';

// comment in when debug mode
var debug = 0;
//var debug = 1;

var ln_name = {};
var ln_link = {};
if( cnf_filename != '' )
{
    document.write('<script type="text/javascript" src="' + cnf_filename + '"></script>');
}
