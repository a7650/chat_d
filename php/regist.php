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
mysqli_select_db( $conn,"user");
mysqli_query($conn , "set names utf8");
$sql="select username from user where binary username='$username'";
$retval=mysqli_query($conn,$sql);
if( !$retval )
{
  die(json_encode(array("code"=>"0","error_message"=>"服务器错误，请重试")));
}
if($retval->num_rows>0){
	die (json_encode(array("code"=>"0","error_message"=>"账号已存在")));
}else{
	mysqli_query($conn, "SET AUTOCOMMIT=0");
	mysqli_begin_transaction($conn);
	$sql="insert into user".
		"(username,password)".
		"values".
		"('$username','$password')";
	$retval = mysqli_query( $conn, $sql );
	$sql = "create database $username";
	$retval = mysqli_query($conn,$sql );
	if(! $retval )
	{
		mysqli_query($conn, "ROLLBACK");
    	die(json_encode(array("code"=>"0","error_message"=>"创建数据库失败")));
	}	
	$retval=mysqli_select_db( $conn,$username);
	if(! $retval){
		die(json_encode(array("code"=>"0","error_message"=>"选择数据库失败")));
	}	
	//send
	$sql = "CREATE TABLE send( ".
        "id INT NOT NULL AUTO_INCREMENT, ".
        "message VARCHAR(500) NOT NULL, ".
        "receiveder VARCHAR(20) NOT NULL, ".
        "time VARCHAR(50) NOT NULL, ".
        "PRIMARY KEY ( id ))ENGINE=InnoDB DEFAULT CHARSET=utf8; ";
	$retval = mysqli_query( $conn, $sql );
	//A01
	$sql2 = "CREATE TABLE A01( ".
        "id INT NOT NULL AUTO_INCREMENT, ".
        "message VARCHAR(500) NOT NULL, ".
        "time VARCHAR(50) NOT NULL, ".
        "PRIMARY KEY ( id ))ENGINE=InnoDB DEFAULT CHARSET=utf8; ";
	$retval2 = mysqli_query( $conn, $sql2);
	//FRIEND
	$sql3 = "CREATE TABLE friend( ".
        "id INT NOT NULL AUTO_INCREMENT, ".
        "friendname VARCHAR(20) NOT NULL, ".
        "PRIMARY KEY ( id ))ENGINE=InnoDB DEFAULT CHARSET=utf8; ";
	$retval3 = mysqli_query( $conn, $sql3 );
	if(! $retval&&$retval2&&$retval3 )
	{
		mysqli_query($conn, "ROLLBACK");
		$sql = "DROP DATABASE $username";
		$retval = mysqli_query( $conn, $sql );
    	die(json_encode(array("code"=>"0","error_message"=>"创建数据表失败")));
	}
	mysqli_commit($conn);            //执行事务
	$user_data=array("code"=>"1","password"=>"$password","username"=>"$username");
	echo json_encode($user_data);
	mysqli_close($conn);
}

?>