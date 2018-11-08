$(function(){
	window.user_id="";
 	window.current_linker="";
 	//login兼容ie
 	function isIE() { 
 		if (!!window.ActiveXObject || "ActiveXObject" in window)
  			return true;
  		else
  			return false;
 		}
 	if(isIE()){
 		$("#iecss").attr("href","css/login_ie.css");
 		$("#login_regist").click(function(){
 			$("#login_window").animate({"height":"0"},300);
 			$("#regist_window").animate({"height":"300px"},300);
 		});
 		$("#regist_login").click(function(){
 			$("#login_window").animate({"height":"300px"},300);
 			$("#regist_window").animate({"height":"0"},300);
 		});
 	}
 	else{
 		$("#login_regist").click(function(){
 			$("#container").css("transform","rotateY(180deg)");
 		});
 		$("#regist_login").click(function(){
 			$("#container").css("transform","rotateY(0)");
 		});
 	}
 	
 	
 	$("#container input").click(function(){
 		$("#regist_status,#login_status").text("");
 	});
 	
 	
 	//注册账号
 	$("#regist").click(function(){
			var username2=$.trim($("#username2").val());
			var password2=$.trim($("#password2").val());
			if(username2==""){$("#regist_status").text("账号不能为空");return;}
			if(password2==""){$("#regist_status").text("密码不能为空");return;}
			if(checkusername(username2)){$("#regist_status").text("用户名不符合规范，无法提交");return}
			$.post("../php/regist.php",{username:""+$("#username2").val(),password:$("#password2").val()},function(e){
				if(e.code=="0"){
					$("#regist_status").text(e.error_message);
				}
				if(e.code=="1"){
					$("#regist_status").text("注册成功，账号为:"+username2).css("color","#00B3FF");
					$("#username").val(username2);
					$("#password").val(password2);
				}
			});
		});
		
	//检测用户名输入是否规范
	function checkusername(u){
		var a="";
		switch(true){
 			case (!/^[a-zA-Z]/.test(u)):a="用户名必须以字母开头";break;
 			case ((u.length<4)):a="用户名至少为4位";break;
 			default :a="";
 		}	
 		return a;
	}
	//username的keyup事件
 	$("#username2").keyup(function(){
 		var b=checkusername($(this).val());
   		$("#regist_status").text(b).css("color","red");	
 		
 	});
 	
 
	//生成联系人列表
	var linker_list=function(name,face_url,message,time){
		//生成联系人列表的html，并插入联系人列表里
		if(face_url=="default"){
			face_url="../imgs/defaultyou.png";
		}
		var linker_text="<div class='linker "+name+"'><div class=linker_message><img src="+face_url+" class=linker_face /><div class=linker_name>"+name+"</div><div class=linker_address>status</div><span class=time>"+time+"</span></div><div class=premessage><p>"+message+"</p><span class=linker_newmessage2></span></div></div>";
		$("#add_friend").before(linker_text);
		//为新生成的列表绑定事件
		(function(n){
				$("#message_list ."+n).click(function(){
					current_linker=$(".linker_name",this).text();
					$(this).addClass("current_linker").siblings().removeClass("current_linker");
					$(".linker_newmessage2",this).text("").removeClass("linker_newmessage");
					$("#right_2 ."+current_linker).css("display","block").siblings("ul").css("display","none");
					$("#right_2>.head>h3").text(current_linker);
					//点击联系人后右侧信息列表自动滚动到最下端
					var posi_top=-(parseInt($("#right_2>."+current_linker).css("height"))-parseInt($("body").css("height"))+290);
					if(posi_top<0){
						$("#right_2>."+current_linker).css("top",posi_top);
					}
				});
		})(name);
	};
	
	//为每个联系人生成信息列表，并隐藏
	var message_list=function(friend){
		var list_text="<ul style=display:none class='detail_list "+friend+"'><li class='detail detail_new'></li></ul>";	
		$("#input").before(list_text);		
	};
	
	//添加好友
 	$("#add_friend button").click(function(){
 		var username=$("#add_friend input").val();
 		if(username==""){
 			$("#add_friend span").show().css("color","red").text("请输入对方用户名");
 			return;
 		}
 		if(username==user_id){
 			$("#add_friend span").show().css("color","red").text("不能添加自己为好友");
 			return;
 		}
 		$.post("../php/add_friend.php",{a:$("#user_name").text(),b:$("#add_friend input").val()},function(echo){
 			if(echo.code=="0"){
 				$("#add_friend span").show().css("color","red").text(echo.error_message);
 			}
 			if(echo.code=="1"){
 				$("#add_friend span").show().text("添加成功，请等待对方回应").css("color","#00B3FF").fadeOut(1000);
 			}
 		})
 	});

	//这个函数会在信息列表里生成新的信息，并更新联系人列表的简略信息
	var receive=function(user_face,time,mes,user_name){			
				var h_text="<div class=you><img src=imgs/"+user_face+".png class=you_face><div class='detail_message'><div><span class=you_name>"+user_name+"</span><span class='time_2'>"+time+"</span></div><p class=message_content><pre>"+mes+"</pre></p></div></div>";
				$("."+user_name+" .detail:last-child").append(h_text);			
				$("."+user_name+" .premessage p").text(mes);
				$("."+user_name+" .time").text(time);			
			};

	//处理系统消息，根据不同类型的系统消息执行不同的函数来更新页面信息
	function A01_message(mes){
		var message=JSON.parse(mes.message);
		console.log(mes);
		console.log(message);
		switch (message.type){
			case "add_friend":add_friend(message.a,message.b);break;
			case "refresh_linker":refresh_linker(message.linker);break;
			case "system_message":system_message(message.content);break;
			default :break;
		}
	}
	//处理添加好友请求
	function add_friend(a,b){
		//生成新的元素添加到页面
		var h_text="<div class='addfriend "+a+"'><p><em>"+a+"<em/>请求添加您为好友</p><button class=yes>接受</button><button class=no>拒绝</button></div>";
		$("#message_list").prepend(h_text);
		//为新的元素绑定事件
		$("."+a+" .yes").unbind();
		$("."+a+" .yes").click(function(){
			(function(a,b){
					par=$(".addfriend").filter("."+a);
					par.animate({"width":"0"},300).animate({"height":"0"},300,function(){
						par.remove();
			        });
				$.post("../php/addfriend_y.php",{"a":a,"b":b},function(echo){
				 if(echo.code=="1"){
					linker_list(a,"default","暂无消息","新添加的");
					message_list(a);
				}
			})
			})(a,b)
		});
		$(".addfriend .no").click(function(){
			var par=$(".addfriend").filter("."+a);
					par.animate({"width":"0"},300).animate({"height":"0"},300,function(){
						par.remove();
					});
		});
	}
	//处理刷新好友列表请求
	function refresh_linker(linker){
		var l=$("#message_list ."+linker);
		if(l.length>0){
			return;
		}
		linker_list(linker,"default","暂无消息","新添加的");
		message_list(linker);
	}
	//处理系统消息请求
	function system_message(content){
		if($("#system_message").length>0){
			$("#system_message span").eq(1).text(content);
		}
		else{
			var h_text="<div id=system_message><span>系统消息：</span><span>"+content+"</span></div>";
			$("#head h3").after(h_text);	
		}
	}
	
	//从服务器获取新的信息，如果有新的信息，就会用receive（）函数更新当前页面数据
	function receive_message(){
		$.post("../php/receive.php",{data:JSON.stringify({username:user_id})},function(echo){
			if(echo.code=="1"){
				for(var i in echo.message){
					for(var j in echo.message[i]){
						//系统消息
						if(i=="A01"){
							A01_message(echo.message[i][j]);
							continue;
						}
						receive("defaultyou",echo.message[i][j].time,echo.message[i][j].message,i);
						//如果不是当前联系人，就在联系人列表里更新消息提示的数目
						if(i!=current_linker){
							var new_mes=$("."+i+" .linker_newmessage2");
							var n=new_mes.text()||0;
							new_mes.addClass("linker_newmessage").text(+n+1);
						}
					}
				}
			}
		});
		setTimeout(receive_message,2000);
	};
	
	//为login按钮绑定事件，包括验证用户信息，刷从服务器获取用户信息，更新页面等
	$("#login").click(function(){
		var username=$("#username").val();
		var password=$("#password").val();
		if(username==""){$("#login_status").text("账号不能为空"); return};
		if(password==""){$("#login_status").text("密码不能为空");return};
		$.post("../php/login.php",{username:$("#username").val(),password:$("#password").val()},function(echo){
			if(echo.code=="0"){
				$("#login_status").text(echo.error_message);
			}
			if(echo.code=="1"){
				console.log(1);
				$("#denglu").siblings().css("display","block");
				//服务器会返回用户的联系人列表，以及联系人发的上一条信息
				$("#denglu").slideUp(300);
				//遍历friend对象，生成联系人列表
				for(var i in echo.friends){				
					var message=echo.friends[i]?echo.friends[i].message:"暂无消息";
					var time=echo.friends[i]?echo.friends[i].time:"";
					linker_list(i,"default",message,time);
					message_list(i);
				}
				user_id=$("#username").val();
				$("#user_name").text(user_id);
				//从服务器获取消息
				receive_message();			
			}
		})
	});	
})