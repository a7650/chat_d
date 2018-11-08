<?php
header('Content-type:text/json');
$b=$_POST['b'];
$a=$_POST['a'];
$dbuser = 'root';           
$dbpass = '';   
$dbhost = 'localhost:3302';       
$conn = mysqli_connect($dbhost, $dbuser, $dbpass);
if(! $conn )
{
    die(json_encode(array("code"=>"0","error_message"=>"连接失败")));
}
mysqli_select_db( $conn,$b);
mysqli_query($conn , "set names utf8");
$sql1 = "CREATE TABLE $a( ".
        "id INT NOT NULL AUTO_INCREMENT, ".
        "message VARCHAR(500) NOT NULL, ".
        "time VARCHAR(50) NOT NULL, ".
        "PRIMARY KEY ( id ))ENGINE=InnoDB DEFAULT CHARSET=utf8; ";
$retval1 = mysqli_query( $conn, $sql1 );
$sql2="insert into friend".
		"(friendname)".
		"values".
		"('$a')";
	$retval2 = mysqli_query( $conn, $sql2 );

mysqli_select_db( $conn,$a);
mysqli_query($conn , "set names utf8");
$sql1 = "CREATE TABLE $b( ".
        "id INT NOT NULL AUTO_INCREMENT, ".
        "message VARCHAR(500) NOT NULL, ".
        "time VARCHAR(50) NOT NULL, ".
        "PRIMARY KEY ( id ))ENGINE=InnoDB DEFAULT CHARSET=utf8; ";
$retval1 = mysqli_query( $conn, $sql1 );
$sql2="insert into friend".
		"(friendname)".
		"values".
		"('$b')";
	$retval2 = mysqli_query( $conn, $sql2 );

mysqli_select_db( $conn,"public");
mysqli_query($conn , "set names utf8");
//a刷新列表
$mes="{\"type\":\"refresh_linker\",\"linker\":\"$b\"}"; 
$sql="insert into transfer".
		"(message,sender,receiveder,time)".
		"values".
		"('$mes','A01','$a','000')";
$retval = mysqli_query( $conn, $sql );
//a发送系统消息
//$mes2="接受了您的好友请求";
$mes="{\"type\":\"system_message\",\"content\":\"$b 接受了您的好友请求\"}";
$sql="insert into transfer".
		"(message,sender,receiveder,time)".
		"values".
		"('$mes','A01','$a','000')";
$retval = mysqli_query( $conn, $sql );

echo(json_encode(array("code"=>"1")));

?>