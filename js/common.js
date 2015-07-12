//---------------------------------------------------------------------------//
//
// set default values of cnf.js
//   (load cnf.js before)
//
//---------------------------------------------------------------------------//
//
// debug: set 1 when debugging
if( typeof(debug) == "undefined" )
  var debug = 0;
//
// top directory of image files
if( typeof(img_dir) == "undefined" )
  var img_dir = './img';
//
// list of image files in xml
if( typeof(xml_tree_filename) == "undefined" )
  var xml_tree_filename = img_dir + '/../list.xml';
//  var xml_tree_filename = img_dir + '/list.xml';
//
// xml files for directory tree and type
if( typeof(xml_type_list_filename) == "undefined" )
  var xml_type_list_filename = img_dir + '/type.xml';
//  var xml_type_list_filename = 'usr/type.xml';
if( typeof(xml_disp_list_filename) == "undefined" )
  var xml_disp_list_filename  = img_dir + '/disp.xml';
//  var xml_disp_list_filename  = img_dir + 'usr/disp.xml';

// default menu size in [0-100]
var size_default = 20;


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
//    var xmlTypeList;
    var xmlDispList;
    var xmlTypeList;
    var xmlTree;
    //
/*
    // TODO: delete?
    // TODO: move inside the function
    var flag_sync = 0;
    var sync = new Array(); // =0: no-sync  =1: sync
*/
    //
    // path[c][n]: path for selected menu
    //   c: the number of controler (=0 for the first controller)
    //   n: the number of select box for each c
    var path   = []; path[0]   = [];
    //
    // fnames[c][i]: filename of image files in path[c][]
    //   c: the number of controler (=0 for the first controller)
    //   i: the number of image file. i>0.
    var fnames = []; fnames[0] = [];
    //
//    var size_fnames = []; size_fnames[0] = []; // test
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
//    // path_running[c][n]: running title for path[c][n]
//    var path_running = []; path_running[0] = [];
    //
