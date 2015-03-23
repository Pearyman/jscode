define(function(){
  var C = function(){
    this.init.apply(this,arguments);
  };
  C.prototype = {
    init : function(configs){
      var self = this;
      self.setOptions(configs);
    },
    setOptions : function(o){
      var self = this;
      self.configs = {
        container : o.container || '',
        showday : o.showday || 'show',
        d : o.d || '<span class="day"></span>',
        h : o.h || '<span class="hours"></span>',
        m : o.m || '<span class="minute"></span>',
        s : o.s || '<span class="second"></span>',
        ms : o.ms || '<span class="millisecond"></span>',
        afterCount : o.afterCount || ''
      };
      self.calculate();
    },
    calculate : function(){
      var self = this,
        begintime = new Date(Date.parse($(self.configs.container).attr("begintime").replace(/-/g,   "/"))).getTime(),
        endtime = new Date(Date.parse($(self.configs.container).attr("endtime").replace(/-/g,   "/"))).getTime(),
        differtime = endtime - begintime,
        differsecond = Math.floor(differtime/1000);
      if($(self.configs.container).size() <0){
        return;
      }
      else {
        function countDown(){
          if(differsecond <0){
            if(self.configs.afterCount){
              self.configs.afterCount(self);
            }
            else{
              $(self.configs.container).html("已结束");
            }
            return;
          }
          else{
            var  timedata = {};
            timedata.day = parseInt(differsecond/(60*60*24));
            timedata.leftsecond = differsecond - timedata.day*24*60*60;
            timedata.hour = Math.floor((self.configs.showday == 'show' ? timedata.leftsecond : differsecond)/(60*60))> 10 ? Math.floor((self.configs.showday == 'show' ? timedata.leftsecond : differsecond)/(60*60)) : '0'+Math.floor((self.configs.showday == 'show' ? timedata.leftsecond : differsecond)/(60*60));
            timedata.minute = Math.floor(((self.configs.showday == 'show' ? timedata.leftsecond : differsecond)-timedata.hour*60*60)/60) < 10 ? '0'+Math.floor(((self.configs.showday == 'show' ? timedata.leftsecond : differsecond)-timedata.hour*60*60)/60) : Math.floor(((self.configs.showday == 'show' ? timedata.leftsecond : differsecond)-timedata.hour*60*60)/60);
            timedata.second = Math.floor((self.configs.showday == 'show' ? timedata.leftsecond : differsecond)-timedata.hour*60*60-timedata.minute*60) < 10 ? '0'+Math.floor((self.configs.showday == 'show' ? timedata.leftsecond : differsecond)-timedata.hour*60*60-timedata.minute*60) : Math.floor((self.configs.showday == 'show' ? timedata.leftsecond : differsecond)-timedata.hour*60*60-timedata.minute*60);
            self.insert(timedata);
            --differsecond;
            setTimeout(function(){countDown()},1000);
          }
        }
        countDown();
      }
    },
    insert : function(data){
      var self = this,
        html = [];
      if(self.configs.showday == 'show' && self.configs.h && data.day >= 1){
        var day = $(self.configs.d);
        day.html('<em>'+data.day+'</em>天');
        html.push(day);
      }
      if(self.configs.h){
        var hour = $(self.configs.h);
        hour.html('<em>'+data.hour+'</em>时');
        html.push(hour);
      }
      if(self.configs.m){
        var hour = $(self.configs.m);
        hour.html('<em>'+data.minute+'</em>分');
        html.push(hour);
      }
      if(self.configs.s){
        var hour = $(self.configs.s);
        hour.html('<em>'+data.second+'</em>秒');
        html.push(hour);
      }
      $(self.configs.container).html("");
      $.each(html,function(i,o){
        $(self.configs.container).append(o);
      })
    }
  }
  var count = function (configs) {
    return new C(configs);
  }
  return count;
})