



// for standard metvis monitor
var root = 'img/kodama/';

ln_name['ln_precip'] = 'Precip';
ln_link['ln_precip'] = root + 'latlon/model_bias/GPCP.v2.2/${run-2}/precip/${timeid}/${year}/${month}/global';

ln_name['ln_t2m_u10m']  = 'T2m/U10m';
ln_link['ln_t2m_u10m']  = root + 'latlon/model_bias/JRA55v2/${run-2}/t2m/${timeid}/${year}/${month}/global,';
ln_link['ln_t2m_u10m'] += root + 'latlon/model_bias/JRA55v2/${run-2}/u10m/${timeid}/${year}/${month}/global';

ln_name['ln_net_rad'] = 'NET-RAD';
ln_link['ln_net_rad'] = root + 'latlon/model_bias/CERES_EBAF_TOA_Ed2.8/${run-2}/aw_net_toa/${timeid}/${year}/${month}/global';

ln_name['ln_net_rad_zm'] = 'ZM';
ln_link['ln_net_rad_zm'] = root + 'latzm/model_bias/CERES_EBAF_TOA_Ed2.8/${run-2}/aw_net_toa/${timeid}/${year}/${month}/global';

ln_name['ln_olr_osr']  = 'OLR/OSR'
ln_link['ln_olr_osr']  = root + 'latlon/model_bias/CERES_EBAF_TOA_Ed2.8/${run-2}/lw_up_toa/${timeid}/${year}/${month}/global,';
ln_link['ln_olr_osr'] += root + 'latlon/model_bias/CERES_EBAF_TOA_Ed2.8/${run-2}/sw_up_toa/${timeid}/${year}/${month}/global';

ln_name['ln_olr_osr_zm']  = 'ZM';
ln_link['ln_olr_osr_zm']  = root + 'latzm/model_bias/CERES_EBAF_TOA_Ed2.8/${run-2}/lw_up_toa/${timeid}/${year}/${month}/global,';
ln_link['ln_olr_osr_zm'] += root + 'latzm/model_bias/CERES_EBAF_TOA_Ed2.8/${run-2}/sw_up_toa/${timeid}/${year}/${month}/global';

ln_name['ln_olrc_osrc']  = 'OLRc/OSRc'
ln_link['ln_olrc_osrc']  = root + 'latlon/model_bias/CERES_EBAF_TOA_Ed2.8/${run-2}/lw_up_toa_c/${timeid}/${year}/${month}/global,';
ln_link['ln_olrc_osrc'] += root + 'latlon/model_bias/CERES_EBAF_TOA_Ed2.8/${run-2}/sw_up_toa_c/${timeid}/${year}/${month}/global';

ln_name['ln_olrc_osrc_zm']  = 'ZM';
ln_link['ln_olrc_osrc_zm']  = root + 'latzm/model_bias/CERES_EBAF_TOA_Ed2.8/${run-2}/lw_up_toa_c/${timeid}/${year}/${month}/global,';
ln_link['ln_olrc_osrc_zm'] += root + 'latzm/model_bias/CERES_EBAF_TOA_Ed2.8/${run-2}/sw_up_toa_c/${timeid}/${year}/${month}/global';

ln_name['ln_lwcre_swcre']  = 'LW/SWCRE'
ln_link['ln_lwcre_swcre']  = root + 'latlon/model_bias/CERES_EBAF_TOA_Ed2.8/${run-2}/lw_crf_toa/${timeid}/${year}/${month}/global,';
ln_link['ln_lwcre_swcre'] += root + 'latlon/model_bias/CERES_EBAF_TOA_Ed2.8/${run-2}/sw_crf_toa/${timeid}/${year}/${month}/global';

ln_name['ln_lwcre_swcre_zm']  = 'ZM';
ln_link['ln_lwcre_swcre_zm']  = root + 'latzm/model_bias/CERES_EBAF_TOA_Ed2.8/${run-2}/lw_crf_toa/${timeid}/${year}/${month}/global,';
ln_link['ln_lwcre_swcre_zm'] += root + 'latzm/model_bias/CERES_EBAF_TOA_Ed2.8/${run-2}/sw_crf_toa/${timeid}/${year}/${month}/global';

ln_name['ln_t_u']  = 'T/U';
ln_link['ln_t_u']  = root + 'latlev/model_bias/JRA55v2/${run-2}/t/${timeid}/${year}/${month},'; 
ln_link['ln_t_u'] += root + 'latlev/model_bias/JRA55v2/${run-2}/u/${timeid}/${year}/${month}';

ln_name['ln_rh_qv']  = 'RH/Qv';
ln_link['ln_rh_qv']  = root + 'latlev/model_bias/JRA55v2/${run-2}/rh/${timeid}/${year}/${month},'; 
ln_link['ln_rh_qv'] += root + 'latlev/model_bias/JRA55v2/${run-2}/qv/${timeid}/${year}/${month}';

