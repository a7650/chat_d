$(function(){

	var EventUtil={
			getEvent:function(event){
				return event?event:window.event;
			},
			getWheelDate:function(event){
				return event.wheelDelta?event.wheelDelta:-event.detail*40;
			}
	};
	//input添加阴影效果
	$("#input_message").focus(function(){
		$(this).parent().css("box-shadow","0 0 50px rgba(0,0,0,.3)");
	}).blur(function(){
		$(this).parent().css("box-shadow","");
	});
	//list_scroll
	(function(){		
		var tar="",
			_tall;
		
		$("#message_list").mouseenter(function(){
			tar="#message_list";			
		});
		$("#message_list").mouseleave(function(){
			tar="";
			tall="";
		});
		$("#right_2").mouseenter(function(){
			tar="#right_2>."+current_linker;
		});
		$("#right_2").mouseleave(function(){
			tar="";
			_tall="";
		});
		
		var scroll=function(event){
			if(tar){
				var n=tar=="#message_list"?150:280;
				_tall=parseInt($(tar).css("height"));
				event=EventUtil.getEvent(event);
				var delta=EventUtil.getWheelDate(event);
				var _top=parseInt($(tar).css("top")),
					body_height=parseInt($("body").css("height")),
					_x=_tall+n-body_height;		
				if((_tall<body_height-n)&&(delta>0)&&(_top>=0)){
					$(tar).prev().css("box-shadow","");
					return;
				}
				if((-_top)<_x){
					if(delta>0){
						if(_top>=0){
							$(tar).prev().css("box-shadow","");
							return;
						}
						$(tar).css("top",_top+20);
					}
					else{
						$(tar).css("top",_top-20).prev().css("box-shadow","0 0 30px rgba(0,0,0,.5)");
					}
				}
				else if(delta>0){
					$(tar).css("top",_top+20);
				}
				
			}
		};
		var mousewheel=function(){
			if(document.addEventListener){ 
				document.addEventListener('DOMMouseScroll',function(event){scroll(event);},false); 
				document.addEventListener('mousewheel',function(event){scroll(event);},false); 
			}else{
				document.onmousewheel=function(event){
					scroll(event);
				}
			}			
		}();		
	})();
	//message_send
		(function(){
			//在当前联系人的信息列表里添加信息
			var send=function(user,time,mes,s){			
				var clas=s&&s==true?"my":"you";
				var h_text="<div class="+clas+"><img src=imgs/"+user+".png class="+clas+"_face><div class='detail_message'><div><span class="+clas+"_name>"+user_id+"</span><span class='time_2'>"+time+"</span><span class=send_status>正在发送</span></div><p class=message_content><pre>"+mes+"</pre></p></div></div>";
				$("."+current_linker+" .detail:last-child").append(h_text);					
			};
			//#send的点击事件
			$("#send").click(function(){
				if($("#input_message").val()==""){
					alert("不能发送空信息");
					return;
				}
				if(current_linker==""){
					alert("请选择联系人");
					return;
				}
				//获取当前的时间和输入框的信息
				var now=new Date(),
					h=now.getHours(),
					m=now.getMinutes();
				if(h>=12){
					h=h==12?12:h-12;
					var time2=h+":"+m+" PM";
				}
				else{
					var time2=h+":"+m+" AM";
				}				
				var user="defaultmy",
					mes=$("#input_message").val();
				send(user,time2,mes,true);
				//ajax请求后台数据
				var json_data={
					message:mes,
					time:time2,
					sender:user_id,
					receiveder:current_linker
				};
				$.post("../send.php",{"data":JSON.stringify(json_data)},function(echo){
					if(echo.code=="0"){
						$(".send_status").text(echo.error_message).attr("class","send_fail");
					}
					if(echo.code=="1"){
						$(".send_status").text("发送成功").css("color","#2399f1").fadeOut(500).attr("class","send_success");
					}
				});
				//清空输入框并从重新获得焦点
				$("#input_message").val("").focus();
				//列表自动滚动到最下端
				var now_top=$("#right_2>."+current_linker).height();
				var posi_top=-(now_top-$("body").height()+290);
				if(posi_top<0){
					$("#right_2>."+current_linker).animate({"top":posi_top},200);
				}			
			});
			
			$("#input_message").keydown(function(e){
				var event=EventUtil.getEvent(e);
				if(event.keyCode==13){
					$("#send").click();
				}
			});			
		})();
	
	$("#left2_hide").click(function(){		
		$left2=$("#left_2");
		if(!$left2.is(":animated")){
			if($left2.width()==10){
			$left2.animate({"width":"254px"});
			$("#head").animate({"padding-left":"354px"},500);
		}
		else{
			$left2.animate({width:"10px"});
			$("#head").animate({"padding-left":"110px"},500);
		}
		}
		
	})








	
})
