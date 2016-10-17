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
// top directory of image files (please change appropriately)
var img_dir = './img';

// comment out below if you prepare your own in img_dir
var xml_type_list_filename = 'usr/default/type.xml';
var xml_disp_list_filename = 'usr/default/disp.xml';

// comment in when debug mode
var debug = 1;


// test
var ln_name = {};
var ln_link = {};

ln_name['ln_precip'] = "Precip";
ln_link['ln_precip'] = "img/kodama/latlon/model_bias/GPCP.v2.2/${run-2}/precip/${timeid}/${year}/${month}/global";

ln_name['ln_t2m_u10m'] = "T2m/U10m";
ln_link['ln_t2m_u10m'] = "img/kodama/latlon/model_bias/JRA55v2/${run-2}/t2m/${timeid}/${year}/${month}/global,img/kodama/latlon/model_bias/JRA55v2/${run-2}/u10m/${timeid}/${year}/${month}/global";

ln_name['ln_net_rad'] = "NET-RAD";
ln_link['ln_net_rad'] = "img/kodama/latlon/model_bias/CERES_EBAF_TOA_Ed2.8/${run-2}/aw_net_toa/${timeid}/${year}/${month}/global";

ln_name['ln_net_rad_zm'] = "ZM";
ln_link['ln_net_rad_zm'] = "img/kodama/latzm/model_bias/CERES_EBAF_TOA_Ed2.8/${run-2}/aw_net_toa/${timeid}/${year}/${month}/global";

