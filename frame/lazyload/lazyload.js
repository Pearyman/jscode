define(function () {
  var L_L = function () {
    this.init.apply(this, arguments);
  };
  L_L.prototype = {
    init: function (configs) {
      var self = this,
        configs = configs || {};
      self.configs = {
        target: configs.target || 'img[data-src]',
        showMode: configs.showMode || 'fade'  //   none   fade  ...
      };
      $(self.configs.target).css('opacity',0);
      self.setLoad();
    },
    setLoad : function(){
      var self = this,
      win = $(window),
      winheight = win.innerHeight();
      win.resize(function(){
        winheight = win.innerHeight();
      });
      var eventHandle = function(){
        $(self.configs.target).each(function(){
          if($(this).attr("src")){
            $(this).css('opacity',1);
            return true;
          }
          if($(this).attr("data-src")){
            if($(this).offset().top - win.scrollTop() < winheight){
              $(this).attr("src",$(this).attr("data-src")).removeAttr("data-src");
              if(self.configs.showMode == 'none'){
                $(this).css('opacity',1);
              }
              if(self.configs.showMode == 'fade'){
                //$(this).on('load',function(){
                  $(this).animate({
                    opacity : 1
                  })
                //})
              }
            }
          }
        })
      }
      eventHandle();
      win.off("scroll",eventHandle);
      win.on("scroll",eventHandle);
    }
  };
  var lazyload = function (configs) {
    return new L_L(configs);
  }
  return lazyload;
})