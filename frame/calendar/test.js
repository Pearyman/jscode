require(['calendar'],function (calendar) {
    var Calendar = calendar;
    //固定显示
    var s = Calendar({
        container : '#test',
        booleanSelectedYears:true,
        hideCalendar : false,
        haveStartDate : true,
        selectedDayFunc : function(_target){
            _target.addClass('act');
        }
    });
    s.getInitDateInfo();
    s.init().handelEvent();
    //正常调用
    Calendar({
        target : '#box1 input',
        dateFormat : 'yyyy-mm-dd'
    });
    //显示多个日历
    Calendar({
        target : '#box2 input',
        dateFormat : 'mm-dd',//输入输出格式
        calendarNum : 3
    });
    //显示日历初始的年月日
    Calendar({
        target : '#box3 input',
        dateFormat : 'yyyy-mm-dd',
        selectedYear : 2013,
        selectedMonth : 1,
        selectedDayFunc : function(){
            //获得星期几
            console.log(this.transformDay(this.getWeek(this.getCacheSelectedInfo())));
        }
    });
    //特殊结构的日历初始dom
    var CAL = Calendar({
        target : '#btn',
        dateFormat : 'mm-dd',
        selectedYear : 2013,
        selectedMonth : 2,
        dayRange : 28,
        getInitSelectedDate : function(target){
            var _this = this;
            var _year = $.trim(target.html().split('月')[0]);
            var _month = $.trim(target.html().split('月')[1]);
            return _year + '月' + _month;
        },
        verfySuccessFn : function(){
           var _seledVal = this.getCacheSelectedInfo();
            var _htm = _seledVal.selectedMonth +'月'+_seledVal.selectedDay;
            $(this.opts.target).html(_htm);
        },
        selectedDayFunc : function(){
            var _seledVal = this.getCacheSelectedInfo();
            var _htm = _seledVal.selectedMonth +'月'+_seledVal.selectedDay;
            $(this.opts.target).html(_htm);
        }
    });
    //显示(今天或者指定日期)及以前的日历
    Calendar({
        target : '#box4 input',
        beforeToday : [1,{selectedYear:2014,selectedMonth:9,selectedDay:5,isThisDay:1}]
    });    
    //显示(今天或者指定日期)及以后的日历
    Calendar({
        target : '#box5 input',
        afterToday : [1,{selectedYear:2014,selectedMonth:9,selectedDay:5,isThisDay:1}]
    });
    Calendar({
        target : '#box6 input',
        dateFormat : 'yyyy-mm-dd hh:mm:ss',
        showTime : 1
    });
    Calendar({
        target : '#box7 input',
        dateFormat : 'yyyy-mm'
    });
});






