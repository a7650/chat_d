<?php
header('Content-type:text/json');

$dataa=$_POST["data"];
$data=json_decode($dataa,true);
$receiveder=$data["username"];

$dbuser = 'root';           
$dbpass = '';   
$dbhost = 'localhost:3302';       
$conn = mysqli_connect($dbhost, $dbuser, $dbpass);
if(! $conn )
{
    die(json_encode(array("code"=>"0","error_message"=>"连接失败")));
}


mysqli_query($conn , "set names utf8");

mysqli_select_db( $conn,"public");
$sql = "SELECT *
        FROM transfer where receiveder='$receiveder' or receiveder='A00'";
$retval = mysqli_query( $conn, $sql );
if($retval->num_rows>0){
	$sql = "delete
        from transfer where receiveder='$receiveder'";
mysqli_query( $conn, $sql );
mysqli_select_db( $conn,$receiveder);
	$e=array();
while($row = mysqli_fetch_array($retval, MYSQLI_ASSOC))
{
	$message=$row["message"];
	$time=$row["time"];
	$sender=$row["sender"];
    $sql2="insert into $sender".
		"(message,time)".
		"values".
		"('$message','$time')";
	$retval2 = mysqli_query( $conn, $sql2 );
	$e[$sender][$row["id"]]=$row;
}
echo(json_encode(array("code"=>"1","message"=>$e)));
}else{
	die(json_encode(array("code"=>"3")));
}









?>