/*
    // TODO
    // �������i����ł͐[�����j��fix/sync/�w�薳����ݒ�ł���悤�ɂ���H
    // fix���ĉ��������H
    // �_���I�ɑI�ׂȂ��ꍇ��gray���H
    // �����Ɏ��s�����ꍇ��0�ɖ߂��H
    var pstat = new Array(); // 0:none, 1:fixed, 2:sync
*/
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
        $.ajax
        ({
            url      : xml_disp_list_filename + "?rand=" + Math.random(),
            type     : 'get',
            dataType : 'xml',
            timeout  : 100000,
            success  : setXmlDispList,
            error    : (function(){ $("#head_message").html( 'error: failed to open xml file (' + xml_disp_list_filename + ')' ); })
        });
        function setXmlDispList( xml, status )
        {
            console.log( "xml_disp_list is loaded." );
            xmlDispList = xml;
            init3();
        }
    }
    function init3()
    {
        $.ajax
        ({
            url      : xml_type_list_filename + "?rand=" + Math.random(),
            type     : 'get',
            dataType : 'xml',
            timeout  : 100000,
            success  : setxmlTypeList,
            error    : (function(){ $("#head_message").html( 'error: failed to open xml file (' + xml_type_list_filename + ')' ); })
        });
        function setxmlTypeList( xml, status )
        {
            console.log( "type.xml is loaded." );
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
        $.ajax
        ({
            url      : xml_tree_filename + "?rand=" + Math.random(),
            type     : 'get',
            dataType : 'xml',
            timeout  : 100000,
            success  : setXmlTree,
            error    : (function(){ $("#head_message").html( 'error: failed to open xml file (' + xml_tree_filename + ')' ); })
        });
        function setXmlTree( xml, status )
        {
            console.log( "xmlTree is loaded." );
            xmlTree = xml;
            //
            // xml -> path
            xml2path( { c:0, depth:0 } ); // c=0, initial
            //
            // path -> show
            path2panels();
            //
            // register evenst
            registerStaticEvents()
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
//        console.log("name: " + name );
//        var menu_name = path2menu();


        // keep old path tp path_prev[].
        var path_prev = [];
        for( var i=0; i<path[c].length; i++ ){ path_prev[i] = path[c][i]; }
        //
        // recursive function to create path
        //   target: xml child-object
        var init_path = function( target )
        {
            // check for the previous values
            var flag = 0;
            target.children("dir").each( function()
            {
                if( $(this).attr("name") == path_prev[path[c].length] ) // TODO: �������ȉ��H�ɒ���
//                if( $(this).attr("name") == path_prev[path[c].length] || ( sync[c] == 1 && $(this).attr("name") == path[0][c] )  )
                {
                    path[c][path[c].length]             = $(this).attr("name");
                    child_type[c][child_type[c].length] = $(this).attr("child_type");
                    flag = 1;
                    init_path( $(this) );
                    return false;
                }
            });
            //
            // check for xmlTypeList (order of values)
            if( flag == 0 )
            {
                var attr_head = "";
                if( target.attr("child_type") != undefined )
                {
                    attr_head = target.attr("child_type").split("-")[0]; // e.g. run-1 -> run
                }
                var tmp = $(xmlTypeList).children("type_list").children("type").filter("[ name |= '" + attr_head + "' ]");
                tmp.children("value").each(function()
                {
                    var $attr = $(this).attr("name"); // <value name="...">

                    target.children("dir").each( function() // loop ONLY for the first element
                    {
                        if( $(this).attr("name") == $attr )
                        {
                            path[c][path[c].length]             = $(this).attr("name");
                            child_type[c][child_type[c].length] = $(this).attr("child_type");
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
                target.children("dir").each( function() // loop ONLY for the first element
                {
                    path[c][path[c].length]                 = $(this).attr("name");
                    child_type[c][child_type[c].length]     = $(this).attr("child_type");
                    init_path( $(this) );
                    return false; // just one time
                });
            }
            //
            if( ! target.children("dir").is("dir") ) // -> false if child "dir" does not exist.
            {
                fnames[c].length = 0;
//                size_fnames[c].length = 0;
                target.children("file").each( function()
                {
                    fnames[c][fnames[c].length] = $(this).attr("name");
//                    size_fnames[c][size_fnames[c].length] = $(this).attr("name");
                });
            }
        } // init_path end
        //
        // delete path deeper than "depth"
        path[c].length         = depth;
        child_type[c].length   = depth;
        //
        var tmp = $(xmlTree).children("tree");
        if( depth > 0 )
        {
            tmp = tmp.children("dir");

//        var idx        = menu_name[c][i].indexOf(path[c][i]);
//            if( menu_name[c][depth].indexOf(name) )

//            console.log( menu_name[c][depth].indexOf(name) );
//            if( menu_name[c][depth].indexOf(name) < 0 )
//            {
//                path[c][depth] = menu_name[c][depth][menu_name[c][depth].indexOf(path_prev[depth]) + inc]; // ���`�F�b�N, inc���ӂꏈ���K�v
//            }
//            else
//            {
                path[c][depth]         = name;
//            }
            for( var i=1; i<=depth; i++ ) // seek to the specified depth
            {
                tmp = tmp.children( "[ name = '" + path[c][i] + "' ]" );
            }
//            console.log("tmp: " + tmp.length);
            child_type[c][depth] = tmp.attr("child_type");
        }
        init_path( tmp );
    }

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
            target = $(xmlTree).children("tree").children("dir");

            for( i=1; i<=path[c].length-1; i++ ) // i=0: root
            {
                menu_name[c][i]    = [];
                menu_running[c][i] = [];
                menu_desc[c][i]    = [];
                //
                target.children("dir").each(function()
                {
                    menu_name[c][i][menu_name[c][i].length]       = $(this).attr("name");
                    menu_running[c][i][menu_running[c][i].length] = $(this).attr("name");
                    menu_desc[c][i][menu_desc[c][i].length]       = "";
                });

                // overwrite menu_running/menu_desc following xmlTypeList
                for( j=0; j<=menu_name[c][i].length-1; j++ )
                {
                    attr_head = "";
                    if( target.attr("child_type") != undefined )
                    {
                        attr_head = target.attr("child_type").split("-")[0]; // e.g. run-1 -> run
                    }
                    tmp = $(xmlTypeList).children("type_list").children("type").filter("[ name |= '" + attr_head + "' ]");
                    tmp = tmp.children("value").filter("[ name = '" + menu_name[c][i][j] + "' ]");

                    tmp.children("*").each(function()
                    {
                        if( $(this)[0].tagName === "running" )
                        {
                            menu_running[c][i][j] = $(this).text();
                        }
//                        else if( $(this)[0].tagName === "description" )
                        else if( $(this)[0].tagName === "description" || $(this)[0].tagName === "desc" )
                        {
                            menu_desc[c][i][j] = $(this).text();
                        }
                    });
                }

                // re-arrange menu_name[c][i] following xmlTypeList
                attr_head = child_type[c][i-1].split("-")[0]; // e.g. run-1 -> run
                tmp = $(xmlTypeList).children("type_list").children("type").filter("[ name |= '" + attr_head + "' ]");
                pos = 0; // position to insert
                tmp.children("value").each(function()
                {
                    pos_old = menu_name[c][i].indexOf( $(this).attr("name") );
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
            }
        }
//        return menu_name;
        return { menu_name: menu_name, menu_running: menu_running, menu_desc: menu_desc };
    }

    //---------------------------------------------------//
    //
    // xml, path, fnames -> html
    //
    //---------------------------------------------------//
    function path2panels()
    {
        var i, j, k, c;
        var ope;
//        var id;
        var target;
        var obj_tmp;
        var disp;
        var type_default = 0;

        //
        obj_tmp = path2menu();
        var menu_name    = obj_tmp.menu_name;
        var menu_running = obj_tmp.menu_running;
        var menu_desc    = obj_tmp.menu_desc;
//        var menu_name = path2menu().menu_name;

        // TODO: delete inappropriate menu for "flag_sync=1"

        // put menu to html
        //
        $("#panel_div").html( '' ); // clear main panel
        //
        // for each controller
        for( c=0; c<=menu_name.length-1; c++ )
        {
            var cpp = c + 1; // pointer to next controller
            var len = child_type[c].length;

            // set up panel for controller c
            $("#panel_div").append( '<div id="panel_div-' + c + '"></div>' );

            // add form and drawing field to the controller c's panel
            $("#panel_div-" + c).html( '<form class="controller" id="controller_form-' + c + '" action="#"></form>' );
            $("#panel_div-" + c).append( '<div id="draw_txt-' + c + '"></div>' );

            // clear form in a controller c (refresh cache)
            $("#controller_form-" + c).html( '' );

            // create hash table
            // to obtain i from child_type[c][i-1] (i.e. obtain index from type)
            var i_type = {};
            for( i=1; i<=menu_name[c].length-1; i++ ) // for each menu
            {
                i_type[child_type[c][i-1]] = i;
            }

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
//                    var disp = $(xmlDispList).children("disp_list").first().children("disp").filter("[ type = '" + types_target + "' ]" || "[ type = 'default' ]");
                    type_default = 0;
                    //
                    // internal function
                    // menu
                    function type_menu( i )
                    {
                        // get title from xml
                        var attr_head = child_type[c][i-1].split("-")[0]; // e.g. run-1 -> run
                        var tmp = $(xmlTypeList).children("type_list").children("type").filter("[ name |= '" + attr_head + "' ]");
                        var title = "";
//                        tmp.children("description").each(function()
                        tmp.children("description,desc").each(function()
                        {
                            title = $(this).text();
                            return false; // just one time
                        });
                        //
                        var id = 'select-' + c + '-' + i;
                        $("#controller_form-" + c).append( '<select id="' + id + '" class="xmlTree" title="' + title + '"></select>' );
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
                    }

                    function type_button( attr_type, text, inc, group_type, loop )
                    {
                        var id = 'form-' + c + '-' + id_num;
                        id_num++;
                        $("#controller_form-" + c).append( '<input id="' + id + '" class="shift" type="button" value="' + text + '">' );
                        $("#" + id).bind( "click", 
                            {
                                c   : c,
                                i   : i_type[attr_type],    // target type for button
                                inc : inc,
                                type: group_type,    // type(s) for a group
                                loop: loop
                            },
                            onShiftMenu 
                        );
                    }

                    // insert/don't insert "<br>" by checking size
                    function insertEnterBySize()
                    {
                        var size = disp.attr("size");
                        if( size == undefined ){ size = size_default; }
                        size_now += Number( size );
                        if( size_now > 100 )
                        {
                            $("#controller_form-" + c).append( '<br>' );
                            size_now = Number( size );
                        }
                    }
                    //
                    // if <disp type="default"> exists
                    if( typeof disp.attr("type") === "undefined" && k == i )
                    {
                        disp = $(xmlDispList).children("disp_list").first().children("disp").filter("[ type = 'default' ]");
                        if( typeof disp.attr("type") !== "undefined" )
                        {
                            disp.attr( "type", child_type[c][i-1] );
                            type_default = 1;
                        }
                    }

                    // default appearance for single type (not specified in disp_list.xml)
                    if( typeof disp.attr("type") === "undefined" && k == i )
                    {
                        insertEnterBySize();
                        type_button( child_type[c][i-1], "&lt;", -1, child_type[c][i-1], "no" );
                        type_menu( i );
                        type_button( child_type[c][i-1], "&gt;", +1, child_type[c][i-1], "no" );
                    }
                    //
                    // specified in disp_list.xml
                    else if( typeof disp.attr("type") !== "undefined" )
                    {
                        insertEnterBySize();
                        disp.children("*").each(function() // for all <button>, <menu>
                        {
                            // $(this): from <button>, <menu>
                            // disp   : from <disp>
                            var nothing_to_do = 1;
                            //
                            var attr_type = disp.attr("type");
                            if( typeof $(this).attr("type") !== "undefined" ){ attr_type = $(this).attr("type"); }
                            //
                            if( $(this)[0].tagName === "button" ) // <button>
                            {
                                type_button( attr_type, $(this).text(), $(this).attr("inc"), disp.attr("type"), disp.attr("loop") );
                                nothing_to_do = 0;
                            }
                            //
                            else if( $(this)[0].tagName === "menu" ) // <menu>
                            {
                                type_menu( i_type[attr_type] );
                                nothing_to_do = 0;
                            }
                            //
                            if( nothing_to_do == 1 )
                            {
                                console.log( "warning: below is ignored" );
                                console.log( "  -> " + $(this)[0].tagName + " : " + $(this).attr("func") + " : " + $(this).text() );
                            }
                        });
                        i = k;
                        if( type_default == 1 ){ disp.attr( "type", "default" ); type_default = 0; }
                        break;
                    }
                    else{ /*console.log("skip");*/ }
                }
                i = i + 1;
            }

            // size button
            $("#controller_form-" + c).append( '<br>' );
            $("#controller_form-" + c).append( '<input id="sizemm-' + c + '" class="sizemm" type="button" value="size--">' );
            $("#controller_form-" + c).append( '<input id="sizepp-' + c + '" class="sizepp" type="button" value="size++">' );

            // add "+" and "-" buttons for a form
            if( path.length > 1 )
            {
                $("#controller_form-" + c).append( '<input id="conmm-' + c + '" class="conmm" type="button" value="panel--">' );
            }
            else // disabled button
            {
                $("#controller_form-" + c).append( '<input id="conmm-' + c + '" class="conmm" type="button" value="panel--" disabled>' );
            }
            $("#controller_form-" + c).append( '<input id="conpp-' + cpp + '" class="conpp" type="button" value="panel++">' );

        }

        draw();  // draw images according to the path
        registerDynamicEvents();  // re-register events
    }


    //---------------------------------------------------//
    //
    // update images following current path and fnames.
    //
    //---------------------------------------------------//
    function draw()
    {
        var i;
        var file;
        for( c=0; c<path.length; c++ )
        {
//            var path_str = "";
            var path_str = img_dir;
            if( path_str !== "" ){ path_str = path_str + "/"; }

//            for( i=0; i<path[c].length; i++ )
            for( i=1; i<path[c].length; i++ )
            {
                path_str += path[c][i] + "/";
            }

            $("#draw_txt-" + c).html( "" );
            for( i=0; i<fnames[c].length; i++ )
            {
                file = path_str + fnames[c][i];

                if( debug > 0 )
                {
                    $("#draw_txt-" + c).append( i + ": " + file + ", <br>" );
                }
                var id = "img-" + c + "-" + i;
                $("#draw_txt-" + c).append( '<img id="' + id + '" src="./' + file + '">' );

                $("#"+id).one( "load", function () // width can be obtained after loading
                {
                    var changeId = $(this).attr("id").split("-");  // select-c-i
                    var c = changeId[1];
                    var i = changeId[2];
                    var id = "img-" + c + "-" + i;
                    document[id].width = document[id].naturalWidth * zoom_fnames[c];
                });
//                if( size_fnames[c][i] < 0 ){ size_fnames[c][i] = document[id].width; }
//                else{ document[id].width = size_fnames[c][i]; }
               
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
        $("select.xmlTree").change( onChangeXmlTree );
        $("input.conpp").click( onAddCon );
        $("input.conmm").click( onDelCon );

        $("input.sizepp").click( onMagnifySize );
        $("input.sizemm").click( onReduceSize );

    }
    // just for one time
    function registerStaticEvents()
    {
//        $("#sync").change( onChangeSync );
    }


    function onChangeXmlTree()
    {
//        var mySelect = $(this).children("option:selected").text();
        var mySelect = $(this).children("option:selected").attr("value");
        var changeId = $(this).attr("id").split("-");  // select-c-i
//        xml2path( changeId[1], changeId[2], mySelect );
        xml2path( { c: changeId[1], depth: changeId[2], name: mySelect } );
        path2panels();
    }

    function onAddCon()
    {
        var c_add = parseInt( $(this).attr("id").split("-")[1] );  // conpp-c
        var c, i;
//        console.log( "con: " + c_add);
//        path[path.length]             = new Array();
//        fnames[fnames.length]         = new Array();
//        child_type[child_type.length] = new Array();
        path[path.length]                 = [];
        fnames[fnames.length]             = [];
//        size_fnames[size_fnames.length]   = [];
        child_type[child_type.length]     = [];
//        path_running[path_running.length] = [];

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
/*            for( i=0; i<size_fnames[c].length; i++ )
            {
                size_fnames[c+1][i] = size_fnames[c][i];
            }*/
            zoom_fnames[c+1] = zoom_fnames[c];
            for( i=0; i<child_type[c].length; i++ )
            {
                child_type[c+1][i] = child_type[c][i];
            }
//            for( i=0; i<path_running[c].length; i++ )
//            {
//                path_running[c+1][i] = path_running[c][i];
//            }
        }

        path[c_add].length         = 0;
        fnames[c_add].length       = 0;
//        size_fnames[c_add].length  = 0;
        child_type[c_add].length   = 0;
//        path_running[c_add].length = 0;

        // copy
        for( i=0; i<path[c_add-1].length; i++ )
        {
            path[c_add][i]   = path[c_add-1][i];
        }
        for( i=0; i<fnames[c_add-1].length; i++ )
        {
            fnames[c_add][i] = fnames[c_add-1][i];
        }
/*        for( i=0; i<size_fnames[c_add-1].length; i++ )
        {
            size_fnames[c_add][i] = size_fnames[c_add-1][i];
        }*/
        zoom_fnames[c_add] = zoom_fnames[c_add-1];
        for( i=0; i<child_type[c_add-1].length; i++ )
        {
            child_type[c_add][i] = child_type[c_add-1][i];
        }
//        for( i=0; i<path_running[c_add-1].length; i++ )
//        {
//            path_running[c_add][i] = path_running[c_add-1][i];
//        }

        path2panels();
    }

    function onDelCon()
    {
        var c_del = parseInt( $(this).attr("id").split("-")[1] );  // conmm-c
        var c, i;
//        console.log( "con: " + c_del);

        // move
        for( c=c_del+1; c<=path.length-1; c++ )
        {
//            console.log( "c = " + c );
            for( i=0; i<path[c].length; i++ )
            {
                path[c-1][i]   = path[c][i];
            }
            for( i=0; i<fnames[c].length; i++ )
            {
                fnames[c-1][i] = fnames[c][i];
            }
/*            for( i=0; i<size_fnames[c].length; i++ )
            {
                size_fnames[c-1][i] = size_fnames[c][i];
            }*/
            zoom_fnames[c-1] = zoom_fnames[c];
            for( i=0; i<child_type[c].length; i++ )
            {
                child_type[c-1][i] = child_type[c][i];
            }
//            for( i=0; i<path_running[c].length; i++ )
//            {
//                path_running[c-1][i] = path_running[c][i];
//            }
        }
        path.length         = path.length - 1;
        fnames.length       = fnames.length - 1;
//        size_fnames.length  = size_fnames.length - 1;
        child_type.length   = child_type.length - 1
//        path_running.length = path_running.length - 1;

        path2panels();
    }


    function onMagnifySize()
    {
        var c = parseInt( $(this).attr("id").split("-")[1] );
        var id_parent = "img-" + c;
        zoom_fnames[c] += 0.125;
        for( var i=0; i<fnames[c].length; i++ )
        {
            var id = id_parent + "-" + i
            document[id].width = document[id].naturalWidth * zoom_fnames[c];
        }
    }
    function onReduceSize()
    {
        var c = parseInt( $(this).attr("id").split("-")[1] );
        var id_parent = "img-" + c;
        zoom_fnames[c] -= 0.125;
        for( var i=0; i<fnames[c].length; i++ )
        {
            var id = id_parent + "-" + i
            document[id].width = document[id].naturalWidth * zoom_fnames[c];
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
        path2panels();

    }

/*
    function onChangeSync()
    {
//        console.log( "onChangeSync" );
        if( $(this).prop("checked") )
        {
            flag_sync = 1;

            var path_sync = new Array();
            for( var c=0; c<path.length; c++ )
            {
                for( i=0; i<path[c].length; i++ )
                {
                    if( c == 0 ){ path_sync[i] = path[c][i]; sync[i] = 1; }
                    else if( path_sync[i] != path[c][i] )
                    { sync[i] = 0; }
                }
            }
//            for( var i=0; i<path_sync.length; i++ ){ console.log( path_sync[i] + " : " + sync[i] ); }
        }
        else{ flag_sync = 0; sync.length = 0; }

        if( flag_sync == 1 )
        {
            // which menu should be synclonized -> same name among controllers
//            var sync = new Array();  // =0: no-sync  =1: sync
            for( i=1; i<=path[0].length-1; i++ ) // i=0: root
            {
                sync[i] = 1; // initial: true
                for( c=0; c<=path.length-1; c++ ) // for all the controllers
                {
                    if( path[0][i] != path[c][i] ){ sync[i] = 0; break; }
                }
                console.log( "sync (" + i + "): " + sync[i] );
            }
        }

        path2panels();
    }
*/
}