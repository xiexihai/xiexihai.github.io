/*!
 * ww.js v1.0 (http://cnwanwei.cn/)
 * Copyright 2008-2016 wanwei
 * Author sweet
 * QQ 710961684
 */


/*=============================
 * dropdown.js v1.0
 *=============================*/
 
+(function($,win){
	'use strict';

	var Dropdown=function(elem,options){
		this.elem=$(elem);
		this.options=options;
		this.settings=$.extend({},Dropdown.defaults,this.options);
		this.timer=null;
		this.init();
	}
	
	Dropdown.VERSION='1.0';
	
	Dropdown.prototype.init=function(){
		var that=this;
		this.elem.on(that.settings.event,function(){
			var _this=$(this);
			_this.addClass(that.settings.on);
			if(that.settings.event=="mouseenter"){
				clearTimeout(that.timer);
				that.timer=setTimeout(function(){
					_this.find(that.settings.child).slideDown(that.settings.time);
				},that.settings.delay);
			}else if(that.settings.event=="click"){
				_this.find(that.settings.child).slideDown(that.settings.time);	
			}
		}).on('mouseleave',function(){
			var _this=$(this);
			_this.removeClass(that.settings.on);
			clearTimeout(that.timer);
			that.timer=setTimeout(function(){
				_this.find(that.settings.child).delay(that.settings.delay).slideUp(100);
			},that.settings.delay);
		});
	}
	
	Dropdown.defaults={
		'child':'.nav-item-container', //下拉子容器
		'event':'mouseenter',          //mouseenter、click
		'delay':150,                   //延迟时间
		'time':200,                   //动画持续时间
		'on':'on'                     //下拉添加的class
		
	}
	
	$.fn.dropdown=function(options){
		return this.each(function(){
			new Dropdown(this,options)
		})
	}
	
})(jQuery,window);

/*=============================
 * tooltips.js v1.0
 *=============================*/
+(function($,win){
	'use strict';
	
	var Tooltip=function(elem){
		this.elem=$(elem);
		this.data=null;
		this.settings=$.extend({},Tooltip.defaults,this.getConfig());
		this.init();
	}

	Tooltip.VERSION='1.0';
	
	Tooltip.prototype={
	
		init:function(){
			var self=this;
			this.elem.on(this.settings.type,function(){
				self.create();
			}).on('mouseleave',function(){
				self.remove();
			})
		},
		getConfig:function(){
			this.data=this.elem.attr('data-config');
			if(this.data&&this.data!=""){
				return $.parseJSON(this.data);
			}else{
				return {};
			}
		},
		place:function(){
			var 
			_tooltips=$('.tooltip'),
			_tooltipWidth=_tooltips.outerWidth(),
			_tooltipHeight=_tooltips.outerHeight(),
			_elemWidth=this.elem.outerWidth(),
			_elemHeight=this.elem.outerHeight(),
			_elemOfsetLeft=this.elem.offset().left,
			_elemOfsetTop=this.elem.offset().top,
			L=0,
			T=0;
			
			L=(_tooltipWidth>_elemWidth)?(_elemOfsetLeft-(_tooltipWidth-_elemWidth)/2):(_elemOfsetLeft+(_elemWidth-_tooltipWidth)/2);
			T=(_tooltipHeight>_elemHeight)?(_elemOfsetTop-(_tooltipHeight-_elemHeight)/2):(_elemOfsetTop+(_elemHeight-_tooltipHeight)/2);
			
			switch(this.settings.place){
			
				case 'left':
				_tooltips.addClass('left').css({
					'left':_elemOfsetLeft-_tooltipWidth-8,
					'top':T
				})
				break;
				case 'right':
				_tooltips.addClass('right').css({
					'left':_elemOfsetLeft+_tooltipWidth+8,
					'top':T
				})
				break;
				case 'top':
				_tooltips.addClass('top').css({
					'left':L,
					'top':_elemOfsetTop-_tooltipHeight-8
				})
				break;
				case 'bottom':
				_tooltips.addClass('bottom').css({
					'left':L,
					'top':_elemOfsetTop+_tooltipHeight+8
				})	
				break;
			
			}
			
		},
		create:function(){
			var html='<div class="tooltip"><span>'+this.settings.title+'</span><i></i></div>';
			$('body').append(html);
			this.place();
		},
		remove:function(){
			$('.tooltip').remove();
		}
	}
	Tooltip.defaults={
		'title':'tooltips',
		'place':'top',     //top、right、bottom、left
		'type':'mouseover' //mouseover、click
	}
	
	$.fn.tooltip=function(elem){
		return this.each(function(){
			new Tooltip(this);
		})
	}
	return $('[data-tooltips=tooltips]').tooltip();
})(jQuery,window);


