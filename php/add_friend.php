<?php
	header('Content-type:text/json');
	$a=$_POST['a'];
	$b=$_POST['b'];

$dbuser = 'root';           
$dbpass = '';   
$dbhost = 'localhost:3302';       
$conn = mysqli_connect($dbhost, $dbuser, $dbpass);
if(! $conn )
{
    die(json_encode(array("code"=>"0","error_message"=>"连接失败")));
}


mysqli_query($conn , "set names utf8");
mysqli_select_db($conn,"user");
$sql="select * from user where binary username='$b'";
$retval=mysqli_query($conn,$sql);
if( !$retval )
{
  die(json_encode(array("code"=>"0","error_message"=>"服务器错误，请重试")));
}
if($retval->num_rows>0){
	//在friend里查找是否已经为好友
	mysqli_select_db($conn,$a);
	$sql="select * from friend where binary friendname='$b'";
	$retval=mysqli_query($conn,$sql);
	if($retval->num_rows>0){
		die (json_encode(array("code"=>"0","error_message"=>"对方已经是您的好友，无法重复添加")));
	}

	mysqli_select_db( $conn,"public");
	mysqli_query($conn , "set names utf8");
	$mes="{\"type\":\"add_friend\",\"a\":\"$a\",\"b\":\"$b\"}";
	$sql="insert into transfer".
		"(message,sender,receiveder,time)".
		"values".
		"('$mes','A01','$b','000')";
	$retval = mysqli_query( $conn, $sql );
if(! $retval){
	die (json_encode(array("code"=>"0","error_message"=>"发送请求失败,请重新发送")));
}
echo(json_encode(array("code"=>"1")));
	
}
else{
	die (json_encode(array("code"=>"0","error_message"=>"账号不存在")));
}
?>