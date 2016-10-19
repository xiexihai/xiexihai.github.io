;(function($){
	
	var Scroll=function(element,options){
		this.ele=$(element);
		this.config=$.extend({},DEFAULTS,options);
		this.init();
	}
	
	var DEFAULTS={
		type:0,    //0=>无缝滚动（单图），1=》多图
		spacing:9,   //li之间的间距
		btn:true,    //是否显示左右切换按钮
		column:3,    //一屏显示3个，多图的时候必填参数
		btnPrev:'btnPrev', //左右切换按钮className，只有btn为true时才生效
		btnNext:'btnNext',
		pagination:true,//分页按钮
		time:1,         //延迟切换时间
		animTime:300,   //运动时间
		autoPlay:true   //是否自动切换
	}

	
	Scroll.prototype={
		init:function(){
			var self=this;
			self.timer=null;
			self.dir='prev';
			self.render();
			self.bindEvent();
		},
		render:function(){
			var self=this,
			config=self.config;
			
			self.oUl=self.ele.find('ul');
			self.aLi=self.oUl.find('li');
			self.len=self.aLi.length;
			self.width=self.aLi.outerWidth();
			self.timer=null;
			self.iNow=0;
			self.iPage=0;
			self.oUl.css({
				width:self.len*(self.width+config.spacing)
			});
			
			//左右按钮
			if(config.btn){
				self.ele.append('<a href="javascript:;" class="'+config.btnPrev+'">&lt;</a><a href="javascript:;" class="'+config.btnNext+'">&gt;</a>');
			}
			
			//分页总数
			if(config.type==1){		
				self.iPage=Math.ceil(self.len/config.column);
			}
			
			//分页显示,只有type=1(多图)情况下才会有分页
			if(config.type==1&&config.pagination){
				var btnPagination=$('<ol></ol>'),
					arrPage=[];

				for(var i=0;i<self.iPage;i++){
					if(i==0){
						arrPage.push('<li class="cur">'+(i+1)+'</li>');
					}else{
						arrPage.push('<li>'+(i+1)+'</li>');
					}
				}
				btnPagination.html(arrPage.join(''));
				self.ele.append(btnPagination);
			}
			
		},
		bindEvent:function(){
			
			var self=this,
			config=self.config;
			
			self.ele.on('click',function(e){
				var $target=$(e.target);
				if(config.btnPrev&&$target.hasClass(config.btnPrev)){  //上一页
					self.prevPage();
					
				}else if(config.btnNext&&$target.hasClass(config.btnNext)){ //下一页
					self.nextPage();
							
				}
			});
			
			self.ele.find('ol li').on('click',function(){  //分页按钮点击
				self.iNow=$(this).index();
				self.iPageClassCurrent();
				self.anim();
			});
			
			if(config.autoPlay){  //自动播放
				self.autoPlay();
			}
		},
		
		anim:function(){  //运动
			var self=this,config=self.config;
			
			switch(config.type){
			
				case 1:
					if(!self.oUl.is(':animated')){
						var column=self.config.column,
							ii=self.len%column,
							spacing=config.spacing;
						if(ii==0){ //总个数等于column的倍数时
							self.oUl.stop().animate({
								left:-(self.iNow*column)*(self.width+spacing)
							},config.animTime)
						}else{   //不是倍数的时候
							if(self.iNow==self.iPage-1){   //最后一页的切换，后面不留空白
								self.oUl.stop().animate({
									left:-(self.iNow*column)*(self.width+spacing)+((column-ii)*(self.width+spacing))
								},config.animTime)
							}else{
								self.oUl.stop().animate({
									left:-(self.iNow*column)*(self.width+spacing)
								},config.animTime)
							}	
								
						}

					}
					
					break;
			}
		
		},
		iPageClassCurrent:function(){ //当前分页
			return this.ele.find('ol li').eq(this.iNow).addClass('cur').siblings().removeClass('cur');
		},
		prevPage:function(){
			var self=this,config=this.config;
			if(config.type==1){  //多图的上一页
					this.iNow--
						if(this.iNow==-1){
							this.iNow=this.iPage-1
						}
					this.iPageClassCurrent();
					
					this.anim();
			}else{  //单图的上一页 
				if(!this.oUl.is(':animated')){
					this.oUl.stop().animate({
						'left':-(this.width+config.spacing)
					},config.animTime,function(){
						self.oUl.css('left',0).find('li:first').appendTo(self.oUl)
					})
				}
			}	
			this.dir='prev';	
		},
		nextPage:function(){
			var config=this.config;
			if(config.type==1){//多图的下一页
				this.iNow++
					if(this.iNow==this.iPage){
						this.iNow=0	
					}

				this.iPageClassCurrent();
				
				this.anim();
			}else{     //单图的下一页
				if(!this.oUl.is(':animated')){
						this.oUl.css('left',-(this.width+config.spacing)).find('li:last').prependTo(this.oUl);
					this.oUl.stop().animate({
						'left':0
					},config.animTime)
					
				}
			}
			this.dir='next';
		},
		autoPlay:function(){  //自动播放
			var self=this,
			config=self.config;
			self.ele.on('mouseover',function(){
				clearInterval(self.timer);
			}).on('mouseout',function(){
				self.timer=setInterval(function(){
					if(self.dir='next'){
						self.nextPage();	
					}
					
				},config.time*1000);
			}).trigger('mouseleave');
		}
	}
	
	$.fn.scroll=function(options){
		return this.each(function(){
			new Scroll(this,options);
		})
	}

})(jQuery);
