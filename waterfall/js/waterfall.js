define(function(require,exports,module){
	
	return function(jquery){
	
		;(function($){
		
			var Waterfall=function(element,options){
				var that=this;
				this.element=$(element);
				this.options=options;
				this.settings=$.extend({},Waterfall.defaults,this.options);
				this.page=0;
				this.cells=0;
				this.arrT=[];
				this.arrL=[];
				this.iStop=true;
				this.outerWidth=this.settings.width+this.settings.space;
				this.init();
			}
			
			Waterfall.prototype={
				init:function(){
					this.setCells();
					this.setSpace();
					this.getData();
					this.scrollGetData();
					this.resizeChange();
				},
				setSpace:function(){
					
					for(var i=0;i<this.cells;i++){
						this.arrT[i]=0;
						this.arrL[i]=this.outerWidth*i;
					}

				},
				setCells:function(){
					this.cells=Math.floor($(window).innerWidth()/this.outerWidth);
					
					if(this.cells<this.settings.minCells){
						this.cells=this.settings.minCells;
					}else if(this.cells>this.settings.maxCells){
						this.cells=this.settings.maxCells;
					}
					
					this.element.css({
						'width':this.outerWidth*this.cells-this.settings.space
					});
	
				},
				getData:function(){
					var that=this;
					if(!this.iStop){
						return;
					}
					that.iStop=false;
					this.page++;
					$.getJSON(this.settings.url,{page:this.page},function(data){
						$('#loader').show();
						$.each(data,function(i,obj){
							var oImg = $('<img />');

							var iHeight = obj.height * (that.settings.width / obj.width);
							oImg.css({
								width:that.settings.width,
								height:iHeight
							});
							
							var _index = that.getMin();
							oImg.css({
								left:that.arrL[_index],
								top:that.arrT[_index]
							});
							that.arrT[_index] += iHeight + that.settings.space;
							
							that.element.append(oImg);
							
							var objImg = new Image();
							objImg.onload = function() {
								oImg.attr('src', this.src);
							}
							objImg.src = obj.preview;
							
							setTimeout(function() {
								$('#loader').hide();
							},1000)

							
							that.iStop = true;

						})	
					})
				
				},
				getMin:function(){
					var _t = this.arrT[0];
					var _index = 0;
					
					for (var i=1; i<this.arrT.length; i++) {
						if (this.arrT[i] < _t) {
							_t = this.arrT[i];
							_index = i;
						}
					}
					return _index;
					
				},
				scrollGetData:function(){
					var that=this;
					$(window).on('scroll',function(){
						var _index=that.getMin();
						var _h=$(window).scrollTop()+$(window).innerHeight();
						if(that.arrT[_index]+50<_h){
							that.getData();
						}
					})
				},
				resizeChange:function(){
					var that=this;
					$(window).on('resize',function(){

						var _len=that.cells;
						that.setCells();
						if(_len==that.cells){
							return;
						}
						that.setSpace();
						that.element.find('img').each(function(){
							var _index=that.getMin();
							$(this).animate({
								left:that.arrL[_index],
								top:that.arrT[_index]
							}, 1000);
							that.arrT[_index] += $(this).height() + that.settings.space;

						})
					})
				}
			
			}
		
			Waterfall.defaults={
				'width':200,
				'space':10,
				'minCells':3,
				'maxCells':7,
				'url':'http://www.wookmark.com/api/json/popular?callback=?'
			}
			$.fn.waterfall=function(options){
				return this.each(function () {
					new Waterfall(this,options);
				})
			}
		
		})(jQuery);

	}
	
});

