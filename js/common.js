//---------------------------------------------------------------------------//
//
// set default values of cnf.js
//   (load cnf.js before)
//
//---------------------------------------------------------------------------//
//
// debug: set >1 when debugging
if( typeof(debug) == 'undefined' )
  var debug = 0;
//
// top directory of image files
if( typeof(img_dir) == 'undefined' )
  var img_dir = './img';
//
// list of image files in xml
if( typeof(xml_tree_filename) == 'undefined' )
  var xml_tree_filename = img_dir + '/../list.xml';
xml_tree_filename = xml_tree_filename.replace( /[^\/]+\/\.\.\//g, "" );
//
// xml files for directory tree and type
if( typeof(xml_type_list_filename) == 'undefined' )
  var xml_type_list_filename = img_dir + '/type.xml';
if( typeof(xml_disp_list_filename) == 'undefined' )
  var xml_disp_list_filename  = img_dir + '/disp.xml';

// number of panels used only for calculating width and height of panels
// -1: auto
var disp_nx = -1, disp_ny = -1;
//var disp_ny = 2;

var sync_panel = 1;

//---------------------------------------------------------------------------//
//
// initializing function called just after loading html.
// variables are hidden from other js files.
//
//---------------------------------------------------------------------------//
function init()
{
    //---------------------------------------------------//
    //
    // variables available throughout common.js
    //
    //---------------------------------------------------//
    //
    // contents of xml
    var xmlDispList;
    var xmlTypeList;
    var xmlTree;
    //
    // path[c][n]: path for selected menu
    //   c: the number of controler (=0 for the first controller)
    //   n: the number of select box for each c
    var path = []; path[0] = [];
    //
    // fnames[c][i]: filename of image files in path[c][]
    //   c: the number of controler (=0 for the first controller)
    //   i: the number of image file. i>0.
    var fnames = []; fnames[0] = [];
    //
    // zoom_fnames[c]: image size relative to the original size in ratio
    //   c: the number of controler (=0 for the first controller)
    var zoom_fnames = [] ; zoom_fnames[0] = 1; // original size by default
    //
    // child_type[c][n]: type of its ((c,n)'s) child.
    //   c: the number of controler (=0 for the first controller)
    //   n: the number of select box for each c
    var child_type   = []; child_type[0]   = [];
    //
    // panel width and height for displaying (because of the dependency on existence of scroll bar etc)
    var panel_width  = Number( document.getElementById( 'div_panel' ).clientWidth  ) - 20; // width + padding - 20 (for scroll)
    var panel_height = Number( document.getElementById( 'div_panel' ).clientHeight ) - 10; // height + padding
    //
    // padding and margin for child panel
    var cpanel_padding = 3;
    var cpanel_margin_for_border = 8;
    //
    // set initial value (from url)
    var path_init;
    (function()
    {
        var args = location.href.split( '?' );
        arg = new Array();
        if( 1 in args )
        {
            arg = args[1].split( '&' );
        }
        if( debug > 0 ){ console.log( 'Arguements from url' ); }
        for( var depth=0; depth<=arg.length-1; depth++ )
        {
            var temp = arg[depth].split( '=' );
            var key = temp[0];
            if( 1 in temp ){ value = temp[1]; }
            else{ value = ""; }
            if( debug > 0 ){ console.log( '  ' + key + ' : ' + value ); }
            if( key == 'path' )
            {
                path_init = [];
                path_list = value.split( "," );
                for( var c=0; c<path_list.length; c++ )
                {
                    path_init[c] = path_list[c].split( '/' );
                }
            }
            else if( key == 'grid' )  // e.g. 3x2
            {
                disp_nx = value.split( 'x' )[0];
                disp_ny = value.split( 'x' )[1];
            }
            else if( key == 'sync_panel' ) // 0 or 1
            {
                sync_panel = value;
                if( sync_panel == 0 ){ $( '#chk_panel_sync' ).prop( 'checked', false );}
                else                 { $( '#chk_panel_sync' ).prop( 'checked', true );}
            }
        }
        //
        if( disp_nx == -1 || disp_ny == -1 )
        {
            if( path_init != undefined )
            {
                // assume panel is 3:2 (it is tuning parameter)
                ar = ( ( panel_width  / 3 ) / ( panel_height / 2 ) );
                ar2 = 0;
                for( var nx=1; nx<=path_init.length; nx++ )
                {
                    var ny = Math.ceil( path_init.length / nx );
                    if( Math.abs( ar / (nx / ny) - 1 ) < Math.abs( ar / ar2 - 1 ) )
                    { ar2 = nx / ny; disp_nx = nx; disp_ny = ny; }
                }
            }
            else{ disp_nx = 1; disp_ny = 1; }
        }
    })();
    //
    //---------------------------------------------------//
    //
    // load type list written in xml
    //
    //---------------------------------------------------//
    //
    (function()
    {
        init2();
    })();
    function init2()
    {
        console.log( 'Loading xml_disp_list (' + xml_disp_list_filename + ')' );
        $.ajax
        ({
            url      : xml_disp_list_filename + '?rand=' + Math.random(),
            type     : 'get',
            dataType : 'xml',
            timeout  : 100000,
            success  : setXmlDispList,
//            error    : (function(){ $("#head_message").html( 'error: failed to open xml_disp_list (' + xml_disp_list_filename + ')' ); })
            error    : (function(){ alert( 'error: failed to open xml_disp_list (' + xml_disp_list_filename + ')' ); })
        });
        function setXmlDispList( xml, status )
        {
            console.log( '  xml_disp_list is loaded.' );
            xmlDispList = xml;
            init3();
        }
    }
    function init3()
    {
        console.log( 'Loading xml_type_list (' + xml_type_list_filename + ')' );
        $.ajax
        ({
            url      : xml_type_list_filename + '?rand=' + Math.random(),
            type     : 'get',
            dataType : 'xml',
            timeout  : 100000,
            success  : setxmlTypeList,
//            error    : (function(){ $("#head_message").html( 'error: failed to open xml_type_list (' + xml_type_list_filename + ')' ); })
            error    : (function(){ alert( 'error: failed to open xml_type_list (' + xml_type_list_filename + ')' ); })
        });
        function setxmlTypeList( xml, status )
        {
            console.log( '  xml_type_list is loaded.' );
            xmlTypeList = xml;
            init4();
        }
    }
    //
    //---------------------------------------------------//
    //
    // load dir-tree written in xml
    //
    //---------------------------------------------------//
    //
    function init4()
    {
        console.log( 'Loading xml_tree (' + xml_tree_filename + ')' );
        $.ajax
        ({
            url      : xml_tree_filename + '?rand=' + Math.random(),
            type     : 'get',
            dataType : 'xml',
            timeout  : 100000,
            success  : setXmlTree,
//            error    : (function(){ $("#head_message").html( 'error: failed to open xml_tree (' + xml_tree_filename + ')' ); })
            error    : (function(){ alert( 'error: failed to open xml_tree (' + xml_tree_filename + ')' ); })
        });
        function setXmlTree( xml, status )
        {
            console.log( '  xml_tree is loaded.' );
            xmlTree = xml;
            //
            // xml -> path
            xml2path( { c:0, depth:0 } ); // c=0, initial
            //
            if( path_init != undefined )
            {
                for( var c=1; c<path_init.length; c++ )
                {
                    addCon();
                    xml2path( { c:c, depth:0 } );
                }
            }
            //
            // path -> show
            path2panels();
            //
            // register evenst
            registerStaticEvents();
        }
    }
    //
    //---------------------------------------------------//
    //
    // xml -> path, fnames
    //
    //  depth = 0: create initial path.
    //  depth > 0: change selected menu at depth and create deeper path.
    //
    //  name (optional for depth>0): selected name for the depth (path[c][depth] <- name)
    //
    //---------------------------------------------------//
    function xml2path( params )
    {
        var c     = params.c;      // conrtoller
        var depth = params.depth;
        var name  = params.name;   // optional
        var inc   = params.inc;    // optional
        //
        if( inc  == undefined ){ inc = 0; }
        if( name == undefined ){ name = ""; }
//        var menu_name = path2menu();

        // keep old path tp path_prev[].
        var path_prev = [];
        for( var i=0; i<path[c].length; i++ ){ path_prev[i] = path[c][i]; }

        // load initial path when
        if( path_init != undefined )
        {
            if( path_init[c] != undefined )
            {
                for( var i=0; i<path_init[c].length; i++ ){ path_prev[i] = path_init[c][i]; }
/*
                for( var i=0; i<path_init[c].length; i++ )
                {
                    if( path_init[c][i] != "*" ){ path_prev[i] = path_init[c][i]; }
                }
*/
                path_init[c].length = 0;
            }
        }
        //
        // recursive function to create path
        //   target: xml child-object
        var init_path = function( target )
        {
            // check for the previous values
            var flag = 0;
            target.children('dir').each( function()
            {
                if( $(this).attr('name') == path_prev[path[c].length] )
                {
                    path[c][path[c].length]             = $(this).attr('name');
                    if( $(this).attr('child_type') != '' ){ child_type[c][child_type[c].length] = $(this).attr('child_type'); }
                    else                                  { child_type[c][child_type[c].length] = 'none_' + child_type[c].length; }
                    flag = 1;
                    init_path( $(this) );
                    return false;
                }
            });
            //
            // check for xmlTypeList (order of values)
            if( flag == 0 )
            {
                var attr_head = '';
                if( target.attr('child_type') != undefined )
                {
                    attr_head = target.attr('child_type').split('-')[0]; // e.g. run-1 -> run
                }
                var tmp = $(xmlTypeList).children('type_list').children('type').filter("[ name |= '" + attr_head + "' ]");
                tmp.children('value').each(function()
                {
                    var $attr = $(this).attr('name'); // <value name="...">

                    target.children('dir').each( function() // loop ONLY for the first element
                    {
                        if( $(this).attr('name') == $attr )
                        {
                            path[c][path[c].length]             = $(this).attr('name');
                            if( $(this).attr('child_type') != '' ){ child_type[c][child_type[c].length] = $(this).attr('child_type'); }
                            else                                  { child_type[c][child_type[c].length] = 'none_' + child_type[c].length; }
                            init_path( $(this) );
                            flag = 1;
                            return false; // just one time
                        }
                    });
                    if( flag == 1 ){ return false; }
                });
            }
            //
            // default
            if( flag == 0 )
            {
                // first element will be adopted
                target.children('dir').each( function() // loop ONLY for the first element
                {
                    path[c][path[c].length]                 = $(this).attr('name');
                    if( $(this).attr('child_type') != '' ){ child_type[c][child_type[c].length] = $(this).attr('child_type'); }
                    else                                  { child_type[c][child_type[c].length] = 'none_' + child_type[c].length; }
                    init_path( $(this) );
                    return false; // just one time
                });
            }
            //
            if( ! target.children('dir').is('dir') ) // -> false if child "dir" does not exist.
            {
                fnames[c].length = 0;
                target.children('file').each( function()
                {
                    fnames[c][fnames[c].length] = $(this).attr('name');
                });
            }
        } // init_path end
        //
        // delete path deeper than "depth"
        path[c].length         = depth;
        child_type[c].length   = depth;
        //
        var tmp = $(xmlTree).children('tree');
        if( depth > 0 )
        {
            tmp = tmp.children('dir');
            path[c][depth]         = name;
            for( var i=1; i<=depth; i++ ) // seek to the specified depth
            {
                tmp = tmp.children( "[ name = '" + path[c][i] + "' ]" );
            }
            child_type[c][depth] = tmp.attr('child_type');
        }
        init_path( tmp );
    }
    //
    //---------------------------------------------------//
    //
    // xml, path -> menu
    //
    //---------------------------------------------------//
    function path2menu()
    {
        var menu_name    = [];
        var menu_running = [];
        var menu_desc    = [];
        var tmp, attr_head, pos; // work
        //
        // create menu list (menu_name[c][i][j])
        for( c=0; c<=path.length-1; c++ ) // for all the controllers
        {
            menu_name[c]    = [];
            menu_running[c] = [];
            menu_desc[c]    = [];
            target = $(xmlTree).children('tree').children('dir');

            for( i=1; i<=path[c].length-1; i++ ) // i=0: root
            {
                menu_name[c][i]    = [];
                menu_running[c][i] = [];
                menu_desc[c][i]    = [];
                //
                target.children('dir').each(function()
                {
                    menu_name[c][i][menu_name[c][i].length]       = $(this).attr('name');
                    menu_running[c][i][menu_running[c][i].length] = $(this).attr('name');
                    menu_desc[c][i][menu_desc[c][i].length]       = '';
                });
                //
                // overwrite menu_running/menu_desc following xmlTypeList
                for( j=0; j<=menu_name[c][i].length-1; j++ )
                {
                    attr_head = '';
                    if( target.attr('child_type') != undefined )
                    {
                        attr_head = target.attr('child_type').split('-')[0]; // e.g. run-1 -> run
                    }
                    tmp = $(xmlTypeList).children('type_list').children('type').filter("[ name |= '" + attr_head + "' ]");
                    tmp = tmp.children('value').filter("[ name = '" + menu_name[c][i][j] + "' ]");

                    tmp.children("*").each(function()
                    {
                        if( $(this)[0].tagName === 'running' )
                        {
                            menu_running[c][i][j] = $(this).text();
                        }
                        else if( $(this)[0].tagName === 'description' || $(this)[0].tagName === 'desc' )
                        {
                            menu_desc[c][i][j] = $(this).text();
                        }
                    });
                }
                //
                // re-arrange menu_name[c][i] following xmlTypeList
                attr_head = child_type[c][i-1].split('-')[0]; // e.g. run-1 -> run
                tmp = $(xmlTypeList).children('type_list').children('type').filter("[ name |= '" + attr_head + "' ]");
                pos = 0; // position to insert
                tmp.children('value').each(function()
                {
                    pos_old = menu_name[c][i].indexOf( $(this).attr('name') );
                    if( pos_old > pos )
                    {
                        menu_name[c][i].splice( pos, 0, menu_name[c][i][pos_old] );
                        menu_name[c][i].splice( pos_old+1, 1 );
                        menu_running[c][i].splice( pos, 0, menu_running[c][i][pos_old] );
                        menu_running[c][i].splice( pos_old+1, 1 );
                        menu_desc[c][i].splice( pos, 0, menu_desc[c][i][pos_old] );
                        menu_desc[c][i].splice( pos_old+1, 1 );
                        pos++;
                    }
                });
                target = target.children( "[ name = '" + path[c][i] + "' ]" );
            } // i loop ends
        } // c loop ends
        return { menu_name: menu_name, menu_running: menu_running, menu_desc: menu_desc };
    }
    //
    //---------------------------------------------------//
    //
    // xml, path, fnames -> html
    //
    //---------------------------------------------------//
    function path2panels( initFlag, c )
    {
        var obj_tmp = path2menu();
        var menu_name    = obj_tmp.menu_name;
        if( initFlag == undefined ){ initFlag = 1; }

        var cmin = 0;
        var cmax = menu_name.length-1;
        if( c != undefined ){ cmin = c; cmax = c; }

        // put menu to html
        //
        if( initFlag == 1 ){ $('#div_panel').html( '' ); } // clear main panel
        //
        // for each controller
        for( c=cmin; c<=cmax; c++ )
        {
            if( initFlag == 1 ){ initPanel( c ); }
            createPanel( obj_tmp, c );
        }
        createSharedPanel( obj_tmp );
        
        // set link for re-load
//        var href = "index.html?path=";
        var href = '?path=';
        for( var c=0; c<path.length; c++ )
        {
            if( c > 0 ){ href += ","; }
            href += path[c][0]
            for( var i=1; i<path[c].length; i++ ){ href += '/' + path[c][i]; }
        }
        document.getElementById( 'a_reload' ).href = href;
//        console.log( $( "a_reload" ) );

        // create link for particular figure scene
        for ( var key in ln_link )
        {
            if( debug > 0 ){ console.log( key + ' : ' + ln_link[key] + ' : ' + ln_name[key] ); }
            if( $('#' + key).length == 0 ){ continue; }
            var link = ln_link[key];
            for( var i=1; i<=path[cmin].length-1; i++ ) // i=0: root
            {
                var tmp_type = child_type[cmin][i-1];
                var tmp_value = path[cmin][i];
                var re = new RegExp( '\\${' + tmp_type + '}', 'g' );
                link = link.replace( re, tmp_value )
            }
//            console.log( link );
            $( '#' + key ).html( '<a href="index.html?path=' + link + '">' + ln_name[key] + '</a>' );
        }
        //
        if( cmin == cmax ){ draw(cmin); }
        else{ draw(); }
        //
        registerDynamicEvents();  // re-register events
        //
        // make panel draggable and resizable
        $( '.panel' ).draggable();
        $( '.panel' ).resizable( { handles: 'all' } );
        var timer_panel = false;
        //
        $( '.panel' ).off( 'resize' );
        $( '.panel' ).on(  'resize', function( e, ui )
        {
            if( timer_panel !== false ){ clearTimeout( timer_panel ); }
            timer_panel = setTimeout(function()
            {
                onResize(e);
            }, 200 );
        });
        onChangeFlexiblePanel();
    }
    //
    //---------------------------------------------------//
    //
    // ...
    //
    //---------------------------------------------------//
    function initPanel( c )
    {
        if( debug > 0 ){ console.log( "Start initPanel(" + c + ")" ); }
        var cx = c % disp_nx;
        var cy = Math.floor( c / disp_nx );
        if( debug > 0 )
        {
            console.log( "  " + panel_width + " : " + panel_height );
            console.log( "  " + cx + " / " + disp_nx + " : " + cy + " / " + disp_ny );
            console.log( "  " + cx * panel_width / disp_nx );
        }
        var left = cx * panel_width / disp_nx;
        var top  = cy * panel_height / disp_ny;
        var pwidth = panel_width / disp_nx - 2 * cpanel_padding - cpanel_margin_for_border;
        var pheight= panel_height / disp_ny - 2 * cpanel_padding - cpanel_margin_for_border;
        $( '#div_panel' ).append(
            '<div id="div_panel-' + c 
          + '" class="ui-widget-content panel child_panel" style="left: ' + left + 'px; top: ' + top + 'px; width: '
          + pwidth + 'px; height: ' + pheight + 'px; padding: '
          + cpanel_padding + 'px;"><div id="cpanel_div-' + c + '"></div></div>' );
    }
    //
    //---------------------------------------------------//
    //
    // create one panel
    // assume panel itself already exists (i.e., initPanel is already performed).
    //
    //---------------------------------------------------//
    function createPanel( path2menuObj, c )
    {
        var menu_name    = path2menuObj.menu_name;
        var menu_running = path2menuObj.menu_running;
        var menu_desc    = path2menuObj.menu_desc;
        var cpp = c + 1; // pointer to next controller
        var len = child_type[c].length;
        var type_default = 0;
        var i, j, k;
        var disp;
        //
        // add form and drawing field to the controller c's panel
        $( '#div_panel-' + c ).html( '<div id="div_controller-' + c + '" class="div_controller"></div>' );
        $( '#div_panel-' + c ).append( '<div id="div_imgs-' + c + '" class="div_imgs"></div>' );
        //
        // clear form in a controller c (refresh cache)
        $( '#div_controller-' + c ).html( '<form class="controller" id="form_controller-' + c + '" action="#"></form>' );
        $( '#form_controller-' + c).html( '' );
        //
        // add "+" and "-" buttons for a form
        if( path.length > 1 )
        {
            $( '#form_controller-' + c ).append( '<input id="conmm-' + c + '" class="conmm" type="button" value="-">' );
        }
        else // disabled button
        {
            $( '#form_controller-' + c).append( '<input id="conmm-' + c + '" class="conmm" type="button" value="-" disabled>' );
        }
        $( '#form_controller-' + c ).append( '<input id="conpp-' + cpp + '" class="conpp" type="button" value="+">' );
        //
        // create hash table
        //   to obtain i from child_type[c][i-1] (i.e. obtain index from type)
        var i_type = {};
        for( i=1; i<=menu_name[c].length-1; i++ ) // for each menu
        {
            i_type[child_type[c][i-1]] = i;
        }
        //
        var id_num = 1;
        var size_now = 0; // unit in %
        i = 1;
        // considering group of types in disp_list.xml (such as year/month), dual-loop is placed for each type
        // from longest possible group of types to single type
        while( i <= menu_name[c].length - 1 ) // 1st loop for each menu
        {
            for( k=len-1; k>=i; k-- ) // 2nd for each menu: if k=i, group has only one type.
            {
                var types_target = child_type[c].slice(i-1,k).join("/"); // slice [i-1:k) such as "year" "year/month" etc.
                disp = $(xmlDispList).children("disp_list").first().children("disp").filter("[ type = '" + types_target + "' ]");
//                disp = $(xmlDispList).children("disp_list").first().children("disp").filter("[ type = '" + types_target + "' ]" || "[ type = 'default' ]");
                type_default = 0;
                //
                // internal function
                // menu
                function type_menu( i )
                {
                    // get title from xml
                    var attr_head = child_type[c][i-1].split('-')[0]; // e.g. run-1 -> run
                    var tmp = $(xmlTypeList).children('type_list').children('type').filter("[ name |= '" + attr_head + "' ]");
                    var title = '';
//                    tmp.children("description").each(function()
                    tmp.children('description,desc').each(function()
                    {
                        title = $(this).text();
                        return false; // just one time
                    });
                    //
                    var id = 'select-' + c + '-' + i;
                    $( '#form_controller-' + c ).append( '<select id="' + id + '" class="xmlTree" title="' + title + '"></select>' );
                    opt = document.getElementById( id ).options;
                    opt.length = 0;
                    for( j=0; j<=menu_name[c][i].length-1; j++ )
                    {
                        opt.length++;
                        opt[opt.length-1].value = menu_name[c][i][j];
                        opt[opt.length-1].text  = menu_running[c][i][j];
                        opt[opt.length-1].title = menu_desc[c][i][j]; // tooltip
                        if( menu_name[c][i][j] == path[c][i] )
                        { opt[opt.length-1].selected = true; }
                    }
                } // end of type_menu()
                function type_button( attr_type, text, inc, group_type, loop )
                {
                    var id = 'form-' + c + '-' + id_num;
                    id_num++;
                    $( '#form_controller-' + c ).append( '<input id="' + id + '" class="shift" type="button" value="' + text + '">' );
                    $( '#' + id ).bind( 'click', 
                        {
                            c   : c,
                            i   : i_type[attr_type], // target type for button
                            inc : inc,
                            type: group_type,        // type(s) for a group
                            loop: loop
                        },
                        onShiftMenu 
                    );
                } // end of type_button()
                //
                // insert/don't insert "<br>" by checking size
                //   if <disp type="default"> exists
                if( typeof disp.attr('type') === 'undefined' && k == i )
                {
                    disp = $(xmlDispList).children('disp_list').first().children('disp').filter("[ type = 'default' ]");
                    if( typeof disp.attr('type') !== 'undefined' )
                    {
                        disp.attr( 'type', child_type[c][i-1] );
                        type_default = 1;
                    }
                }
                // default appearance for single type (not specified in disp_list.xml)
                if( typeof disp.attr('type') === 'undefined' && k == i )
                {
//                    insertEnterBySize();
                    type_button( child_type[c][i-1], '&lt;', -1, child_type[c][i-1], 'no' );
                    type_menu( i );
                    type_button( child_type[c][i-1], '&gt;', +1, child_type[c][i-1], 'no' );
                }
                //
                // specified in disp_list.xml
                else if( typeof disp.attr('type') !== 'undefined' )
                {
//                    insertEnterBySize();
                    disp.children("*").each(function() // for all <button>, <menu>
                    {
                        // $(this): from <button>, <menu>
                        // disp   : from <disp>
                        var nothing_to_do = 1;
                        //
                        var attr_type = disp.attr( 'type' );
                        if( typeof $(this).attr( 'type' ) !== 'undefined' ){ attr_type = $(this).attr( 'type' ); }
                        //
                        if( $(this)[0].tagName === 'button' ) // <button>
                        {
                            type_button( attr_type, $(this).text(), $(this).attr('inc'), disp.attr('type'), disp.attr('loop') );
                            nothing_to_do = 0;
                        }
                        //
                        else if( $(this)[0].tagName === 'menu' ) // <menu>
                        {
                            type_menu( i_type[attr_type] );
                            nothing_to_do = 0;
                        }
                        //
                        if( nothing_to_do == 1 )
                        {
                            console.log( 'warning: below is ignored' );
                            console.log( '  -> ' + $(this)[0].tagName + ' : ' + $(this).attr('func') + ' : ' + $(this).text() );
                        }
                    });
                    i = k;
                    if( type_default == 1 ){ disp.attr( 'type', 'default' ); type_default = 0; }
                    break;
                }
                else{ /*console.log("skip");*/ }
            }
            i = i + 1;
        }
    }

    function createSharedPanel( path2menuObj )
    {
//        if( debug > 0 ){ console.log( 'Start createSharedPanel()' ); }
        console.log( 'Start createSharedPanel()' );
        //
//        var height_shared_selects = Number( document.getElementById( 'div_shared_selects' ).clientHeight );
        $( '#shared_selects' ).html( '' );
//        if( height_shared_selects < 10 ){ return; }  // too small -> not shown
        if( sync_panel == 0 ){ return; }  // not shown
        //
        var menu_name    = path2menuObj.menu_name;
//        var menu_running = path2menuObj.menu_running;
//        var menu_desc    = path2menuObj.menu_desc;
        var shared_type = []; // common types among controllers
        var shared_name = []; // common selected names among controllers for each type
        var idx = []; idx[0] = []; // [c][i] index for name
        for( var i=0; i<=child_type[0].length-2; i++ )
        {
            var idx_tmp = [];
            var flag = 1;
            for( var c=1; c<=child_type.length-1; c++ )
            {
                if( i == 0 ){ idx[c] = []; }
                for( var j=0; j<=child_type[c].length-2; j++ )
                {
                    if( child_type[c][j] == child_type[0][i] && path[c][j+1] == path[0][i+1] )
                    {
                        idx_tmp[c] = j + 1;
                        break;
                    }
                    if( j == child_type[c].length-2 ){ flag = 0; }
                }
                if( flag == 0 ){ break; }
            }
            if( flag == 1 )
            {
                shared_type[shared_type.length] = child_type[0][i];
                idx[0][idx[0].length] = i + 1;
                for( var c=1; c<=idx.length-1; c++ ){ idx[c][idx[c].length] = idx_tmp[c]; }
            }
        }
        if( debug > 1 ){ console.log( shared_type ); }
        //
        var shared_name_list = []; // [i][j]: selectable name list for shared_type[i]
        for( var i=0; i<=shared_type.length-1; i++ )
        {
            shared_name_list[i] = [];

            if( debug > 1 ){ console.log( menu_name[0][idx[0][i]] ); }
            for( var j=0; j<=menu_name[0][idx[0][i]].length-1; j++ )
            {
                if( debug > 1 ){ console.log( '>>' + menu_name[0][idx[0][i]][j] ); }
                var flag = 1;
                for( var c=1; c<=menu_name.length-1; c++ )
                {
                    for( var j2=0; j2<=menu_name[c][idx[c][i]].length-1; j2++ )
                    {
                        if( debug > 1 ){ console.log( '    <-> ' + menu_name[c][idx[c][i]][j2] ); }
                        if( menu_name[0][idx[0][i]][j] == menu_name[c][idx[c][i]][j2] ){ break; }
                        if( j2 == menu_name[c][idx[c][i]].length-1 ){ flag = 0; }
                    }
                    if( flag == 0 ){ break; }
                }
                if( debug > 1 ){ console.log( '      --> flag = ' + flag ); }
                if( flag == 1 ){ shared_name_list[i][shared_name_list[i].length] = menu_name[0][idx[0][i]][j]; }
            }
            if( debug > 1 ){ console.log( shared_name_list[i] ); }
        }
        //
        // create html of shared panel
        for( var i=0; i<=shared_name_list.length-1; i++ )
        {
            if( shared_name_list[i].length == 1 ){ continue; }
            $( '#shared_selects' ).append( '<input id="shared_shift_mm_' + shared_type[i] + '" class="shared_shift" type="button" value="<">' );
            $( '#shared_selects' ).append( '<select id="shared_select_' + shared_type[i] + '" class="shared_selects"></select>' );
            for( var j=0; j<=shared_name_list[i].length-1; j++ )
            {
                var tmp = "";
                if( shared_name_list[i][j] == path[0][idx[0][i]] ){ tmp = "selected"; }
                $( '#shared_select_' + shared_type[i] ).append( '<option ' + tmp + '>' + shared_name_list[i][j] + '</option>' );
            }
            $( '#shared_selects' ).append( '<input id="shared_shift_pp_' + shared_type[i] + '" class="shared_shift" type="button" value=">">' );
        }
        $( 'input.shared_shift' ).bind( 'click', {}, onShiftSharedMenu );

        // TODO: create event (see opt.gs for reference)


    }


    //---------------------------------------------------//
    //
    // update images following current path and fnames.
    //
    //---------------------------------------------------//
    function draw( c )
    {
        var cmin = 0;
        var cmax = path.length - 1
        if( c != undefined ){ cmin = c; cmax = c;}
        var i;
        var file;
        for( c=cmin; c<=cmax; c++ )
        {
            var path_str = img_dir;
            if( path_str !== "" ){ path_str = path_str + "/"; }

            for( i=1; i<path[c].length; i++ )
            {
                path_str += path[c][i] + "/";
            }

            $("#div_imgs-" + c).html( "" );
            for( i=0; i<fnames[c].length; i++ )
            {
                file = path_str + fnames[c][i];

                if( debug > 1 )
                {
                    $("#div_imgs-" + c).append( i + ": " + file + ", <br>" );
                }
                var id = "img-" + c + "-" + i;
                $("#div_imgs-" + c).append( '<img id="' + id + '" src="./' + file + '" style="visibility: hidden;">' );
//                var panel_width = panel_width_default * zoom_fnames[c];
                $("#"+id).one( "load", function () // width can be obtained after loading
                {
                    var changeId = $(this).attr("id").split("-");  // select-c-i
                    var c = changeId[1];
                    var i = changeId[2];
                    var id = "img-" + c + "-" + i;
                    changeSize(c);

//                    document[id].width = document.getElementById( 'div_panel-' + c ).clientWidth;
//                    document[id].style.setProperty( "visibility", "visible" );
                    document.getElementById(id).style.setProperty( "visibility", "visible" );
                });
               
            }
        }

    }


    //---------------------------------------------------//
    //
    // register all the events
    //
    //---------------------------------------------------//
    //
    // targets are dynamically generated.
    function registerDynamicEvents()
    {
        $( 'select.xmlTree' ).off( 'change' );
        $( 'select.xmlTree' ).on(  'change', onChangeXmlTree );

        $( 'input.conpp' ).off( 'click' );
        $( 'input.conpp' ).on(  'click', onAddCon );

        $( 'input.conmm' ).off( 'click' );
        $( 'input.conmm' ).on(  'click', onDelCon );

//        $( "input.sizepp" ).off( "click" );
//        $( "input.sizepp" ).on( "click", onMagnifySize );

//        $( "input.sizemm" ).off( "click" );
//        $( "input.sizemm" ).on( "click", onReduceSize );

        $( 'select.shared_selects' ).off( 'change' );
        $( 'select.shared_selects' ).on(  'change', onChangeSharedSelects );
    }
    // just for one time
    function registerStaticEvents()
    {
        $( '#chk_flexible' ).off( 'change' );
        $( '#chk_flexible' ).on(  'change', onChangeFlexiblePanel );

        $( '#chk_panel_sync' ).off( 'change' );
        $( '#chk_panel_sync' ).on(  'change', onChangeSyncPanel );
    }

    function onChangeSharedSelects()
    {
        if( debug > 0 ){ console.log( 'onChangeSharedSelects() starts' ); }
        var mySelect = $(this).children( 'option:selected' ).attr( 'value' );
        var changeId = $(this).attr( 'id' ).split( '_' );
        changeSharedSelects( changeId[2], mySelect );
    }
    function changeSharedSelects( type, mySelect )
    {
        for( var c=0; c<=path.length-1; c++ )
        {
            for( var i=1; i<=path[c].length-1; i++ )
            {
                if( child_type[c][i-1] == type )
                {
                    xml2path( { c: c, depth: i, name: mySelect } );
                    path2panels( 0, c );
                    break;
                }
            }
        }
    }

    function onChangeXmlTree()
    {
        var mySelect = $(this).children( 'option:selected' ).attr( 'value' );
        var changeId = $(this).attr( 'id' ).split('-');  // select-c-i
        xml2path( { c: changeId[1], depth: changeId[2], name: mySelect } );
        path2panels( 0, changeId[1] );
    }

    function onChangeFlexiblePanel()
    {
        if( $( '#chk_flexible' ).prop( 'checked' ) == true )
        {
            $( '.panel' ).draggable( 'enable' );
            $( '.panel' ).resizable( 'enable' );
        }
        else
        {
            $( '.panel' ).draggable( 'disable' );
            $( '.panel' ).resizable( 'disable' );
        }
    }
    
    function onChangeSyncPanel()
    {
        if( $( '#chk_panel_sync' ).prop( 'checked' ) == true )
        {
            console.log( 'panel sync on' );
            $( '#div_shared_selects' ).height( 55 );
            sync_panel = 1;
        }
        else
        {
            console.log( 'panel sync off' );
            $( '#div_shared_selects' ).height( 0 );
            console.log( $( '#div_shared_selects' ).height() );
            sync_panel = 0;
        }
        path2panels( 0 );
    }
    
    function addCon()
    {
        c = path.length;
        path[c]        = [];
        fnames[c]      = [];
        child_type[c]  = [];
        zoom_fnames[c] = 1;
        initPanel( c );
    }

    function onAddCon()
    {
        var c_add = parseInt( $(this).attr("id").split("-")[1] );  // conpp-c
        var c, i;
        var str, rep;
        addCon();

        // move
        for( c=path.length-2; c>=c_add; c--)
        {
            for( i=0; i<path[c].length; i++ )
            {
                path[c+1][i]   = path[c][i];
            }
            for( i=0; i<fnames[c].length; i++ )
            {
                fnames[c+1][i] = fnames[c][i];
            }
            zoom_fnames[c+1] = zoom_fnames[c];
            for( i=0; i<child_type[c].length; i++ )
            {
                child_type[c+1][i] = child_type[c][i];
            }
            path2panels( 0, c+1 );
        }
        path[c_add].length         = 0;
        fnames[c_add].length       = 0;
        child_type[c_add].length   = 0;

        // copy
        for( i=0; i<path[c_add-1].length; i++ )
        {
            path[c_add][i]   = path[c_add-1][i];
        }
        for( i=0; i<fnames[c_add-1].length; i++ )
        {
            fnames[c_add][i] = fnames[c_add-1][i];
        }
        zoom_fnames[c_add] = zoom_fnames[c_add-1];
        for( i=0; i<child_type[c_add-1].length; i++ )
        {
            child_type[c_add][i] = child_type[c_add-1][i];
        }
        path2panels( 0, c_add );
    }

    function onDelCon()
    {
        var c_del = parseInt( $(this).attr("id").split("-")[1] );  // conmm-c
        var c, i;

        // move
        for( c=c_del+1; c<=path.length-1; c++ )
        {
            for( i=0; i<path[c].length; i++ )
            {
                path[c-1][i]   = path[c][i];
            }
            for( i=0; i<fnames[c].length; i++ )
            {
                fnames[c-1][i] = fnames[c][i];
            }
            zoom_fnames[c-1] = zoom_fnames[c];
            for( i=0; i<child_type[c].length; i++ )
            {
                child_type[c-1][i] = child_type[c][i];
            }
        }
        path.length         = path.length - 1;
        fnames.length       = fnames.length - 1;
        child_type.length   = child_type.length - 1

        var parent = document.getElementById('div_panel');
        parent.removeChild( document.getElementById('div_panel-' + (path.length)) );
        path2panels( 0 );
    }

/*
    function onMagnifySize()
    {
        var c = parseInt( $(this).attr("id").split("-")[1] );
        zoom_fnames[c] += 0.125;
        var id_parent = "img-" + c;
        var panel_width = panel_width_default * zoom_fnames[c];
        document.getElementById( 'div_panel-' + c ).style.setProperty( "width", panel_width + "%" );
        for( var i=0; i<fnames[c].length; i++ )
        {
            var id = id_parent + "-" + i
            document.getElementById(id).width = document.getElementById( 'div_panel-' + c ).clientWidth;
        }
    }
    function onReduceSize()
    {
        var c = parseInt( $(this).attr("id").split("-")[1] );
        zoom_fnames[c] -= 0.125;
        var id_parent = "img-" + c;
        var panel_width = panel_width_default * zoom_fnames[c];
        document.getElementById( 'div_panel-' + c ).style.setProperty( "width", panel_width + "%" );
        for( var i=0; i<fnames[c].length; i++ )
        {
            var id = id_parent + "-" + i
            document.getElementById(id).width = document.getElementById( 'div_panel-' + c ).clientWidth;
        }
    }
*/
    function onResize(e)
    {
        var c = parseInt( e.target.id.split("-")[1] );
        changeSize(c)
    }
    function changeSize(c)
    {
        var id_parent = "img-" + c;
        for( var i=0; i<fnames[c].length; i++ )
        {
            var id = id_parent + "-" + i
            var ar = document.getElementById(id).naturalHeight / document.getElementById(id).naturalWidth;
//            var maxWidth  = document.getElementById( 'div_panel-' + c ).clientWidth;
//            var maxHeight = document.getElementById( 'div_panel-' + c ).clientHeight - document.getElementById( 'form_controller-' + c ).clientHeight;
            var maxWidth  = document.getElementById( 'div_panel-' + c ).clientWidth - cpanel_padding * 2;
            var maxHeight = document.getElementById( 'div_panel-' + c ).clientHeight - document.getElementById( 'form_controller-' + c ).clientHeight - cpanel_padding * 3;
            if( debug > 0 ){ console.log( "maxWidth:" + maxWidth + " maxHeight: " + maxHeight + " ar=" + maxHeight / maxWidth ); }
            if( ar > maxHeight / maxWidth )
            {
                document.getElementById(id).height = maxHeight;
                document.getElementById(id).width  = maxHeight / ar;
            }
            else
            {
                document.getElementById(id).width  = maxWidth;
                document.getElementById(id).height = maxWidth * ar;
            }
        }
    }

    function onShiftSharedMenu( eo )
    {
        var changeId = $(this).attr("id").split("_");
        var changeOpe  = changeId[2]; // "pp" or "mm"
        var changeType = changeId[3];
        var changeValue = $( '#shared_select_' + changeType ).children("option:selected").attr("value");
        var opt = document.getElementById( 'shared_select_' + changeType ).options;
        for( var i=0; i<=opt.length-1; i++ )
        {
            if( opt[i].value == changeValue )
            {
                var it = i;
                if     ( changeOpe == "pp" ){ it = (i+1)%opt.length; }
                else if( changeOpe == "mm" ){ it = (i+opt.length-1)%opt.length; }
                opt[it].selected = true;
                changeSharedSelects( changeType, opt[it].value );
                break;
            }
        }
    }

    function onShiftMenu( eo )
    {
        var c    = Number( eo.data.c ); // c for controller
        var i    = Number( eo.data.i ); // i for type
        var inc  = Number( eo.data.inc );
        var type =         eo.data.type;
        var loop =         eo.data.loop;
        if( eo.data.inc  == undefined ){ inc = 0; }        // default
        if( eo.data.loop == undefined ){ loop = "group"; } // default

        var type_group = [ child_type[c][i-1] ]; // default: type group has one type
        if( type != undefined ){ type_group = type.split("/"); } // for multiple type
        type_group.length = type_group.indexOf(child_type[c][i-1]) + 1;

        if( debug > 0 )
        {
            console.log( "onShiftMenu starts" );
            console.log( "  c            = " + c );
            console.log( "  i            = " + i );
            console.log( "  inc          = " + inc );
            console.log( "  type_group   = " + type_group );
            console.log( "  loop         = " + loop );
            console.log( "  type         = " + child_type[c][i-1] );
            console.log( "  path         = " + path[c][i] );
        }

        var shiftMenu = function( d, inc ) // d: >0 for moving up/down
        {
            if( inc == 0 ){ return 0; } // nothing to do
            //
            if( d >= type_group.length ) // fail to move up/down (out of type group)
            {
                if( debug > 0 ){ console.log( "warning in shiftMenu: nothing to do!" ); }
                return -1;
            }
            //
            menu_name = path2menu().menu_name; // update menu_name
            var idx = menu_name[c][i-d].indexOf(path[c][i-d])
            if     ( inc > 0 ){ idx += 1; inc--; }
            else if( inc < 0 ){ idx -= 1; inc++; }
            if( debug > 0 ){ console.log( "  idx          = " + idx ); }
            //
            if( idx >= menu_name[c][i-d].length )  // move up
            {
                if( loop == "group" || loop == "ingroup" )
                {
                    if( shiftMenu( d+1, +1 ) == -1 && loop == "ingroup" ){ return -1; }
                    menu_name = path2menu().menu_name; // update
                    xml2path( { c: c, depth: i-d, name: menu_name[c][i-d][0] } );
                }
                else if( loop == "each" )
                {
                    xml2path( { c: c, depth: i-d, name: menu_name[c][i-d][0] } );
                }
            }
            else if( idx < 0 )  // move down
            {
                if( loop == "group" || loop == "ingroup" )
                {
                    if( shiftMenu( d+1, -1 ) == -1 && loop == "ingroup" ){ return -1; }
                    menu_name = path2menu().menu_name; // update
                    xml2path( { c: c, depth: i-d, name: menu_name[c][i-d][menu_name[c][i-d].length-1] } );
                }
                else if( loop == "each" )
                {
                    xml2path( { c: c, depth: i-d, name: menu_name[c][i-d][menu_name[c][i-d].length-1] } );
                }
            }
            else
            {
                xml2path( { c: c, depth: i-d, name: menu_name[c][i-d][idx] } );
            }

            if( inc != 0 ){ shiftMenu( d, inc ); }
        }
        shiftMenu( 0, inc );
        path2panels( 0, c );
    }
}
