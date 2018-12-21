<?php
header('Content-type:text/json');
$dataa=$_POST["data"];
if(!$dataa){
	die (json_encode(array("code"=>"0","error_message"=>"dataa")));
}
$data=json_decode($dataa,true);
if(!$data){
	die (json_encode(array("code"=>"0","error_message"=>"data")));
}
$message=$data['message'];
$time=$data['time'];
$sender=$data['sender'];
$receiveder=$data['receiveder'];
$dbuser = 'root';           
$dbpass = '';   
$dbhost = 'localhost:3302';       
$conn = mysqli_connect($dbhost, $dbuser, $dbpass);
if(! $conn )
{
    die (json_encode(array("code"=>"0","error_message"=>"连接失败，请检查网络")));
}
mysqli_select_db( $conn,"public");
mysqli_query($conn , "set names utf8");
$sql="insert into transfer".
		"(message,sender,receiveder,time)".
		"values".
		"('$message','$sender','$receiveder','$time')";
	$retval = mysqli_query( $conn, $sql );
if(! $retval){
	die (json_encode(array("code"=>"0","error_message"=>"发送失败,请重新发送")));
}
mysqli_select_db( $conn,$sender);
mysqli_query($conn , "set names utf8");
$sql="insert into send".
		"(message,receiveder,time)".
		"values".
		"('$message','$receiveder','$time')";
	$retval = mysqli_query( $conn, $sql );
	if(! $retval){
		die (json_encode(array("code"=>"0","error_message"=>"存储用户信息表失败")));
	}
	echo json_encode(array("code"=>"1"));
?>