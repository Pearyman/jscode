define(['base'],function(base){
	var PAGE = function(opts){
		this.opts = $.extend({
			container : '.HC-page-container',/*渲染page的html的内容区*/
			addHandleFn : null,/*附加js事件添加到这里*/
			createPageHtml : null,/*生成默认*/
			startPage : 1,/*起始页码数*/
			currentPage : 1,/*当前页*/
			pageRange : 2,/*显示多少个页码*/
			pageAmount : 2,/*当前总页码数*/
			isShowGopage : null,/*是否显示go-page,具体go-page定位*/
			isShowPrev : null,/*是否显示prev-page,具体prev-page定位*/
			isShowNext : null,/*是否显示next-page,具体next-page定位*/
			changePage : null/*切换页码执行的操作*/
		},opts);
		this.init();
	};
	PAGE.prototype = {
		init : function(){
			this.setPageHtml();
			this.handleFn();
		},
		setAct : function(currentPage){
			$(this.opts.container).find('.act').removeClass('act');
			$(this.opts.container).find('.HC-one-page[data-page="'+currentPage+'"]').addClass('act');
		},
		handleFn : function(){
			var _that = this;
			$(this.opts.container).off('click');
			$(this.opts.container).on('click','.HC-prev-page',function(){/*上一页*/
				var _this = $(this);
				if(_that.opts.currentPage != 1){/*当前页非第一页*/
					if(_that.opts.currentPage == _that.opts.startPage){/*当前页等于开始页时重置翻页html*/
						_that.opts.currentPage = _that.opts.startPage = _that.opts.currentPage - 1;
						_that.setPageHtml();
					}else{
						_that.setAct(_that.opts.currentPage - 1);
						_that.opts.currentPage = _that.opts.currentPage - 1;
					}
					_that.opts.changePage && _that.opts.changePage.apply(_that,arguments);
				}
			});
			$(this.opts.container).on('click','.HC-one-page',function(){/*单个页*/
				var _this = $(this);
				_that.opts.currentPage = Number(_this.attr('data-page'));
				_that.setAct(_that.opts.currentPage);
				_that.opts.changePage && _that.opts.changePage.apply(_that,arguments);
			});
			$(this.opts.container).on('click','.HC-next-page',function(){/*下一页*/
				var _this = $(this);
				if(_that.opts.currentPage < _that.opts.pageAmount){/*当前页非最后页*/
					if(_that.opts.currentPage == (_that.opts.startPage + _that.opts.pageRange- 1)){/*当前页等于当前翻页最后页时重置翻页html*/

						_that.opts.startPage = (_that.opts.pageAmount - _that.opts.currentPage) < _that.opts.pageRange ? (_that.opts.pageAmount - _that.opts.currentPage)+2 :_that.opts.currentPage+1;
                        _that.opts.currentPage = _that.opts.currentPage + 1;
						_that.setPageHtml();
					}else{
						_that.setAct(_that.opts.currentPage + 1);
						_that.opts.currentPage = _that.opts.currentPage + 1;
					}
					_that.opts.changePage && _that.opts.changePage.apply(_that,arguments);
				}
                console.log(_that.opts)
			});
			$(this.opts.container).on('click','.HC-go-btn',function(){
				var _this = $(this);
				var _go_page = Number($(_that.opts.container).find('.HC-go-page').val());
				if(!isNaN(_go_page) && _go_page > 0 && _go_page <= _that.opts.pageAmount){
					_that.opts.currentPage = _go_page;
					if(_go_page >= _that.opts.startPage && _go_page <= (_that.opts.startPage + _that.opts.pageRange - 1)){
						_that.setAct(_go_page);
					}else{
						_that.opts.startPage = _go_page;
						_that.setPageHtml();
					}
				}
				_that.opts.changePage && _that.opts.changePage.apply(_that,arguments);
			});

			this.opts.addHandleFn && this.opts.addHandleFn.apply(this,arguments);
		},
		setPageHtml : function(){
			var _htm = this.opts.createPageHtml?this.opts.createPageHtml.apply(this,this.opts):this.getDefaultHtml();
			$(this.opts.container).html(_htm).addClass('HC-page-container');
			this.opts.isShowPrev && this.opts.isShowPrev.apply(this,arguments);
			this.opts.isShowNext && this.opts.isShowNext.apply(this,arguments);
			this.opts.isShowGopage && this.opts.isShowGopage.apply(this,arguments);
			base.util.limitIsNum($(this.opts.container).find('.HC-go-page'));
		},
		getDefaultHtml : function(){
			var _htm = '';
			this.opts.pageRange = this.opts.pageAmount < this.opts.pageRange ? this.opts.pageAmount : this.opts.pageRange;
			/*if(this.opts.currentPage == 1){
				_htm += '<a class="HC-prev-page" href="javascript:;" data-disable="ture" data-page="'+this.opts.currentPage+'">上一页</a>';
			}else{*/
			/*_htm += '<a class="HC-prev-page" href="javascript:;">上一页</a>';*/
			/*}*/
			if((this.opts.currentPage + this.opts.pageRange - 1) > this.opts.pageAmount){
				for(var i = (this.opts.pageAmount - this.opts.pageRange + 1);i < (this.opts.pageAmount+1);i++){
					if(i == this.opts.currentPage){
						_htm += '<a class="HC-one-page act" href="javascript:;" data-disable="ture" data-page="'+i+'">'+i+'</a>';
					}else{
						_htm += '<a class="HC-one-page" href="javascript:;" data-disable="false" data-page="'+i+'">'+i+'</a>';
					}
				}
			}else{
				for(var i = 0;i < this.opts.pageRange;i++){
					if((this.opts.currentPage + i) == this.opts.currentPage){
						_htm += '<a class="HC-one-page act" href="javascript:;" data-disable="ture" data-page="'+(this.opts.currentPage + i)+'">'+(this.opts.currentPage + i)+'</a>';
					}else{
						_htm += '<a class="HC-one-page" href="javascript:;" data-disable="false" data-page="'+(this.opts.currentPage + i)+'">'+(this.opts.currentPage + i)+'</a>';
					}
				}
			}
			/*if(this.opts.currentPage == (startPage + pageAmount - 1)){
				_htm += '<a class="HC-next-page" href="javascript:;" data-disable="ture" data-page="'+this.opts.currentPage+'">下一页</a>';
			}else{*/
			/*_htm += '<a class="HC-next-page" href="javascript:;">下一页</a>';*/
			/*}*/
			return _htm;
		},
		getCurrentPage : function(){
			return this.opts.currentPage;
		},
		destroy : function(){
			$(this.opts.container).off('click');
		}
	};
	var pagecreate = function(opts){
		return new PAGE(opts);
	}
	return pagecreate;
})