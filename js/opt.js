// TODO: merge to common.js

var select_run2 = "ESsp2016_01.run000.2015.060100_org";
var prev_select_run2 = select_run2;

function init_opt()
{
    opt = document.getElementById( "select_run2" ).options;
    for( j=0; j<opt.length; j++ )
    {
        console.log( opt[j].text );
        if( opt[j].text == select_run2 ){ opt[j].selected = true; }
    }

    selectRun2( select_run2 );

    $( "#select_run2" ).on( "change", onChangeSelectRun2 );

    function onChangeSelectRun2()
    {
        prev_select_run2 = select_run2;
        select_run2 = $(this).children("option:selected").html();

        selectRun2( select_run2 );

        url_jump = document.getElementById("a_reload").href;
        while( true )
        {
            var prev_url_jump = url_jump;
	        url_jump = url_jump.replace( '/' + prev_select_run2 + '/', '/' + select_run2 + '/' );
            if( prev_url_jump == url_jump ){ break; }
        }
        url_jump += '&select_run2=' + select_run2;
	   
        window.location.href = url_jump;
        return;
    }


    function selectRun2( mySelect )
    {
	$( "#ln_precip" ).html('<a href="http://www.jamstec.go.jp/nicam/ES_TC/imgtree/index.html?path=img/kodama/latlon/model_bias/GPCP.v2.2/' + mySelect + '/precip/seasonal_mean/2015/JJA/global&select_run2=' + mySelect + '">Precip</a>');
	$( "#ln_t2m_u10m" ).html('<a href="http://www.jamstec.go.jp/nicam/ES_TC/imgtree/index.html?path=img/kodama/latlon/model_bias/JRA55v2/' + mySelect + '/t2m/seasonal_mean/2015/JJA/global,img/kodama/latlon/model_bias/JRA55v2/' + mySelect + '/u10m/seasonal_mean/2015/JJA/global&select_run2=' + mySelect + '">T2m/U10m</a>');
	$( "#ln_net_rad" ).html('<a href="http://www.jamstec.go.jp/nicam/ES_TC/imgtree/index.html?path=img/kodama/latlon/model_bias/CERES_EBAF_TOA_Ed2.8/' + mySelect + '/aw_net_toa/seasonal_mean/2015/JJA/global&select_run2=' + mySelect + '">NET-RAD</a>(<a href="http://www.jamstec.go.jp/nicam/ES_TC/imgtree/index.html?path=img/kodama/latzm/model_bias/CERES_EBAF_TOA_Ed2.8/' + mySelect + '/aw_net_toa/seasonal_mean/2015/JJA/global&select_run2=' + mySelect + '">ZM</a>)');
	$( "#ln_olr_osr" ).html('<a href="http://www.jamstec.go.jp/nicam/ES_TC/imgtree/index.html?path=img/kodama/latlon/model_bias/CERES_EBAF_TOA_Ed2.8/' + mySelect + '/lw_up_toa/seasonal_mean/2015/JJA/global,img/kodama/latlon/model_bias/CERES_EBAF_TOA_Ed2.8/' + mySelect + '/sw_up_toa/seasonal_mean/2015/JJA/global&select_run2=' + mySelect + '">OLR/OSR</a>(<a href="http://www.jamstec.go.jp/nicam/ES_TC/imgtree/index.html?path=img/kodama/latzm/model_bias/CERES_EBAF_TOA_Ed2.8/' + mySelect + '/lw_up_toa/seasonal_mean/2015/JJA/global,img/kodama/latzm/model_bias/CERES_EBAF_TOA_Ed2.8/' + mySelect + '/sw_up_toa/seasonal_mean/2015/JJA/global&select_run2=' + mySelect + '">ZM</a>)');
	$( "#ln_olrc_osrc" ).html('<a href="http://www.jamstec.go.jp/nicam/ES_TC/imgtree/index.html?path=img/kodama/latlon/model_bias/CERES_EBAF_TOA_Ed2.8/' + mySelect + '/lw_up_clr_toa/seasonal_mean/2015/JJA/global,img/kodama/latlon/model_bias/CERES_EBAF_TOA_Ed2.8/' + mySelect + '/sw_up_clr_toa/seasonal_mean/2015/JJA/global&select_run2=' + mySelect + '">OLRc/OSRc</a>(<a href="http://www.jamstec.go.jp/nicam/ES_TC/imgtree/index.html?path=img/kodama/latzm/model_bias/CERES_EBAF_TOA_Ed2.8/' + mySelect + '/lw_up_clr_toa/seasonal_mean/2015/JJA/global,img/kodama/latzm/model_bias/CERES_EBAF_TOA_Ed2.8/' + mySelect + '/sw_up_clr_toa/seasonal_mean/2015/JJA/global&select_run2=' + mySelect + '">ZM</a>)');
	$( "#ln_lwcre_swcre" ).html('<a href="http://www.jamstec.go.jp/nicam/ES_TC/imgtree/index.html?path=img/kodama/latlon/model_bias/CERES_EBAF_TOA_Ed2.8/' + mySelect + '/lw_crf_toa/seasonal_mean/2015/JJA/global,img/kodama/latlon/model_bias/CERES_EBAF_TOA_Ed2.8/' + mySelect + '/sw_crf_toa/seasonal_mean/2015/JJA/global&select_run2=' + mySelect + '">LW/SWCRE</a>(<a href="http://www.jamstec.go.jp/nicam/ES_TC/imgtree/index.html?path=img/kodama/latzm/model_bias/CERES_EBAF_TOA_Ed2.8/' + mySelect + '/lw_crf_toa/seasonal_mean/2015/JJA/global,img/kodama/latzm/model_bias/CERES_EBAF_TOA_Ed2.8/' + mySelect + '/sw_crf_toa/seasonal_mean/2015/JJA/global&select_run2=' + mySelect + '">ZM</a>)');
	$( "#ln_t_u" ).html('<a href="http://www.jamstec.go.jp/nicam/ES_TC/imgtree/index.html?path=img/kodama/latlev/model_bias/JRA55v2/' + mySelect + '/t/seasonal_mean/2015/JJA,img/kodama/latlev/model_bias/JRA55v2/' + mySelect + '/u/seasonal_mean/2015/JJA&select_run2=' + mySelect + '">T/U</a>');
	$( "#ln_rh_qv" ).html('<a href="http://www.jamstec.go.jp/nicam/ES_TC/imgtree/index.html?path=img/kodama/latlev/model_bias/JRA55v2/' + mySelect + '/rh/seasonal_mean/2015/JJA,img/kodama/latlev/model_bias/JRA55v2/' + mySelect + '/qv/seasonal_mean/2015/JJA&select_run2=' + mySelect + '">RH/Qv</a>');

	return;
    }




}
