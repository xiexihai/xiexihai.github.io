;(function(win){
	
	var Photo=function(elem){
		this.$elem=elem;
		if(!this.$elem.length){return}
		this.$body=$('body');
		this.iNow=0;  //当前图片索引
		this.iPage=0; //缩略图分页 
		this.iPageTotal=0; //缩略图总分页
		this.len=this.bigPicArr().length;
		this.bindEvent();
	}
	//大图数组
	Photo.prototype.bigPicArr=function(){
		var arr=[];
		this.$elem.each(function(index,obj){
			arr.push($(obj).find('a').attr('data-src'))	
		})
		return arr;
	}
	//缩略图数组
	Photo.prototype.thumbPicArr=function(){
		var arr=[];
		this.$elem.each(function(index,obj){
			arr.push($(obj).find('img').attr('src'))	
		})
		return arr;	
	}
	//渲染
	Photo.prototype.render=function(){
		var temp=this.template();
		this.$body.append(temp);
		this.$main=$('.ui-photo-main');
		this.$thumb=$('.ui-photo-thumb');
		this.setThumbWidth();
		this.loadImg();
	}
	//模板
	Photo.prototype.template=function(){
		var temp='<div class="ui-photo-wrap">\
			<div class="ui-photo-mask"></div>\
				<div class="ui-photo-container">\
					<a href="javascript:;" class="ui-btn ui-btn-close"></a>\
					<a href="javascript:;" class="ui-btn-prev"><span class="ui-btn"></span></a>\
					<div class="ui-photo-main loading"><span></span></div>\
					<div class="ui-photo-title">当前作品第'+(this.iNow+1)+'幅，一共'+this.len+'幅</div>\
					<div class="ui-photo-no hide"></div>\
					<a href="javascript:;" class="ui-btn-next"><span class="ui-btn"></span></a>\
					<div class="ui-photo-thumb">\
						<a href="javascript:;" class="ui-btn ui-btn-prev-thumb"></a>\
						<a href="javascript:;" class="ui-btn ui-btn-next-thumb"></a>\
						<div class="ui-photo-thumbBox">'+this.createThumb()+'</div>\
					</div>\
				</div>\
			</div>';
		return temp;	
	}
	//事件
	Photo.prototype.bindEvent=function(){
		var that=this;
		this.$elem.on('click',function(){
			that.iNow=$(this).index();
			that.render();
		});

		this.$body.on('click',function(e){
			var $target=$(e.target);
			if($target.hasClass('ui-btn-close')){//关闭相册层
				that.close();
			}else if($target.hasClass('ui-btn-prev')||$target.parent().hasClass('ui-btn-prev')){//大图上一张
				that.prevNext(-1);
			}else if($target.hasClass('ui-btn-next')||$target.parent().hasClass('ui-btn-next')){//大图下一张
				that.prevNext(+1);
			}else if($target.hasClass('ui-btn-prev-thumb')){//小图上一页
				that.thumbPrevNext(-1);
			}else if($target.hasClass('ui-btn-next-thumb')){//小图下一页
				that.thumbPrevNext(+1);
			}
		}).on('click','.ui-photo-thumbBox li',function(){
			that.iNow=$(this).index();
			that.loadImg();
		});

		$(window).on('resize',function(){
			that.setThumbWidth();
		});

	}
	//预加载图片
	Photo.prototype.loadImg=function(){
		var that=this,
			oImg=new Image(),
			$img=$('<img/>'),
			arr=this.bigPicArr();
			this.$main
				.find('img')
				.remove();
			this.$main
				.addClass('loading')
				.append($img)
				.find('img')
				.css({display:'none'});
		oImg.onload=function(){
			that.$main.removeClass('loading');
			$img.attr('src',this.src).fadeIn();
		}
		oImg.src=arr[this.iNow];
		this.$thumb.find('li')
			.eq(this.iNow)
			.addClass('active')
			.siblings()
			.removeClass('active');
		$('.ui-photo-title').html('当前作品第'+(this.iNow+1)+'幅，一共'+this.len+'幅')	
	}
	//大图上、下一张
	Photo.prototype.prevNext=function(dir){
		var $no=$('.ui-photo-no');
			
		if(dir==-1){//上一张
			if(this.iNow==0){
				$no.removeClass('hide').html('已经是第一张了哦！');
				setTimeout(function(){
					$no.addClass('hide')
				},800);
				return;
			}
			this.iNow--;
		}else if(dir==+1){//下一张
			if(this.iNow==this.len-1){
				$no.removeClass('hide').html('已经是最后一张了哦！')
				setTimeout(function(){
					$no.addClass('hide')
				},800);
				return;
			}
			this.iNow++;
		}
		this.loadImg();
	}
	//关闭
	Photo.prototype.close=function(){
		this.$body.find('.ui-photo-wrap').remove();
	}
	//生成缩略图
	Photo.prototype.createThumb=function(){
		var arr=this.thumbPicArr(),
			temp='<ul>';
		for(var i=0;i<this.len;i++){
			temp+='<li><a href="javascript:;"><img src="'+arr[i]+'"/></a></li>';
		}
		temp+='</ul>';
		return temp;
	}
	//设置缩略图区域宽度
	Photo.prototype.setThumbWidth=function(){
		//保证相册层创建之后才执行，避免浏览器缩放的时候报错
		if(this.$thumb!=undefined){
			this.$thumb.find('ul').css({
				width:this.len*54
			})
			this.setThumbPage();
		}
	}
	//设置缩略图分页
	Photo.prototype.setThumbPage=function(){
		var $thumbBox=this.$thumb.find('.ui-photo-thumbBox'),
			boxWidth=Math.ceil($thumbBox.width()),
			ulWidth=$thumbBox.find('ul').width();
			if(ulWidth<=boxWidth){
				this.iPageTotal=0;
			}else{
				this.iPageTotal=Math.ceil(ulWidth/boxWidth);
			}
			if(this.iPageTotal<=1){
				this.$thumb.addClass('btnHide');
			}else{
				this.$thumb.removeClass('btnHide');
			}
		
	}
	//缩略图上、下一页
	Photo.prototype.thumbPrevNext=function(dir){
		var that=this,
			w=this.$thumb.find('.ui-photo-thumbBox').width();
		if(dir==-1){//上一张
			if(this.iPage==0){
				return;
			}
			this.iPage--;
		}else if(dir==+1){//下一张
			if(this.iPage==this.iPageTotal-1){
				return;
			}
			this.iPage++;
		}
		this.$thumb.find('ul').stop().animate({
			left:-that.iPage*w
		})
		console.log(this.iPage)
		console.log(this.iPageTotal)
	}
	win.Photo=Photo;

})(window);
