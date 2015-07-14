#!/usr/bin/perl
#
# [usage] 
#   ./img2xml.cgi
#
# [note]
#   Before execution, set img_dir in cnf.js.
#
#----------------------------------------------------------------------#
#
# global attribute
#
use strict;
use Fcntl;

my %opt = ( 
    img_dir      => "",  # top directory of image files
    nodesc       => 0,
    xml_filename => ""
    );

# get img_dir from usr/cnf.js
open( FH, "< cnf.js" ) 
    or die "error in img2pl.cgi: cannot open cnf.js\n";
my @js = <FH>;
close( FH );
for my $line (@js)
{
    $line =~ s/\/\/.*$//; # remove comment
    if( $line =~ /img_dir *= *\'([^']+)\' *;/ )
    {
	$opt{img_dir} = $1;
    }
}
#$opt{img_dir} = $ARGV[0];
#$opt{img_dir} = './for_test/img_dev';

$opt{xml_filename} = $opt{img_dir} . '/../list.xml';

$opt{xml_filename} =~ s|[^/]+/\.\./||g;


#$opt{nodesc} = 1;  # for debug

# TODO: introduce option (-h?) to switch belows
#my $h_sw = 0;  # for release
my $h_sw = 1;  # for debug (easy to see)

my $h_sp  = "";
my $h_sp2 = "";
my $h_ret = "";
if( $h_sw == 1 )
{
    $h_sp  = " ";
    $h_sp2 = "  ";
    $h_ret = "\n";
}

&main();

my $content = "";
$content  = "Content-type: text/html\n\n";
$content .= "<html>\n";
$content .= "<head>\n";
$content .= "<meta http-equiv=\"Refresh\" content=\"0; url=./\">";
$content .= "<\/head>\n";
$content .= "<body>\n";
$content .= "<p>\n";
$content .= "list.xml is successfully created!\n";
$content .= "<\/p>\n";
$content .= "<\/body>\n";

print $content;
exit;


#----------------------------------------------------------------------#
#
# main procedure
#
sub main
{
    my $xml = '<?xml version="1.0" encoding="UTF-8" ?>' . $h_ret;

    $xml .= '<tree>' . $h_ret . $h_ret;

    # TODO: separation of xml

    my $xml_tmp;
    &do_img2xml( $opt{img_dir}, \$xml_tmp );
    $xml .= $xml_tmp;
    
    $xml .= $h_ret . '</tree>' . $h_ret;
    
    $xml .= $h_ret;
    if( $opt{xml_filename} eq "" )
    {
	print $xml;
    }
    else
    {
	open( FH, "> $opt{xml_filename}" ) 
	    or die "error in img2xml.pl: cannot open $opt{xml_filename}\n";
	print FH $xml;
	close( FH );
    }
}


