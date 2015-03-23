define(['base'],function (base) {
	/**
	 * @author  sunchengbin | sunchengbin@ur-menu.com
	 * @update  2013-11-15
	 * @version  v1.0
	 * @explain  日期插件
	 */
	var HCCalendar = function(opts){
		this.opts = $.extend({
			target : null,//操作显示日历的dom对象
			container : '#j_ym_calendar',//初始日历的容器
			calendarNum : 1,//显示几个日历
			dayRange : null,//显示范围日期
			isTodaySelect : 1,//从今天开始显示可选日历
			beforeToday:[0,null/*{selectedYear:,selectedMonth :,selectedDay:,isThisDay:}*/],//显示(今天或者指定日期)及以前的日历//isThisDay=0时是不包括指定日期//
			afterToday:[0,null/*{selectedYear:,selectedMonth :,selectedDay:,isThisDay:}*/],//显示(今天或者指定日期)及以后的日历//isThisDay=0时是不包括指定日期//
			selectedYear : null,//日历开始的年份(不设置为当天所在年份)
			selectedMonth : null,//日历开始的月(不设置为当天所在月)
			selectedDay : null,//日历开始的被选中天(不设置为当天日期)
			zIndex : base.ZINDEX,//设置日历的z-index
			hideCalendar : true,//点击日历外是否可以隐藏日历
			booleanSelectedYears : true,//是否可以选择年份列表被选日期是否变成选中状态
			isShowSelectedDate : true,//
			haveStartDate : false,//固定日历的开始日期(默认跟随当前日期)
			dateFormat : 'yyyy-mm-dd',//输入输出的日期格式
			isSelected : null,//是否以选中日期为开始的年月日
			getInitSelectedDate : null,//获得初始日期信息(默认情况是通过对target的val或者html来获得)
			verfyFiledFn : null,//点击或者focus对象target获得的初始信息失败的对应操作
			verfySuccessFn : null,//点击target(如果是显示日期的显示区为html)执行
			selectedDayFunc : null,//选择日期后
			showTime : null,//显示时间选择
			initNotInputHtm : null//当target是非input的dom时采用的
		},opts || {});
		this.cache = {//用于存储日历插件选中日期
			selectedYear : null,
			selectedMonth : null,
			selectedDay : null,
			selectedDate : null,
			selectedHour : null,
			selectedMinute : null,
			selectedSecond : null
		};
        this.initInterface();
		this.opts.target && this.targetFn();
		return this;
	};
	HCCalendar.prototype = {
        /**
         * @kev
         */
        initInterface : function () {
            var conf = this.opts,
                date = new Date(),
                y = conf.selectedYear || date.getFullYear(),
                m = conf.selectedMonth || date.getMonth() + 1,
                d = conf.selectedDay || date.getDate(),
                nowHour = date.getHours(),
                nowMinute = date.getMinutes(),
                nowSecond = date.getSeconds();
            this.setCacheSelectedInfo(y, m, d,nowHour,nowMinute,nowSecond);
        },
		getInitSelectedDateFn : function(target){//初始获得对象日历信息fn
			var _day = '';
			this.opts.target = target;
			if(target.is(':input')){
				_day = $.trim(target.val());
			}else{
				_day = $.trim(target.html());
			}
			if(this.opts.getInitSelectedDate){
				_day = this.opts.getInitSelectedDate.call(this,target);
			}
			return _day;
		},
		initTargetFn : function(day){//初始日历对象初始化操作fn
			var _target = $(this.opts.target);
			var thisCase = this;
			if(!day){//没传值的时候
				thisCase.clearCacheSelectedInfo();
				thisCase.setCacheSelectedDate();
				var selectedDateInfo = thisCase.transSelectedDateInfo();
				thisCase.setCacheSelectedInfo(selectedDateInfo.selectedYear,selectedDateInfo.selectedMonth,selectedDateInfo.selectedDay,selectedDateInfo.selectedHour,selectedDateInfo.selectedMinute,selectedDateInfo.selectedSecond);
			}else if(thisCase.testDateFormat(day)){//传过来的日期格式和输出格式一致的时候
				if(!thisCase.opts.haveStartDate){
					var selectedDateInfo = thisCase.transSelectedDateInfo(day);
					thisCase.setCacheSelectedInfo(selectedDateInfo.selectedYear,selectedDateInfo.selectedMonth,selectedDateInfo.selectedDay,selectedDateInfo.selectedHour,selectedDateInfo.selectedMinute,selectedDateInfo.selectedSecond);
					thisCase.setCacheSelectedDate(day);
				}
			}else{
				if(thisCase.opts.verfyFiledFn){
					thisCase.opts.verfyFiledFn();
				}else{
					if(thisCase.opts.verfySuccessFn){
						thisCase.opts.verfySuccessFn.call(thisCase,_target);
					}else{
						if(_target.is(':input')){
							_target.val(thisCase.getSelectedDate());
						}else{
							var _htm = thisCase.opts.initNotInputHtm?thisCase.opts.initNotInputHtm.call(thisCase):thisCase.getSelectedDate();
							_target.html(_htm);
						}
					}
					
				}
			}
			thisCase.init();
			thisCase.handelEvent();
		},
		targetFn : function(){//target对象添加
			var thisCase = this;
			var _target = $(this.opts.target);
			if(_target.is(':input')){
				_target.focus(function(){
					var _this = $(this);
					thisCase.getInitDateInfo();
					var _day = thisCase.getInitSelectedDateFn(_this);
					thisCase.initTargetFn(_day);
				}).blur(function(){
					var _val = $.trim($(this).val());
					if(!_val){
					}else if(!thisCase.testDateFormat(_val)){
						$(this).val(thisCase.getSelectedDate());
					}else{
					}
				})
			}else{
				_target.click(function(){
					thisCase.getInitDateInfo();
					var _day = thisCase.getInitSelectedDateFn($(this));
					thisCase.initTargetFn(_day);
				});
			}
		},
		init:function(){//没有特殊要求的一个页面只显示一个日历
			this.render();
			this.show();
			this.setPosition();
			this.selectedDay();
			//if(this.opts.dayRange || this.opts.beforeToday){
				this.clearNoSelectDay();
			//}
			return this;
		},
		getInitDateInfo : function(){//获得初始化日历日期
			var selectedDateInfo = !this.cache.selectedDate?
			this.transSelectedDateInfo():
			this.transSelectedDateInfo(this.cache.selectedDate);
			this.setCacheSelectedInfo(selectedDateInfo.selectedYear,selectedDateInfo.selectedMonth,selectedDateInfo.selectedDay,selectedDateInfo.selectedHour,selectedDateInfo.selectedMinute,selectedDateInfo.selectedSecond);
			return this;
		},
        /**
         * 获取当前选择日期{object}
         */
		getCacheSelectedInfo : function(){//输出选择的日期信息
			return {
				selectedYear : this.cache.selectedYear,
				selectedMonth : this.cache.selectedMonth,
				selectedDay : this.cache.selectedDay,
				selectedHour : this.cache.selectedHour ,
				selectedMinute : this.cache.selectedMinute,
				selectedSecond : this.cache.selectedSecond
			};
		},
		setCacheSelectedInfo : function(nowYear,nowMonth,nowDay,nowHour,nowMinute,nowSecond){//存储选择的日期信息
			nowYear = Number(nowYear);
			nowMonth = Number(nowMonth);
			nowDay = Number(nowDay);
			nowHour = Number(nowHour);
			nowMinute = Number(nowMinute);
			nowSecond = Number(nowSecond);
			this.cache.selectedYear = nowYear;//展示的当前年
			this.cache.selectedMonth = nowMonth;//展示的当前月
			this.cache.selectedDay = nowDay;//当前日期
			this.cache.selectedHour = nowHour;//展示的当前小时
			this.cache.selectedMinute = nowMinute;//展示的当前分
			this.cache.selectedSecond = nowSecond;//当前秒
		},
		clearCacheSelectedInfo : function(){
			this.cache.selectedYear = null;//展示的当前年
			this.cache.selectedMonth = null;//展示的当前月
			this.cache.selectedDay = null;//当前日期
			this.cache.selectedHour = null;//展示的当前小时
			this.cache.selectedMinute = null;//展示的当前分
			this.cache.selectedSecond = null;//当前秒
		},
		setCacheSelectedDate : function(date){//设置选择的日期
			this.cache.selectedDate = date;//展示的当前年
			return this;
		},
		selectedDayFn : function(target){//选择day默认方法
            this.setCacheSelectedDate(this.getSelectedDate());
            if(this.opts.selectedDayFunc){
                this.opts.selectedDayFunc.call(this,target);
            }
            else{
                if($(this.opts.target).is('input')){
                    $(this.opts.target).val(this.getSelectedDate());
                }
                else{
                    $(this.opts.target).html(this.getSelectedDate());
                }
            }
		},
		handelEvent : function(){//日历操作事件添加
			var thisCase = this;
			$(document).bind('click',function(e){
		        if($(e.target).is(thisCase.opts.target) || $(thisCase.opts.target).is($(e.target).parents())){
		            thisCase.show();
		        }else{
		        	if($(e.target).is(thisCase.opts.containerWraper) || $(thisCase.opts.containerWraper).is($(e.target).parents())){
		        		if($(e.target).is(thisCase.opts.containerWraper.find('[data-class="onday"]')) || $(e.target).is(thisCase.opts.containerWraper.find('.calendarBtn'))){//时间选项
                        }else{
                            thisCase.show();
                        }
		        	}else{
		        		thisCase.opts.hideCalendar && thisCase.hide();
		        	}
		        }
		    });
			thisCase.opts.containerWraper.unbind('click').on('click','[data-class="onday"]',function(){//时间选项
				var _this = $(this);
				if(!thisCase.opts.showTime){
					thisCase.setCacheSelectedInfo(_this.attr('data-year'),_this.attr('data-month'),_this.html());
	    			thisCase.selectedDayFn(_this);
	                thisCase.opts.hideCalendar && thisCase.hide(); 
				}else{
					var _hour = $('#j_ym_calendar').find('.hour').val();
					var _minute = $('#j_ym_calendar').find('.minute').val();
					var _second = $('#j_ym_calendar').find('.second').val();
					thisCase.setCacheSelectedInfo(_this.attr('data-year'),_this.attr('data-month'),_this.html(),_hour,_minute,_second);
	    			thisCase.selectedDayFn(_this);
	    			thisCase.selectedDay();
				}
    			
            });
            if(thisCase.opts.showTime){
            	thisCase.opts.containerWraper.on('change','.calendarTime select',function(){//年列表选项
            		var _this = $(this);
            		var _hour = $('#j_ym_calendar').find('.hour').val();
					var _minute = $('#j_ym_calendar').find('.minute').val();
					var _second = $('#j_ym_calendar').find('.second').val();
            		thisCase.setCacheSelectedInfo(thisCase.cache.selectedYear,thisCase.cache.selectedMonth,thisCase.cache.selectedDay,_hour,_minute,_second);
	            	thisCase.selectedDayFn(_this);
	            });
	            thisCase.opts.containerWraper.on('click','.calendarBtn',function(){//年列表选项
            		var _this = $(this);
            		var _hour = $('#j_ym_calendar').find('.hour').val();
					var _minute = $('#j_ym_calendar').find('.minute').val();
					var _second = $('#j_ym_calendar').find('.second').val();
            		thisCase.setCacheSelectedInfo(thisCase.cache.selectedYear,thisCase.cache.selectedMonth,thisCase.cache.selectedDay,_hour,_minute,_second);
	            	thisCase.selectedDayFn(_this);
	            	thisCase.opts.hideCalendar && thisCase.hide(); 
	            });
            }
            thisCase.opts.containerWraper.on('click','.j_show_selected',function(){//年列表选项
            	thisCase.opts.booleanSelectedYears && thisCase.selectedYearsHtmAct();
            });
		    thisCase.changeMonthOrYear();
		    $(window).unbind('resize').bind('resize',function(){
		    	thisCase.hide();
		    });
		},
		changeMonthOrYear : function(){//添加切换年月时间事件
			var thisCase = this;
			var _containerWraper = $(this.opts.containerWraper);
			_containerWraper.find('.prev_month').click(function(){
				thisCase.prevMonth();
			});
			_containerWraper.find('.next_month').click(function(){
				thisCase.nextMonth();
			});
			_containerWraper.find('.prev_year').click(function(){
				thisCase.prevYear();
			});
			_containerWraper.find('.next_year').click(function(){
				thisCase.nextYear();
			});
		},
		nextMonth : function(){//切换到下个月的操作
			var thisCase = this;
			this.cache.selectedYear =  this.cache.selectedMonth == 12
                ? this.cache.selectedYear + 1
                : this.cache.selectedYear;
			this.cache.selectedMonth = this.cache.selectedMonth == 12
                ? 1
                : this.cache.selectedMonth + 1;
			$(this.opts.containerWraper).find('[data-id="dayList"]').html(thisCase.calendarDayHtm());
			thisCase.showSelectedDate();
			thisCase.opts.booleanSelectedYears && thisCase.hideSelectedYears();
		},
		prevMonth : function(){//切换到上个月的操作
			var thisCase = this;
			this.cache.selectedYear =  this.cache.selectedMonth == 1?this.cache.selectedYear - 1:this.cache.selectedYear;
			this.cache.selectedMonth = this.cache.selectedMonth == 1?12:this.cache.selectedMonth - 1;
			$(this.opts.containerWraper).find('[data-id="dayList"]').html(thisCase.calendarDayHtm());
			thisCase.showSelectedDate();
			thisCase.opts.booleanSelectedYears && thisCase.hideSelectedYears();
		},
		nextYear : function(){//切换到下一年的操作
			var thisCase = this;
			this.cache.selectedYear =  this.cache.selectedYear + 1;
			$(this.opts.containerWraper).find('[data-id="dayList"]').html(thisCase.calendarDayHtm());
			thisCase.showSelectedDate();
			thisCase.opts.booleanSelectedYears && thisCase.hideSelectedYears();
		},
		prevYear : function(){//切换到上一年的操作
			var thisCase = this;
			this.cache.selectedYear =  this.cache.selectedYear - 1;
			$(this.opts.containerWraper).find('[data-id="dayList"]').html(thisCase.calendarDayHtm());
			thisCase.showSelectedDate();
			thisCase.opts.booleanSelectedYears && thisCase.hideSelectedYears();
		},
		show : function(){//显示日历插件
			this.opts.containerWraper.show();
			this.setZindex();
		},
		hide : function(){//隐藏日历插件
			this.opts.containerWraper.hide();
		},
		dieContainerWraper : function(){//销毁日历html
			this.opts.containerWraper.remove();
		},
		createContainerWraper : function(){//创建整个日历初始的dom对象
			this.opts.containerWraper = $(this.opts.container).length == 0?this.calendarContainerHtm():$(this.opts.container);
		},
		render : function(){//渲染日历
			this.createContainerWraper();
			this.opts.containerWraper.html(this.calendarBoxHtm());
		},
		calendarContainerHtm : function(){//日历控件显示区
			if($('#j_ym_calendar').length === 0){
				$('body').append('<div id="j_ym_calendar" class="clearfix" style="display:none;"></div>');
			}
			this.opts.containerWraper = $('#j_ym_calendar');
			return $('#j_ym_calendar');
		},
		calendarTopHtm : function(opts){//日历头
			opts = $.extend({
				selectedYear : this.cache.selectedYear,
				selectedMonth : this.cache.selectedMonth,
				selectedDay : this.cache.selectedDay
			},opts || {});
			var dayHtm = '';
			dayHtm = this.calendarDayHtm(opts);
			var topHtm = '<div data-id="j_show_selected_date" class="year" '
					+(this.opts.calendarNum == 1 && !this.opts.dayRange?'':'style="text-align:center;"')+'>'
                    +(this.opts.calendarNum == 1 && !this.opts.dayRange?
                    '<a href="javascript:;" class="prev_year"></a><a href="javascript:;" class="prev_month"></a>':'')
                    +''
                    +(this.opts.calendarNum == 1 && !this.opts.dayRange?
                    	'<span class="j_show_selected"><i class="selected_year">'+opts.selectedYear+'年</i><em></em></span>'
                    	+'<span class="selected_month">'+this.monthOrDayToString(opts.selectedMonth)+'月</span>'
                    	+'<a href="javascript:;" class="next_month"></a>'
                    	+'<a href="javascript:;" class="next_year"></a>':opts.selectedYear+'年'+opts.selectedMonth+'月')
            		+'</div>'
            		+'<ul class="date_title">'
	                +'<li>日</li>'
	                +'<li>一</li>'
	                +'<li>二</li>'
	                +'<li>三</li>'
	                +'<li>四</li>'
	                +'<li>五</li>'
	                +'<li>六</li>'
        			+'</ul>'
        			+'<ul class="j_day_list" data-id="dayList">'
        			+dayHtm
        			+'</ul>';
            return topHtm;
		},
		calendarBoxHtm : function(){//单个日历主体
			var topHtm = '';
			var boxHtm = '';
			this.countCalendarNum();
			if(this.opts.calendarNum > 1){
				for(var i = 0;i < this.opts.calendarNum;i++){
					var _selectedMonth = Number(this.opts.selectedMonth)
					?(i?Number(this.opts.selectedMonth)+1:Number(this.opts.selectedMonth))
					:(this.cache.selectedMonth + i > 12?this.cache.selectedMonth + i -12:this.cache.selectedMonth + i);
					topHtm = this.calendarTopHtm({
						selectedYear : this.cache.selectedMonth + i > 12?this.cache.selectedYear + 1:this.cache.selectedYear,
						selectedMonth : _selectedMonth,
						selectedDay : this.cache.selectedDay,
						calendarIndex : i
					});
					boxHtm += '<div class="module_date fl">'+topHtm+'</div>';
				}
			}else{
				topHtm = this.calendarTopHtm();
				
				if(this.opts.showTime){
					boxHtm += '<div class="module_date fl">'+topHtm+this.calendarTimeHtm()+'</div>';
				}else{
					boxHtm = '<div class="module_date fl">'+topHtm+'</div>';
				}
			}
			return boxHtm;
		},
		calendarDayHtm : function(opts){//日历日期html
			opts = $.extend({
				selectedYear : this.cache.selectedYear,
				selectedMonth : this.cache.selectedMonth,
				selectedDay : this.cache.selectedDay
			},opts || {});
			var dayTd = 42;//日期总格数
			var dayHtm = [];
			var firstDayRow = this.getFirstDayRow(opts);
			var monthDayRange = this.getMonthRange(opts);
			var showRange = monthDayRange + firstDayRow;//遍历多少天
			for(var i = 0;i < dayTd;i++){
				if(i < firstDayRow){
					dayHtm.push('<li></li>');
				}else if(i >= firstDayRow && i < showRange){
					var htm = '<li><a href="javascript:;" data-class="onday" '
							+'data-year="'+opts.selectedYear+'" '
							+'data-month="'+opts.selectedMonth+'" '
							+'>'+(i-firstDayRow+1)+'</a>'
							+'</li>';
					dayHtm.push(htm);
				}else{
					dayHtm.push('<li></li>');
				}
			}
			return dayHtm.join('');
		},
		calendarTimeHtm : function(opts){
			opts = $.extend({
				selectedYear : this.cache.selectedYear,
				selectedMonth : this.cache.selectedMonth,
				selectedDay : this.cache.selectedDay,
				selectedHour : this.cache.selectedHour,
				selectedMinute : this.cache.selectedMinute,
				selectedSecond : this.cache.selectedSecond
			},opts || {});
			var _htm = '';
			_htm += '<p class="calendarTime">'
					+'<select class="hour">'
					+'<option class="" value="0">时</option>';
					for(var i = 0;i < 24;i++){
						_htm +=	'<option class="" '+((i == opts.selectedHour)?'selected="selected"':'')+' value="'+i+'">'+i+'</option>'
					}
			_htm += '</select>'
					+'<select class="minute">'
					+'<option class="" value="0">分</option>';
					for(var j = 0;j < 60;j++){
						_htm +=	'<option class="" '+((j == opts.selectedMinute)?'selected="selected"':'')+' value="'+j+'">'+j+'</option>'
					}
			_htm += '</select>'
					+'<select class="second">'
					+'<option class="" value="0">秒</option>';
					for(var k = 0;k < 60;k++){
						_htm +=	'<option class="" '+((k == opts.selectedSecond)?'selected="selected"':'')+' value="'+k+'">'+k+'</option>'
					}
			_htm += '</select>'
					+'<a class="calendarBtn" href="javascript:;">确定</a>'
					+'</p>';
			return _htm;
		},
		setSelectedInfo : function(nowYear,nowMonth,nowDay,nowHour,nowMinute,nowSecond){//设置默认初始日历日期
			nowYear = Number(nowYear);
			nowMonth = Number(nowMonth);
			nowDay = Number(nowDay);
			nowHour = Number(nowHour);
			nowMinute = Number(nowMinute);
			nowSecond = Number(nowSecond);
			this.opts.selectedYear = nowYear;//展示的当前年
			this.opts.selectedMonth = nowMonth;//展示的当前月
			this.opts.selectedDay = nowDay;//当前日期
			this.opts.selectedHour = nowHour;//展示的当前年
			this.opts.selectedMinute = nowMinute;//展示的当前月
			this.opts.selectedSecond = nowSecond;//当前日期
		},
		transSelectedDateInfo : function(date){//解析选中日期
			var nowYear = (new Date()).getFullYear();
			var nowMonth = (new Date()).getMonth()+1;
			var nowDay = (new Date()).getDate();
			var nowHour = (new Date()).getHours();
			var nowMinute = (new Date()).getMinutes();
			var nowSecond = (new Date()).getSeconds();
			if(!date){
				return this.cloneSelectedDate(nowYear,nowMonth,nowDay,nowHour,nowMinute,nowSecond);
			}
			else if(typeof date === 'string'){
				return this.getDateFormatFn(this.getFormatMap(date).getTransDateFn,date);
			}else{
				return {
					selectedYear : date.getFullYear(),
					selectedMonth :  date.getMonth()+1,
					selectedDay : date.getDate(),
					selectedHour : date.getHours(),
					selectedMinute :  date.getMinutes(),
					selectedSecond : date.getSeconds()
				};
			}
		},
		transformDay : function(daynum){//数字周几转换为文字星期几
			var dayJson = {1:'星期一',2:'星期二',3:'星期三',4:'星期四',5:'星期五',6:'星期六',0:'星期日'};
			if(dayJson[daynum] !== undefined){
				return dayJson[daynum];
			}else{
				throw new Error('不存在该星期');
			}
		},
		cloneSelectedDate : function(nowYear,nowMonth,nowDay,nowHour,nowMinute,nowSecond){//按照输入的selectedyear或者selectedMonth来初始日历
			return {
				selectedYear : Number(this.opts.selectedYear) || nowYear,
				selectedMonth : Number(this.opts.selectedMonth) || nowMonth,
				selectedDay : Number(this.opts.selectedDay) || nowDay,
				selectedHour : Number(this.opts.selectedHour) || nowHour,
				selectedMinute :  Number(this.opts.selectedMinute) || nowMinute,
				selectedSecond : Number(this.opts.selectedSecond) || nowSecond
			};	
		},
        /**
         * 获取周信息
         */
		getWeek : function(opts){//获得某一天是星期几
			var firstDate = new Date();//第一天
			firstDate.setFullYear(opts.selectedYear);
			firstDate.setMonth(opts.selectedMonth-1);
			firstDate.setDate(opts.selectedDay);
			return firstDate.getDay();
		},
		getFirstDayRow : function(opts){//计算每个月第一天的1号排在第几列（以周日为第一列）
			opts = $.extend({
				selectedYear : this.cache.selectedYear,
				selectedMonth : this.cache.selectedMonth,
				selectedDay : this.cache.selectedDay
			},opts || {});
			opts.selectedDay = 0;
			var firstDayRow = this.getWeek(opts)+1;//第一天星期几
			if(firstDayRow === 7){
				firstDayRow = 0;
			}
			return firstDayRow;
		},
		getMonthRange : function(opts){//计算每个月的天数
			opts = $.extend({
				selectedYear : this.cache.selectedYear,
				selectedMonth : this.cache.selectedMonth,
				selectedDay : this.cache.selectedDay
			},opts || {});
			var monthDayRange = 31;
			if(opts.selectedMonth==2){
				if(opts.selectedYear % 4 === 0){//闰年
					monthDayRange = 29;
				}else{
					monthDayRange = 28;
				}
			}else if(opts.selectedMonth==1||opts.selectedMonth==3||opts.selectedMonth==5||opts.selectedMonth==7||opts.selectedMonth==8||opts.selectedMonth==10||opts.selectedMonth==12){
				monthDayRange = 31;
			}else{
				monthDayRange = 30;
			}
			return monthDayRange;
		},
		setPosition : function(){//日历定位
			if(!this.opts.target){
				return false;
			}
			var top = $(this.opts.target).offset().top;
			var left = $(this.opts.target).offset().left;
			var height = $(this.opts.target).outerHeight();
			this.opts.containerWraper.css({
				position : 'absolute',
				top : (top + height )+'px',
				left : left + 'px'
			});
		},
		showSelectedDate : function(){//切换日期(单日历情况下)
			var thisCase = this;
			this.opts.containerWraper
			.find('[data-id="j_show_selected_date"] .selected_year').html(thisCase.cache.selectedYear+'年');
			this.opts.containerWraper
			.find('[data-id="j_show_selected_date"] .selected_month').html(thisCase.monthOrDayToString(thisCase.cache.selectedMonth)+'月');
			this.selectedDay();
			//if(this.opts.dayRange || this.opts.beforeToday){
				this.clearNoSelectDay();
			//}
		},
		selectedDay : function(){//点亮被选中日期
			var thisCase = this;
			if(!this.opts.isShowSelectedDate){
				return;
			}
			this.opts.containerWraper.find('[data-class="onday"]').each(function(i,item){
				var _this = $(this);
				if(_this.is('.act')){
					_this.removeClass('act');
				}
				if(thisCase.isSelectedDate(_this.attr('data-year'),_this.attr('data-month'),_this.html())){
					_this.addClass('act');
				}
			});
		},
		monthOrDayToString : function(num){//月份和日期格式转换(由1转换为01)
			if(num.toString().length === 1){
				num = '0' + num;
			}
			return num;
		},
		isSelectedDate : function(nowYear,nowMonth,nowDay){//判断是否是被选中日期
			var selectedDate = this.transSelectedDateInfo(this.cache.selectedDate);
			if(nowYear == selectedDate.selectedYear && nowMonth == selectedDate.selectedMonth && nowDay == selectedDate.selectedDay){
				return true;
			}
			return false;
		},
		countCalendarNum : function(){//根据跨度去计算日历个数(跨度最多30天)
			if(this.opts.dayRange){
				var dateOpts = this.transSelectedDateInfo();
				var monthDayRange = this.getMonthRange(dateOpts);
				if((monthDayRange - dateOpts.selectedDay + 1) < this.opts.dayRange){//跨俩月
					this.opts.calendarNum = 2;
				}else{
					this.opts.calendarNum = 1;
				}
			}
		},
		getSatrtAndEndDay : function(date){//根据跨度时间获得开始和结束时间(用于区间显示日历的情况)
			var startDate = this.transSelectedDateInfo(date);
			if(this.startDateIsToday(startDate)){//开始日期等于今天的时候
				if(!this.opts.isTodaySelect){//超出营业时间
					startDate = this.getNextDay();
				}
			}
			var dayRange = this.opts.dayRange;
			var monthDayRange = this.getMonthRange(startDate);
			var endDate = {
				selectedYear : startDate.selectedDay + dayRange - 1 > monthDayRange?(startDate.selectedMonth + 1 > 12?startDate.selectedYear + 1:startDate.selectedYear):startDate.selectedYear,
				selectedMonth : startDate.selectedDay + dayRange - 1 > monthDayRange?(startDate.selectedMonth + 1 > 12?1:startDate.selectedMonth + 1):startDate.selectedMonth,
				selectedDay : startDate.selectedDay + dayRange - 1 > monthDayRange?startDate.selectedDay + dayRange - 1 - monthDayRange:startDate.selectedDay + dayRange - 1
			};
			return {
				startDate : startDate,
				endDate : endDate
			};
		},
		startDateIsToday : function(startDate){//开始日期是否为今天
			var _date = new Date();
			var _todayYear = _date.getFullYear();
			var _todayMonth = _date.getMonth()+1;
			var _todayDay = _date.getDay();
			if(_todayYear == startDate.selectedYear){
				if(_todayMonth = startDate.selectedMonth){
					if(_todayDay = startDate.selectedDay){
						return true;
					}
				}
			}
			return false;
		},
		getNextDay : function(dateObj){
			var _todayDate = new Date();
			var _nextDate = new Date(_todayDate.getTime()+24*3600*1000);
			if(dateObj){
				_todayDate.setFullYear(dateObj.selectedYear);
				_todayDate.setMonth(dateObj.selectedMonth-1);
				_todayDate.setDate(dateObj.selectedDay);
				if(!dateObj.isThisDay){
					_nextDate = _todayDate;
				}else{
					_nextDate = new Date(_todayDate.getTime()+24*3600*1000);
				}
			}
			return {
				selectedYear : _nextDate.getFullYear(),
				selectedMonth : _nextDate.getMonth()+1,
				selectedDay : _nextDate.getDate()
			}
		},
		getPreviousDay : function(dateObj){
			var _todayDate = new Date();
			var _previousDay = new Date(_todayDate.getTime()-24*3600*1000);
			if(dateObj){
				_todayDate.setFullYear(dateObj.selectedYear);
				_todayDate.setMonth(dateObj.selectedMonth-1);
				_todayDate.setDate(dateObj.selectedDay);
				if(!dateObj.isThisDay){
					_previousDay = _todayDate;
				}else{
					_previousDay = new Date(_todayDate.getTime()-24*3600*1000);;
				}
			}
			return {
				selectedYear : _previousDay.getFullYear(),
				selectedMonth : _previousDay.getMonth()+1,
				selectedDay : _previousDay.getDate()
			}
		},
		countOneDay : function(opts){//计算某一天opt=[0,{selectedYear:,selectedMonth:,selectedDay:}]
			var _todayDate = new Date();
			if(opts[1]){
				_todayDate.setFullYear(opts[1].selectedYear);
				_todayDate.setMonth(opts[1].selectedMonth-1);
				_todayDate.setDate(opts[1].selectedDay);
			}
			if(opts[0] != 0){
				_todayDate = new Date(_todayDate.getTime()+24*3600*1000*opts[0]);
			}
			return {
				year : _todayDate.getFullYear(),
				month : _todayDate.getMonth()+1,
				day : _todayDate.getDate()
			}
		},
		setBeforeToday : function(beforeToday){
			this.opts.beforeToday = beforeToday;
		},
		setAfterToday : function(afterToday){
			this.opts.afterToday = afterToday;
		},
		//get
		clearNoSelectDay : function(date){//清除不可选日期
			if(this.opts.dayRange || this.opts.beforeToday[0] || this.opts.afterToday[0]){
				var thisCase = this;
				var _satrtAndEndDay = thisCase.getSatrtAndEndDay(date);
				var _previousDate = thisCase.getPreviousDay();
				var _nextDate = thisCase.getNextDay();
				this.opts.containerWraper.find('[data-class="onday"]').each(function(){
					var _this = $(this);
					var _testDateInfo = {
						selectedYear : Number(_this.attr('data-year')),
						selectedMonth : Number(_this.attr('data-month')),
						selectedDay : Number(_this.html())
					};
					if(thisCase.opts.beforeToday[0]){//今天以后的日期不能选择
						_nextDate = (thisCase.opts.beforeToday[1] && thisCase.opts.beforeToday[1].selectedYear)?thisCase.getNextDay(thisCase.opts.beforeToday[1]):_nextDate;
						if(thisCase.verfyDate(_nextDate,_testDateInfo)){
							_this.parent().html(_this.html());
						}
					}else{
						if(thisCase.opts.afterToday[0]){//今天以前的日期可以选择
							_previousDate = (thisCase.opts.afterToday[1] && thisCase.opts.afterToday[1].selectedYear)?thisCase.getPreviousDay(thisCase.opts.afterToday[1]):_previousDate;
							if(thisCase.verfyDate(_testDateInfo,_previousDate)){
								_this.parent().html(_this.html());
							}
						}else{
							if(!thisCase.verfyDate(_satrtAndEndDay.startDate,_testDateInfo) || !thisCase.verfyDate(_testDateInfo,_satrtAndEndDay.endDate)){
								_this.parent().html(_this.html());
							}
						}
						
					}
					
				});
			}
			
		},
		verfyDate : function(startDate,endDate){//验证日期先后
			if(endDate.selectedYear === startDate.selectedYear){
				if(endDate.selectedMonth === startDate.selectedMonth){
					if(endDate.selectedDay >= startDate.selectedDay){
						return true;
					}
				}
				else if(endDate.selectedMonth > startDate.selectedMonth){
					return true;
				}
			}
			else if(endDate.selectedYear > startDate.selectedYear){
				return true;
			}
			return false;
		},
		getFormatMap : function(selectedDate){//获得日期格式验证方法映射表
			var thisCase = this;
			return {
				testFn : {
					'yyyy-mm' : function(selectedDate){
						if(!selectedDate){
							return true;
						}
						if(/^\d{4}\-\d{2}$/g.test(selectedDate)){
							return true;
						}else{
							return false;
						}
					},
					'yyyy-mm-dd' : function(selectedDate){
						if(!selectedDate){
							return true;
						}
						if(/^\d{4}\-\d{2}\-\d{2}$/g.test(selectedDate)){
							return true;
						}else{
							return false;
						}
					},
					'yyyy/mm/dd' : function(selectedDate){
						if(!selectedDate){
							return true;
						}
						if(/^\d{4}\/\d{2}\/\d{2}$/g.test(selectedDate)){
							return true;
						}else{
							return false;
						}
					},
					'mm-dd' : function(selectedDate){
						if(!selectedDate){
							return true;
						}
						if(/^\d{2}\-\d{2}$/g.test(selectedDate)){
							return true;
						}else{
							return false;
						}
					},
					'yyyy-mm-dd hh:mm:ss' : function(selectedDate){
						if(!selectedDate){
							return true;
						}
						if(/^\d{4}\-\d{2}\-\d{2}\s\d{2}\:\d{2}\:\d{2}$/g.test(selectedDate)){
							return true;
						}else{
							return false;
						}
					}
				},
				getDateFn : {
					'yyyy-mm' : function(){
						return thisCase.cache.selectedYear +'-'+thisCase.monthOrDayToString(thisCase.cache.selectedMonth);
					},
					'yyyy-mm-dd' : function(){
						return thisCase.cache.selectedYear +'-'+thisCase.monthOrDayToString(thisCase.cache.selectedMonth)+'-'
			+thisCase.monthOrDayToString(thisCase.cache.selectedDay);
					},
					'yyyy/mm/dd' : function(){
						return thisCase.cache.selectedYear +'/'+thisCase.monthOrDayToString(thisCase.cache.selectedMonth)+'/'
			+thisCase.monthOrDayToString(thisCase.cache.selectedDay);
					},
					'mm-dd' : function(){
						return thisCase.monthOrDayToString(thisCase.cache.selectedMonth)+'-'
			+thisCase.monthOrDayToString(thisCase.cache.selectedDay);
					},
					'yyyy-mm-dd hh:mm:ss' : function(){
						return thisCase.cache.selectedYear +'-'+thisCase.monthOrDayToString(thisCase.cache.selectedMonth)+'-'
			+thisCase.monthOrDayToString(thisCase.cache.selectedDay)+' '+thisCase.monthOrDayToString(thisCase.cache.selectedHour)+':'+thisCase.monthOrDayToString(thisCase.cache.selectedMinute)+':'+thisCase.monthOrDayToString(thisCase.cache.selectedSecond);
					}
				},
				getTransDateFn : {
					'yyyy-mm' : function(selectedDate){
						var _dateArr = selectedDate.split('-');
						return {
							selectedYear : Number(_dateArr[0]),
							selectedMonth : Number(_dateArr[1])
						};
					},
					'yyyy-mm-dd' : function(selectedDate){
						var _dateArr = selectedDate.split('-');
						return {
							selectedYear : Number(_dateArr[0]),
							selectedMonth : Number(_dateArr[1]),
							selectedDay : Number(_dateArr[2])
						};
					},
					'yyyy/mm/dd' : function(selectedDate){
						var _dateArr = selectedDate.split('/');
						return {
							selectedYear : Number(_dateArr[0]),
							selectedMonth : Number(_dateArr[1]),
							selectedDay : Number(_dateArr[2])
						};
					},
					'mm-dd' : function(selectedDate){
						var _dateArr = selectedDate.split('-');
						return {
							selectedYear : Number(thisCase.cache.selectedYear),
							selectedMonth : Number(_dateArr[0]),
							selectedDay : Number(_dateArr[1])
						};
					},
					'yyyy-mm-dd hh:mm:ss' : function(selectedDate){
						var _dateArr = selectedDate.split('-');
						var _hmsArr = _dateArr[2].split(' ')[1].split(':');
						return {
							selectedYear : Number(_dateArr[0]),
							selectedMonth : Number(_dateArr[1]),
							selectedDay : Number(_dateArr[2].split(' ')[0]),
							selectedHour : Number(_hmsArr[0]),
							selectedMinute : Number(_hmsArr[1]),
							selectedSecond : Number(_hmsArr[2])
						};
					}
				}
			}
		},
		getDateFormatFn : function(fn,selectedDate){//获取(日期格式验证)对应方法
			var _format = this.opts.dateFormat;
			switch(_format){
				case 'yyyy-mm':
					return !selectedDate?fn['yyyy-mm']():fn['yyyy-mm'](selectedDate);
					break;
				case 'yyyy-mm-dd':
					return !selectedDate?fn['yyyy-mm-dd']():fn['yyyy-mm-dd'](selectedDate);
					break;
				case 'yyyy/mm/dd':
					return !selectedDate?fn['yyyy/mm/dd']():fn['yyyy/mm/dd'](selectedDate);
					break;
				case 'mm-dd':
					return !selectedDate?fn['mm-dd']():fn['mm-dd'](selectedDate);
					break;
				case 'yyyy-mm-dd hh:mm:ss':
					return !selectedDate?fn['yyyy-mm-dd hh:mm:ss']():fn['yyyy-mm-dd hh:mm:ss'](selectedDate);
					break;
				default :
					return true;
			}
		},
        /**
         *  获取当前选择已格式化的日期{string}
         */
		getSelectedDate : function(){//按照给定的格式返回选择结果
			return this.getDateFormatFn(this.getFormatMap().getDateFn);
		},
		testDateFormat : function(selectedDate){//验证日期格式是否正确
			return this.getDateFormatFn(this.getFormatMap(selectedDate).testFn,selectedDate);
		},
		selectedYearsHtmAct : function(){//下拉显示切换年份列表
			if(this.opts.containerWraper.find('.j_show_selected').is('.j_show_selected_act')){
				this.opts.containerWraper.find('.j_show_selected').removeClass('j_show_selected_act');
				this.dieSelectedYearsHtm();
			}else{
				this.opts.containerWraper.find('.j_show_selected').addClass('j_show_selected_act');
				this.createSelectedYearsHtm();
			}
		},
		createSelectedYearsHtm : function(){//创建年份列表选择htm
			this.dieSelectedYearsHtm();
			var htm = '';
			var _selectedYears = this.getNextSelectedYears();
				htm += '<ul class="j_selected_years hide">';
				htm += this.createSelectedYearsListHtm(_selectedYears);
				htm += '<li class="j_prev_years">';
				htm += '<a href="javascript:;"></a>';
				htm += '</li>';
				htm += '<li class="j_next_years">';
				htm += '<a href="javascript:;"></a>';
				htm += '</li>';
				htm += '</ul>';
			this.opts.containerWraper.find('[data-id="j_show_selected_date"]').append(htm);
			this.showSelectedYears();
			this.handelSelectedYears();
			return htm;
		},
		createSelectedYearsListHtm : function(selectedYears){//创建年分列表list
			var htm = '';
			for(var i = 0;i < selectedYears.length;i++){
				htm += '<li><a data-class="selected_year" href="javascript:;">'+selectedYears[i]+'</a></li>';
			}
			return htm;
		},
		dieSelectedYearsHtm : function(){//销毁年列表选择htm
			this.opts.containerWraper.find('.j_selected_years').remove();
		},
		getPrevSelectedYears : function(startYear,nextBtn){//获得当前年份10年前的列表
			var _selectedYears = [];
			var _cacheYear = 
			this.opts.containerWraper.find('[data-class="selected_year"]').length > 0?
			Number(this.opts.containerWraper.find('[data-class="selected_year"]').eq(0).html()):Number(this.opts.selectedYear);
			for(var i = 10;i > 0;i--){
				_selectedYears.push(_cacheYear - i);
			}
			this.cache.selectedYears  === null;
			return _selectedYears;
		},
		getNextSelectedYears : function(startYear,nextBtn){//获得当前年份10年后的列表
			var _selectedYears = [];
			var _cacheYear = 
			this.opts.containerWraper.find('[data-class="selected_year"]').length > 0?
			Number(this.opts.containerWraper.find('[data-class="selected_year"]').last().html())+1:this.cache.selectedYear;
			for(var i = 0;i < 10;i++){
				_selectedYears.push(_cacheYear + i);
			}
			return _selectedYears;
		},
		changeSelectedYears : function(htm){//切换年份列表js
			this.opts.containerWraper.find('[data-class="selected_year"]').parent().remove();
			this.opts.containerWraper.find('.j_selected_years').prepend(htm);
			this.handelSelectedYears();
		},
		handelSelectedYears : function(){//选择年份列表事件绑定
			var thisCase = this;
			var _containerWraper = this.opts.containerWraper;
			_containerWraper.find('.j_selected_years [data-class="selected_year"]').click(function(){
				var _this = $(this);
				thisCase.opts.containerWraper.find('.selected_year').html(_this.html()+'年');
				thisCase.cache.selectedYears = Number(_this.html());
				
				thisCase.hideSelectedYears();
				thisCase.cache.selectedYear = Number(_this.html());
				thisCase.opts.containerWraper.find('.j_day_list').html(thisCase.calendarDayHtm());
				//if(thisCase.opts.dayRange || thisCase.opts.beforeToday){
					thisCase.clearNoSelectDay();
				//}
				thisCase.selectedDay();
			});
			_containerWraper.find('.j_prev_years').unbind('click').click(function(){
				thisCase.changeSelectedYears(thisCase.createSelectedYearsListHtm(thisCase.getPrevSelectedYears(),'prev'));
			});
			_containerWraper.find('.j_next_years').unbind('click').click(function(){
				thisCase.changeSelectedYears(thisCase.createSelectedYearsListHtm(thisCase.getNextSelectedYears(),'next'));
			});
		},
		hideSelectedYears : function(){//隐藏选择年份列表
			var _containerWraper = this.opts.containerWraper;
			_containerWraper.find('.j_show_selected').removeClass('j_show_selected_act');
			_containerWraper.find('.j_selected_years').hide();
		},
		showSelectedYears : function(){//显示选择年份列表
			this.opts.containerWraper.find('.j_selected_years').show();
		},
        /**
         * 设置zindex值
         */
		setZindex : function(zindex){
			var thisCase = this;
			thisCase.opts.zIndex = zindex || ++base.ZINDEX;
			var _containerWraper = this.opts.containerWraper;
			_containerWraper.css('zIndex',thisCase.opts.zIndex);
			_containerWraper.find('.year').css('z-index',thisCase.opts.zIndex + 1);
			_containerWraper.find('.j_selected_years').css('z-index',thisCase.opts.zIndex + 2);
			_containerWraper.find('.j_show_selected').css('z-index',thisCase.opts.zIndex + 3);
		}
	};
	return function(opts){
		return new HCCalendar(opts);
	};
});




