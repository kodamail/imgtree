================================================================================
1. Introduction

"imgtree" is a tool to view image files using web browser. It keeps directory structure containing original image files. Therefore, you can easily browse tons of image files that are systematically stored in the directory tree. Source codes are written in javascript, html5, and perl.

  Brief description of install processes is as follows:

(1) Create/copy image files.
(2) Transfer image files to the local PC, server, etc (if necessary).
(3) Make index file for the images (perl is necessary).

(2) and (3) can be reversed depending on the availability of Perl.


================================================================================
2. Files in imgtree

index_*.html
  Sample html files for browsing. You can use index_default.html as is.

cnf.gs
  Configurations.

img2xml.cgi
  Index file generator.

usr/
  Detailed configurations for browsing (see Section Advanced).

js/
  Javascript source code for browsing.


================================================================================
3. Install

First, think of your situation to use imgtree. For example,

(A) Create image files on a workstation and put image files on a public server for browsing.

(B) Create image files on a workstation and put image files on a laptop PC for local browsing.

(C) Create image files and browse them on a local PC.

Here, we define the term "FIG-SERVER" and "BRO-SERVER" as the servers on which images are created and browsed, respectively. Note that, in the case (C), FIG-SERVER is equivalent to BRO-SERVER, and data transfer processes should be skipped.

Create working directory such as myimgtree/ and copy imgtree to it.
 $ mkdir myimgtree
 $ cd myimgtree
 $ cp -r ${imgtree}/* ./
 (assume ${imgtree} be a directory name of imgtree.)

Next, make directory for image files in myimgtree/ and create or copy images.
 $ mkdir img
 $ (create or copy figures to img/)

After you prepare the images, set img_dir in cnf.js to the image directory. For example,
  var img_dir = './img';

Then execute img2xml.cgi to create index file written in xml format.
 $ ./img2xml.cgi
Please check that list.xml is created in the parent directory of img_dir.

Finally, copy all the files in myimgtree/ to BRO-SERVER and see index.html. Browse index_default.html to check.

Tips: img2xml.cgi can be run on BRO-SERVER instead of FIG-SERVER. If BRO-SERVER is a webserver, running img2xml.cgi on BRO-SERVER is often easier than on FIG-SERVER. Note that img2xml.cgi can be also run on CGI mode if BRO-SERVER permit CGI execution.


================================================================================
4. Advanced configurations

4.1 cnf.js

Configurations such as image directory are described in cnf.js. It is loaded in index.html before js/common.js is loaded. See head of js/common.js for available variables.

4.2 Overview of type and value

Each child directory in image directory may have a "type" which shows meaning of the directory. Name of the directory in the image directory is called "value". For example, the directory whose type is "year" may contains child directories named "2012", "2013", and "2014", all are values. You can specify any strings as type and value, but it should have some meaning to avoid confusion. Be careful that one directory has only one type.

Type is specified in .type file in each directory. In the above example, followings are possible directory and file structures:

(...parent dir)
    |
    |-.type (<- "year")
    |
    |-2012/
    |   |-
    |  (child dir/file...)
    |
    |-2013/
    |   |-
    |  (child dir/file...)
    |
    |-2014/
    |   |-
    |  (child dir/file...)

4.3 Display style

By configuring disp.xml (in usr/default/ by default), an appearance of the web can be changed. Sample file in usr/nicam/ (mainly for NICAM) may be also helpful even for non-NICAM people.

Structure of disp_list.xml is as follows:

  <?xml version="1.0" encoding="UTF-8" ?>
  <disp_list>
  <disp> ... </disp>
  <disp> ... </disp>
    ...
  </disp_list>.

<disp> defines a set of menu or buttons for each type or group of types.

----- <disp> -----
-Parent: <disp_list>
-Usage:
  <disp ...> (contents...) </disp>
-Attributes
  type =      : "type(s)-name"
                 Separate with "/" if more than one types are specified.
                 Use "default" for default behavior.
  size = "size" : size in [0-100] (default: 20)
  loop =
    "group"   : loop within group (default)
    "ingroup" : loop within group, no loop in total
    "each"    : loop within each type
    "no"      : not loop
-Contents:
   <button>, <menu>
-------------------

Note that if the type is matched more than one times, the uppermost matched type is used.

In <disp>, a series of <button> and <menu> are described.

----- <button> -----
-Parent: <disp>
-Usage:
  <button ...> (contents) </disp>
-Attributes
   type = "type-name"
     (default: following <disp>)
     If type in <disp> has more than one type, type must be specified.
   inc = "increment" (such as +1, -1, +100)
-Contents:
   Strings shown on the button.
-------------------

----- <menu> -----
-Parent: <disp>
-Usage:
  <menu ...></menu>
-Attributes
   type = "type-name"
     (default: following <disp>)
     If type in <disp> has more than one type, type must be specified.
-------------------

4.4 Type and value settings

By configuring type.xml (in usr/default/ by default), details of types and values can be specified.

Structure of disp_list.xml is as follows:

  <?xml version="1.0" encoding="UTF-8" ?>
  <type_list>
  <type> ... </type>
  <type> ... </type>
    ...
  </type_list>.

<type> defines a description of type and series of values within.

----- <type> -----
-Parent: <type_list>
-Usage:
  <type ...> (contents...) </type>
-Attributes
  name = "type-name"
-Contents:
   <desc>, <value>
-------------------

----- <desc> -----
-Parent: <type>
-Usage:
  <desc> (contents) </desc>
-Contents:
   Description of the type, which is shown as tooltip.
-------------------

----- <value> -----
-Parent: <type>
-Usage:
  <value ...> (contents...) </type>
-Attributes
  name = "value-name"
-Contents:
   <running>, <desc>
-Note
  Order of <value> affects orfer of menu.
-------------------

----- <running> -----
-Parent: <value>
-Usage:
  <running> (contents) </running>
-Contents:
   running title of the value, which is shown in menu.
-------------------

----- <desc> -----
-Parent: <value>
-Usage:
  <desc> (contents) </desc>
-Contents:
   Description of the value, which is shown as tooltip.
-------------------

Good luck!