#----------------------------------------------------------------------#
# in:  $img_dir 
# out: $xml
sub do_img2xml
{
    my $img_dir = shift;
    my $xml     = shift;  # pointer
    #
    #---------- load ----------
    #

if( $img_dir eq "" )
{
    print STDERR "error in img2xml.pl: top directory is not specified.\n";
    exit 1;
}
$img_dir =~ s|/$||; # delete "/" in the end of line

#
#---------- load ----------
#
#----- load image file list
#
#my @img_files = `find $img_dir/ -type f -follow -regex ".*\.\(png\|gif\)" | sed -e "s|^$img_dir/||"`;  # relative to $img_dir
my $find_src = '   -type f -follow -name "*.png"';
$find_src .= ' -or -type f -follow -name "*.bmp"';
$find_src .= ' -or -type f -follow -name "*.gif"';
$find_src .= ' -or -type f -follow -name "*.jpg"';
my @img_files = `find $img_dir/ ${find_src} | sed -e "s|^$img_dir/||"`;  # relative to $img_dir
@img_files = sort { $a cmp $b } @img_files;
#@img_files = sort ( sort_test @img_files );
# test
#sub sort_test
#{
#    my $v1 = $a;
#    my $v2 = $b;
#    return ( ! $v1 cmp $v2 );
#}

#
#----- load desctiption file list
#
$find_src  = '     -type f -follow -name "description.txt"';
$find_src .= ' -or -type f -follow -name ".type"';
my @type_files = `find $img_dir/ ${find_src} | sed -e "s|^$img_dir/||"`;  # relative to $img_dir
#
#----- dir name -> prime key for description
# (it often costs a lot of time, so option --nodesc may be useful)
#
my %type;
if( $opt{nodesc} != 1 )
{
    for( my $i=0; $i<=$#type_files; $i++ )
    {
	$type_files[$i] =~ s/\n//;
	my $type_dir = $type_files[$i];
	$type_dir =~ s|[^/]*$||;
#    print $type_dir . "\n";
#if( $type_files[$i] eq "description.txt" )
	if( $type_dir eq "" ) # top <dir>
	{
	    $type_dir = "/";
	}
	open( FH, "< $img_dir/$type_files[$i]" ) 
	    or die "error in img2xml.pl: cannot open $img_dir/$type_files[$i]\n";
	my @tmp = <FH>;
	close( FH );
	$type{$type_dir} = $tmp[0];
	$type{$type_dir} =~ s/\n//;
    }
}

#
#---------- produce xml
#

#
#----- top <dir> (=$img_dir)
#
my @tmp = split( /\//, $img_dir );
my $tmp = $tmp[$#tmp];
$$xml = '<dir name="' . $tmp . '" child_type="' . $type{"/"} . '">' . $h_ret;
#
#----- child <dir>s
#
my @gnames = (); # background group names (continuous)
my @gname = ();  # background group name
for( my $i=0; $i<=$#img_files; $i++ )
{
    $img_files[$i] =~ s/\n//;
#    print $i . " : " . $img_files[$i] . "\n";
    #
    #----- $img_files[$i] -> @gnames_now, @gname_now
    #
    my @tmp = split( /\//, $img_files[$i] );
    my @gnames_now;  # current group names
    my @gname_now;   # current group name
    $gnames_now[0] = $tmp[0] . "/";
    $gname_now[0]  = $tmp[0];
    for( my $j=1; $j<=$#tmp-1; $j++ )
    {
	$gnames_now[$j] = $gnames_now[$j-1] . $tmp[$j] . "/";
	$gname_now[$j]  = $tmp[$j];
    }
    my $img_file = $tmp[$#tmp];
    #
    #----- decrease @gnames to match @gnames_now
    #
    for( my $j=$#gnames; $j>=0; $j-- )
    {
	if( "$gnames[$j]" eq "$gnames_now[$j]" ){ last; }

	$$xml .= $h_sp2 x @gnames;
	$$xml .= '</dir>' . $h_ret;
	pop( @gnames );
	pop( @gname );
    }
    #
    #----- increase @gnames to match @gnames_now
    #
    for( my $j=$#gnames+1; $j<=$#gnames_now; $j++ )
    {
	push( @gnames, $gnames_now[$j] );
	push( @gname,  $gname_now[$j] );
	$$xml .= '  ' x @gnames;
	$$xml .= '<dir name="' . $gname[$j] . '" child_type="' . $type{$gnames[$j]} . '">' . $h_ret;
    }
    #
    #----- output img
    #
    $$xml .= $h_sp2 x (@gnames+1);
    $$xml .= '<file name="' . $img_file . '">' . $h_ret;
    $$xml .= $h_sp2 x (@gnames+2);
    $$xml .= '<desc>' . '</desc>' . $h_ret;
    $$xml .= $h_sp2 x (@gnames+1);
    $$xml .= '</file>' . $h_ret;
    #
    #if( $i == 1 ){ last; }
}
#
#----- decrease all the @gnames
#
for( my $j=$#gnames; $j>=0; $j-- )
{
    $$xml .= $h_sp2 x @gnames;
    $$xml .= '</dir>' . $h_ret;
    pop( @gnames );
    pop( @gname );
}
#
#----- for top <dir>
#
$$xml .= '</dir>' . $h_ret;

#
#---------- output xml
#
#print $xml . $h_ret;
#print "ok\n";


}
exit;