/*=============================
 * slide.js v1.0
 *=============================*/
+(function($,win){
	'use strict';
	
	var Slide=function(elem,options){
		this.container=$(elem);
		if(!this.container.length){return};
		this.options=options;
		this.oUl=this.container.find('>ul');
		this.item=this.oUl.find('>li');
		this.len=this.item.length;
		this.timer=null;
		this.delayTimer=null;
		this.index=0;
		this.active=0;
		this.isAnimate=true;
		this.dir='next';
		this.settings=$.extend({},Slide.defaults,this.options);
		this.init();
	}

	Slide.VERSION='1.0';

	Slide.prototype={
		init:function(){
			var _settings=this.settings,
				_effect=_settings.effect;
			_settings.paginationBtn&&this.createPaginationBtn();
			_settings.prevNextBtn&&this.createPrevNextBtn();
			//effect
			switch(_effect){
				case 'left':
					this.width=this.item.outerWidth();
					this.oUl.width((this.len+2)*this.width);
				break;
				case 'top':
					this.height=this.item.outerHeight();
					this.oUl.height((this.len+2)*this.height);
				break;
				case 'fadeIn':
					this.item.css({
						'position':'absolute'
					}).hide().eq(this.active).show()
				break;	
			}
			if(_settings.effect!='fadeIn'){this.loop()};
			this.bindEvent();			
		},
		//事件
		bindEvent:function(){
			var that=this,
				_eventType=this.settings.eventType;
				
			this.container
			//点击
			.on(_eventType,'.slide-btn',function(){
				that._fnSlideBtn($(this));
			})
			//如果是mouseenter，mouseleave的时候清除延时定时器
			.on('mouseleave','.slide-btn',function(){
				(_eventType=='mouseenter')&&(clearTimeout(that.delayTimer))
			})
			//左右
			.on('click',function(e){
				that._fnPrevNext(e);
			})
			//清除定时器以及设置定时器
			.on('mouseenter',function(){
				that._fnMouseenter();
			})
			.on('mouseleave',function(){
				that._fnMouseleave();
			}).trigger('mouseleave');

			this.setActiveClass(this.active);	
		},
		_fnSlideBtn:function(target){
			var $this=target,that=this;
			if($this.hasClass('active')){return}
			if(this.settings.eventType=='mouseenter'){
				this.delayTimer&&clearTimeout(this.delayTimer);
				this.delayTimer=setTimeout(function(){
					if(that.settings.effect!='fadeIn'){
						that.index=that.active=$this.index();
						that.toggle();
					}else{
						that.index=that.active=$this.index();
						that.toggle();
					}
				},this.settings.delay);
			}else{
				this.index=this.active=$this.index();
				this.toggle();
			}	
				
		},
		_fnPrevNext:function(e){
			var $target=$(e.target);
			if($target.hasClass('slide-prev')){
				this.dir='prev';
				this.prevNextSlide();
			}else if($target.hasClass('slide-next')){
				this.dir='next';
				this.prevNextSlide();
			}	
		},
		_fnMouseenter:function(){
			this.timer&&clearInterval(this.timer);
		},
		_fnMouseleave:function(){
			this.settings.autoPlay&&this.autoPlay();
		},
		_fnEffectLeft:function(){
			var that=this;
			this.oUl.stop().animate({
				left:-(that.index+1)*that.width
			},that.settings.time,function(){
				that.resetInitial();
			})
			that._fnEffect();
		},
		_fnEffectTop:function(){
			var that=this;
			this.oUl.stop().animate({
				top:-(that.index+1)*that.height
			},that.settings.time,function(){
				that.resetInitial();
			})
			that._fnEffect();
		},
		_fnEffectFadeIn:function(){
			var _time=this.settings.time,that=this;

			if(this.dir=='next'){
				if(this.active>=this.len){this.active=0}
			}else{
				if(this.active<=-1){this.active=this.len-1;}
			}
			this.setActiveClass(this.active);
			this.item.eq(this.active).fadeIn(_time).siblings().fadeOut(_time);
		},
		_fnEffect:function(){
			//判断过界从新设置初始值
			if(this.dir=='next'){
				if(this.index>=this.len){
					this.index=this.len;
					this.active=0;
				}
			}else{
				if(this.active<0){
					this.index=this.len;
					this.active=this.len-1;
				}
			}
		},
		_fnUpdateIndex:function(){
			//更新index
			this.index=this.active;
			
			if(this.dir=='next'){
				if(this.index>=this.len){
					this.active=0;
					this.index=this.len;
					this.setActiveClass(this.active);
				}
			}else{
				if(this.index<=-1){
					this.active=this.len-1;
					this.index=-1;
					this.setActiveClass(this.active);
				}
			}
			
		},
		//创建分页按钮
		createPaginationBtn:function(){
			var arrBtn=[],len=this.len,$ol=$('<ol>');
			for(var i=0;i<len;i++){
				arrBtn.push('<li class="slide-btn">'+(i+1)+'</li>');
			}
			this.container.append($ol.html(arrBtn.join('')));
		},
		//创建左右切换按钮
		createPrevNextBtn:function(){
			var $prevBtn=$('<a class="slide-prev">‹</a>'),
				$nextBtn=$('<a class="slide-next">›</a>');
			this.container.append($prevBtn,$nextBtn);	
		},
		//切换
		toggle:function(){
			var that=this,
				_effect=this.settings.effect;
			if(this.isAnimate&&this.settings.effect!='fadeIn'){
				this.isAnimate=false;
				this.setActiveClass(this.active);
				//运动
				if(this.settings.effect!='fadeIn'&&!this.oUl.is(':animated')){
					switch(_effect){
						case 'left':
							that._fnEffectLeft();
						break;
						case 'top':
							that._fnEffectTop();
						break;
					}
				}
				
			}else if(this.settings.effect=='fadeIn'){
				this._fnEffectFadeIn();
			}
			//回调
			this.callback();
		},
		//重置初始位值
		resetInitial:function(){
			var _effect=this.settings.effect;
			switch(_effect){
				case 'left':
					if(this.dir=='next'){
						if(this.index>=this.len){
							this.oUl.css({
								left:-this.width
							})
						}
					}else{
						if(this.index<=-1){
							this.oUl.css({
								left:-this.len*this.width
							})
						}
					}
				break;
				case 'top':
					if(this.dir=='next'){
						if(this.index>=this.len){
							this.oUl.css({
								top:-this.height
							})
						}
					}else{
						if(this.index<=-1){
							this.oUl.css({
								top:-(this.len)*this.height
							})
						}
					}
				break;
			}
			this.isAnimate=true;
		},
		//设置当前状态样式
		setActiveClass:function(active){
			this.container
				.find('.slide-btn')
				.eq(active)
				.addClass('active')
				.siblings()
				.removeClass('active');
		},
		//左右切换
		prevNextSlide:function(){
			//this.isAnimate解决连续点击过于频繁产生的bug
			if(this.settings!='fadeIn'){
				this.dir=='next'?this.isAnimate&&(this.active++):this.isAnimate&&(this.active--)
				this._fnUpdateIndex();
			}else{
				this.dir=='next'?(this.active++):(this.active--)
				this._fnUpdateIndex();
			}
			this.toggle();
		},
		//无缝切换
		loop:function(){
			var $oUl=this.oUl,
				first=$oUl.find('>li:first').clone(),
				last=$oUl.find('>li:last').clone();
				$oUl.prepend($(last)).append($(first));
				if(this.settings.effect=='left'){
					$oUl.css({
						'left':-this.width
					});
				}else if(this.settings.effect=='top'){
					$oUl.css({
						'top':-this.height
					});
				}
				
		
		},
		//自动切换
		autoPlay:function(){
			var that=this;
			this.timer=setInterval(function(){
				that.dir='next';
				that.prevNextSlide();
			},this.settings.autoPlayTime*1000);
				
		},
		//回调返回当前索引index
		callback:function(){
		 	this.settings.callback&&this.settings.callback(this.active);
		}
		
	}
	Slide.defaults={
		'eventType':'click', //click、mouseenter
		'effect':'left',     //left、top、fadeIn
		'delay':150,         //延迟时间（eventType为mouseenter）
		'time':300,          //动画持续时间
		'paginationBtn':true,//是否显示分页按钮
		'prevNextBtn':true,  //是否显示左右切换按钮
		'autoPlay':true,     //是否自动播放
		'autoPlayTime':3    //自动播放间隔时间
		
	}

	win.Slide=Slide;
	
})(jQuery,window);

