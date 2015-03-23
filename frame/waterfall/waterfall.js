define(function () {
  var W_F = function () {
    this.init.apply(this, arguments);
  };
  W_F.prototype = {
    //初始化
    init: function (configs) {
      var self = this,
        configs = configs || {};
      self.configs = {
        container: configs.container || '',
        width: configs.width || 240,
        bottomHeight : configs.bottomHeight || '',
        margin : configs.margin || [0, 0],
        padding : configs.padding || [0, 0],
        action: configs.action || '',
        fallHeight: configs.fallHeight || [0, 0, 0, 0],
        param: configs.param || '',
        paramIndex: configs.paramIndex || '',
        definecountPosition : configs.definecountPosition || null,
        beforeLoad: configs.beforeLoad || null,
        onceLoad: configs.onceLoad || null,
        afterload: configs.afterload || null,
        perNumber : configs.perNumber || 20,
        fetchStatus: true
      }
      if ($(self.configs.container).length > 0) {
        $(self.configs.container).css('position','relative');
        if(self.configs.beforeLoad){
          self.configs.beforeLoad.apply(self,arguments);
        }
        if(window.HC_WATERFALL_DATA) {
          self.waterData = typeof window.HC_WATERFALL_DATA == 'object' ? window.HC_WATERFALL_DATA.items : $.parseJSON(window.HC_WATERFALL_DATA).items;
          self.countPosition();
        }
        /*if(self.configs.action){
          self.fetchData();
        }*/
      }
    },
    /*//获取数据
    fetchData : function(){
      var self = this;
      $.ajax({
        type : 'get',
        url : self.configs.action,
        data : self.configs.param,
        dataType : 'json',
        success : function(result){

        }
      })
    },*/
    //计算位置
    countPosition : function() {
     var self = this;
      self.from = $(self.configs.container).children().length;
      self.to = (self.waterData.length - $(self.configs.container).children().length) > self.configs.perNumber ? $(self.configs.container).children().length + self.configs.perNumber : self.waterData.length;
      if(self.configs.definecountPosition){
        self.configs.definecountPosition.apply(self,arguments);
      }
      else {
        //默认留空先
      }
    },
    //插入页面
    insertHtml : function(htmlArray){
     var self = this;
      $(self.configs.container).append(htmlArray.join('')).height(Math.max.apply(Math, self.configs.fallHeight) + self.configs.padding[0]);
      if(self.to == 0){
        self.configs.afterload && self.configs.afterload.apply(self.arguments);
      }
      if(self.to > 0){
        if(self.to > self.configs.perNumber) {
          self.configs.onceLoad && self.configs.onceLoad.apply(self.arguments);
        }
        self.configs.fetchStatus = true;
        self.bindEvent();
      }
    },
    //绑定事件
    bindEvent : function(){
      var self = this,
        win = $(window),
        doc = $(document);
      self.winhandle = function(e){
        e.stopPropagation();
        if(self.configs.fetchStatus && doc.scrollTop() >= doc.height() - $('.footer').outerHeight() - win.height() - 800){
          self.configs.fetchStatus = false;
          win.off("scroll",self.winhandle);
          self.countPosition();
        }
      }
      win.on("scroll",self.winhandle)
    }
  }
  var waterfall = function (configs) {
    return new W_F(configs);
  }
  return waterfall;
})