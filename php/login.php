<?php
	header('Content-type:text/json');
$username=$_POST['username'];
$password=$_POST['password'];

$dbuser = 'root';           
$dbpass = '';   
$dbhost = 'localhost:3302';       
$conn = mysqli_connect($dbhost, $dbuser, $dbpass);
if(! $conn )
{
    die(json_encode(array("code"=>"0","error_message"=>"连接失败")));
}


mysqli_query($conn , "set names utf8");
mysqli_select_db( $conn,"user");
$sql="select * from user where binary username='$username'";
$retval=mysqli_query($conn,$sql);
if( !$retval )
{
  die(json_encode(array("code"=>"0","error_message"=>"服务器错误，请重试")));
}
if($retval->num_rows>0){
	$row = mysqli_fetch_array($retval, MYSQLI_ASSOC);
	if( $row["password"] !== $password){
		die (json_encode(array("code"=>"0","error_message"=>"密码错误")));
	}
	mysqli_select_db($conn,$username);
	$sql="select friendname from friend";
	$retval=mysqli_query($conn,$sql);
	$e=array();

	while($row = mysqli_fetch_array($retval, MYSQLI_ASSOC))
{
	$sql2="select * from $row[friendname] order by id desc limit 1";
	$retval2=mysqli_query($conn,$sql2);
	$row2 = mysqli_fetch_array($retval2, MYSQLI_ASSOC);
	$e[$row["friendname"]]=$row2;
}
	echo(json_encode(array("code"=>"1","friends"=>$e)));
	
}
else{
	die (json_encode(array("code"=>"0","error_message"=>"账号不存在")));
}
?>