/*=============================
 * popup.js v1.0
 *=============================*/
+(function($,win){
	'use strict';
	
	var Popup=function(options){
		this.options=options;
		this.body=$('body');
		this.timer=null;
		this.settings=$.extend({},Popup.defaults,this.options);
		this.init();
		
	},
	index=0;

	Popup.VERSION='1.0';

	Popup.prototype={
		init:function(){
			this.create();
			this.bindEvent();
		},
		bindEvent:function(){
			var that=this,
				_settings=this.settings;
				
			this.body.on('click','[data-close-index='+that.index+']',function(){
				var $this=$(this),_index=$this.attr('index');
				$.popup.close(_index);
				_settings.mask&&that.removeMask();
				//关闭按钮回调
				_settings.closeBtnCallback&&_settings.closeBtnCallback();
			});
			
			//各种回调
			this.body.find('[data-popup-index='+that.index+']').find('.ww-button').each(function(i,item){
					$(item).on('click',function(){
						switch(i){
							//默认第一个按钮（确定）的回调
							case 0:
								_settings.yes&&_settings.yes(that.index);
							break;
							//默认第二个按钮（取消）的回调
							case 1:
								$.popup.close(that.index);
								_settings.no&&_settings.no(that.index);
							break;
							//按钮多于两个的时候的回调
							default:
								$.popup.close(that.index);
								_settings.callback&&_settings.callback(i);
						}
						_settings.mask&&that.removeMask();
					})
			});
			
			//没有设置title以及btns的时候默认是信息提示层
			if(!_settings.title&&!_settings.btns&&_settings.time){
				that.timer&&clearTimeout(that.timer);
				that.timer=setTimeout(function(){
					$.popup.close(that.index);
					_settings.mask&&that.removeMask();
				},_settings.time*1000);
			}
			
		},
		create:function(){
			if(!this.settings.title&&!this.settings.btns&&this.settings.time){
				this.settings.type='tips';
			}
			var _settings=this.settings,
				_type=_settings.type,
				_btns=_settings.btns,
				_headHTML=(function(){
					return '<div class="ww-popup-head"><h3>'+_settings.title+'</h3>'+(_settings.coloseBtn?'<a href="javascript:;" class="ww-popup-close" data-close-index='+index+' index='+index+'>×</a>':'')+'</div>';
				})(),
				_btnsHTML=(function(){
					var	_buttons='';
					if(_btns){
						for(var i=0;i<_btns.length;i++){
							_buttons+='<a href="javascript:;" class="ww-button ww-button-'+i+'">'+_btns[i]+'</a>';
						}
						return _buttons;
					}
				})(),
				_footHTML=(function(){
					return '<div class="ww-popup-foot">'+_btnsHTML+'</div>';
				})(),
				_popup='<div class="ww-popup-container ww-popup-'+_type+'" data-popup-index='+index+'>'+(_settings.title?_headHTML:'')+'<div class="ww-popup-content">'+_settings.content+'</div>'+(_settings.btns?_footHTML:'')+'</div>';
			
			this.index=index++;		
			this.createMask();			
			this.body.append(_popup);
			
			//设置居中显示
			var $win=$(win),
				$winW=$win.width(),
				$winH=$win.height(),
				$popup=$('[data-popup-index='+(index-1)+']'),
				$popupW=$popup.outerWidth(),
				$popupH=$popup.outerHeight(),
				_left=($winW-$popupW)/2,
				_top=($winH-$popupH)/2;
			$popup.css({
				left:_left,
				top:_top
			});
		
		},
		createMask:function(){
			var $wwPopupMsk=$('<div class="ww-popup-mask"></div>'),_mask=this.settings.mask;
			_mask&&this.body.append($wwPopupMsk);
		},
		removeMask:function(){
			this.settings.mask&&$('.ww-popup-mask').remove();
		}
		
	}

	Popup.defaults={
		'type':'msg',                           //msg
		'content':'欢迎使用万维UI组件popup=.=', //默认内容
		'mask':true,                            //是否显示遮罩层
		'coloseBtn':true                        //是否显示关闭按钮
	}
	
	win.popup=$.popup={
		index:index,
		init:function(options){
			var obj= new Popup(options);
			return obj.index;
		},
		close:function(index){
			$('[data-popup-index='+index+']').remove();
		}
	}
	
	
})(jQuery,window);


