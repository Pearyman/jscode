/*
 * swipe   h5-ui-swipe 切屏组件
 * */
define(function () {
  var H_S = function () {
    this.init.apply(this, arguments);
  };
  H_S.prototype = {
    init: function (configs) {
      var self = this,
        configs = configs || {};
      self.configs = {
        container: configs.container || '.HC-h5-swipe-container',
        target: configs.target || '.HC-h5-swipe-section',
        swipePosition: configs.swipePosition || 'y',
        duration: configs.duration || 400,
        ease: configs.ease || 'ease',
        loop: configs.loop || false,
        width: configs.width || $(window).width(),
        height: configs.height || $(window).height(),
        beforeSwipe: configs.beforeSwipe || null,
        afterSwipe: configs.afterSwipe || null
      };
      if ($(self.configs.container).length == 0) {
        return;
      }
      self.swiping = false;
      self.currentIndex = 0;
      self.setStyle();
    },
    setStyle: function () {
      var self = this,
        container = $(self.configs.container),
        target = container.find(self.configs.target);
      self.nodelist = {
        container: container,
        target: target
      };
      self.maxIndex = target.length - 1;
      container.css({
        position: 'relative',
        overflow: 'hidden',
        width: self.configs.width,
        height: self.configs.height
      })
      target.css({
        position: 'absolute',
        top: '0',
        left: '0',
        display: 'none',
        zIndex: 1
      }).eq(0).css({
        display: 'block'
      })
      self.bindEvent();
    },
    bindEvent: function () {
      var self = this;
      //阻止move
      $(document).on('touchmove', function (e) {
        e.preventDefault();
      })
      if (self.configs.swipePosition == 'x') {
        self.nodelist.container.on('swipeLeft', function (e) {
          if(self.swiping){return;}
          if (self.currentIndex == self.maxIndex && !self.configs.loop) {
            return false;
          }
          self.nodelist.currentTarget = self.nodelist.target.eq(self.currentIndex);
          self.swipeTo(self.currentIndex + 1);
        })
        self.nodelist.container.on('swipeRight', function (e) {
          if(self.swiping){return;}
          if (self.currentIndex == 0 && !self.configs.loop) {
            return false;
          }
          self.nodelist.currentTarget = self.nodelist.target.eq(self.currentIndex);
          self.swipeTo(self.currentIndex - 1);
        })
      }
      if (self.configs.swipePosition == 'y') {
        self.nodelist.container.on('swipeUp', function (e) {
          if(self.swiping){return;}
          if (self.currentIndex == self.maxIndex && !self.configs.loop) {
            return false;
          }
          self.nodelist.currentTarget = self.nodelist.target.eq(self.currentIndex);
          self.swipeTo(self.currentIndex + 1);
        })
        self.nodelist.container.on('swipeDown', function (e) {
          if(self.swiping){return;}
          if (self.currentIndex == 0 && !self.configs.loop) {
            return false;
          }
          self.nodelist.currentTarget = self.nodelist.target.eq(self.currentIndex);
          self.swipeTo(self.currentIndex - 1);
        })
      }
    },
    swipeTo: function (num) {
      var self = this,
        toIndex = num,
        next = num > self.currentIndex ? true : false;
      self.swiping = true;
      if (num < 0) {
        toIndex = self.maxIndex;
      }
      if (num > self.maxIndex) {
        toIndex = 0;
      }
      self.nodelist.target.css('z-index', '1');
      var currentTarget = self.nodelist.currentTarget,
        swipeTarget = self.nodelist.target.eq(toIndex);
      self.configs.beforeSwipe && self.configs.beforeSwipe(toIndex);
      currentTarget.animate({
        transform: 'translate3d(0,0,0) scale(0.8,0.8) rotate(0deg)',
        '-webkit-transform': 'translate3d(0,0,0) scale(0.8,0.8) rotate(0deg)',
        opacity: 0
      }, self.configs.duration, self.configs.ease, function () {
        self.swiping = false;
        currentTarget.css({
          display: 'none',
          transform: 'translate3d(0,0,0) scale(1,1) rotate(0deg)',
          '-webkit-transform': 'translate3d(0,0,0) scale(1,1) rotate(0deg)'
        });
      })
      //横向
      if (self.configs.swipePosition == 'x') {
        swipeTarget.css({
          transform: 'translate3d(' + (next ? self.configs.width : -self.configs.width) + 'px,0,100px) scale(1,1) rotate(0deg)',
          '-webkit-transform': 'translate3d(' + (next ? self.configs.width : -self.configs.width) + 'px,0,0) scale(1,1) rotate(0deg)',
          display: 'block',
          opacity: 0,
          zIndex: 10
        })
        swipeTarget.animate({
          transform: 'translate3d(0,0,0) scale(1,1) rotate(0deg)',
          '-webkit-transform': 'translate3d(0,0,0) scale(1,1) rotate(0deg)',
          opacity: 1
        }, self.configs.duration, self.configs.ease, function () {
          self.currentIndex = toIndex;
          swipeTarget.css('z-index', 1);
          self.configs.afterSwipe && self.configs.afterSwipe(toIndex);
        })
      }
      //竖向
      if (self.configs.swipePosition == 'y') {
        swipeTarget.css({
          transform: 'translate3d(0,' + (next ? self.configs.height : -self.configs.height) + 'px,100px) scale(1,1) rotate(0deg)',
          '-webkit-transform': 'translate3d(0,' + (next ? self.configs.height : -self.configs.height) + 'px,10px) scale(1,1) rotate(0deg)',
          display: 'block',
          opacity: 0,
          zIndex: 10
        })
        swipeTarget.animate({
          transform: 'translate3d(0,0,0) scale(1,1) rotate(0deg)',
          '-webkit-transform': 'translate3d(0,0,0) scale(1,1) rotate(0deg)',
          opacity: 1
        }, self.configs.duration, self.configs.ease, function () {
          self.currentIndex = toIndex;
          swipeTarget.css('z-index', 1);
          self.configs.afterSwipe && self.configs.afterSwipe(toIndex);
        })
      }
    }
  }
  var swipeslide = function (configs) {
    return new H_S(configs);
  }
  return swipeslide;
})