/*=============================
 * tab.js v1.0
 *=============================*/
 +(function($,win){
	var Tab=function(options){
		this.settings=$.extend({},Tab.DEFAULTS,options);
		var elem=this.settings.elem;
		this.wrap=$(elem.tabWrap);
		this.title=this.wrap.find(elem.tabTitle);
		this.titlePanel=elem.tabTitlePanel;
		this.main=this.wrap.find(elem.tabMain);
		this.mainPanel=elem.tabMainPanel;
		this.avtiveClass=elem.activeClass;
		this.index=0;
		this.timer=null;
		this.init();
		this.setIndex(this.index);
	}
	
	Tab.prototype={
		init:function(){
			this.bindEvent();
		},
		bindEvent:function(){
			var that=this,_set=this.settings,_delayTimer=null;
			this.wrap.on(_set.eventType,this.titlePanel,function(){
				var $this=$(this);
				if(_set.eventType=='mouseenter'){
					clearTimeout(_delayTimer);
					_delayTimer=setTimeout(function(){
						that.index=$this.index();
						that.toggle();
					},_set.delay);
				}else{
					that.index=$this.index();
					that.toggle();
				}
			});
		
			if(_set.eventType=='mouseenter'){
				this.wrap.on('mouseleave',this.titlePanel,function(){
					clearTimeout(_delayTimer);
				})
			}
			
			//自动播放
			if(this.settings.autoPlay){
				this.wrap.on('mouseenter',function(){
					that.settings.autoPlay&&clearInterval(that.timer);
				}).on('mouseleave',function(){
					that.autoPlay();
				}).trigger('mouseleave');
			}
		},
		toggle:function(){
			this.title
				.find(this.titlePanel)
				.eq(this.index)
				.addClass(this.avtiveClass)
				.siblings(this.titlePanel)
				.removeClass(this.avtiveClass);
			this.main
				.find(this.mainPanel)
				.eq(this.index)
				.addClass(this.avtiveClass)
				.siblings(this.mainPanel)
				.removeClass(this.avtiveClass);
				
			this.callback();	
		},
		autoPlay:function(){
			var that=this,
				len=this.title.find(this.titlePanel).length;
		
				this.timer=setInterval(function(){
					that.index++;
					if(that.index>=len){
						that.index=0;
					}
					that.toggle();
				},this.settings.autoPlayTime*1000);
			
		},
		setIndex:function(index){
			this.index=index;
			this.toggle();
		},
		callback:function(){
			this.settings.callback&&this.settings.callback(this.index);
		}
	}
	
	Tab.DEFAULTS={
		'elem':{
			'tabWrap':'.ww-tab-wrap',
			'tabTitle':'.ww-tab-title',
			'tabTitlePanel':'.ww-tab-title-panel',
			'tabMain':'.ww-tab-main',
			'tabMainPanel':'.ww-tab-main-panel',
			'activeClass':'active'
		},
		'eventType':'click',
		'delay':100,
		'autoPlay':false,
		'autoPlayTime':3
	}
	
	win.Tab=Tab;
	
 })(jQuery,window);