/*
 * @ ui floatfix  :  pin an element to a position in page
 *   @ param{node} the element which is be pinned
 *   @ param{container} the element's relative element
 *   @ param{margin}  [top,bottom]
 * */
define(function () {
    var PIN = function () {
        this.init.apply(this, arguments);
    };
    PIN.prototype = {
        /**
         * @method init
         * @static
         * @param configs {object}  ↑↑
         * @return none
         */
        init: function (configs) {
            var self = this,
                bodyContainer = $('body'),
                configs = configs || {};
            self.configs = {
                container: configs.container || bodyContainer,
                target: configs.target || "",
                targetHeight : configs.targetHeight || '',
                margin: configs.margin || [0, 0],
                onScroll: configs.onScroll || null,
                onTopStop: configs.onTopStop || null,
                onBottomStop : configs.onBottomStop || null
            };
            if ($(self.configs.target).length > 0) {
              $(self.configs.container).css('position', 'relative');
              self.windowDefaultWidth = $(window).width();
              self.countData();
              self.bindScroll();
              self.bindResize();
            }
        },
        /**
         * @method countData  count some numbers ...
         * @static
         * @return none
         */
        countData: function () {
            var self = this,
                margin = self.configs.margin,
                nodeoffset = $(self.configs.target).offset(),
                nodeHeight = self.configs.targetHeight || $(self.configs.target).outerHeight(),
                containerHeight = $(self.configs.container).innerHeight(),
                containerPaddingTop = parseInt($(self.configs.container).css('paddingTop')),
                containerOffset = $(self.configs.container).offset();
            self.data = {
                margin: margin,
                nodeHeight: nodeHeight,
                nodeoffset: nodeoffset,
                containerHeight: containerHeight,
                containerOffset: containerOffset,
                //from 最小为0  兼容360  360会计算为负值
                from: containerOffset.top + containerPaddingTop - margin[0] < 0 ? 0 : containerOffset.top + containerPaddingTop - margin[0],
                to: containerOffset.top + containerHeight - nodeHeight - margin[0],
                end: containerOffset.top + containerHeight
            };
        },
        /**
         * @method bindScroll  bind scroll event
         * @static
         * @return none
         */
        bindScroll: function () {
            var self = this,
                margin = $(self.configs.target).css('margin'),
                win = $(window);
            self.onscroll = function () {
                var containerHeight = $(self.configs.container).innerHeight();
                //如果父节点 高度变化 重新计算
                if(containerHeight != self.data.containerHeight){
                  self.countData();
                }
                var scrollY = win.scrollTop();
                if (self.data.from < scrollY && self.data.to > scrollY) {
                    if (self.configs.onScroll) {
                        self.configs.onScroll.apply(self, arguments);
                    }
                    $(self.configs.target).css({
                        left: self.data.nodeoffset.left + self.data.margin[1],
                        top: self.data.margin[0],
                        margin: 0,
                        position: 'fixed'
                    })
                }
                else if (scrollY >= self.data.to) {
                    if (self.configs.onBottomStop) {
                        self.configs.onBottomStop.apply(self, arguments);
                    }
                    $(self.configs.target).css({
                        left: '',
                        top: self.data.to - self.data.nodeoffset.top,
                        margin:margin,
                        position: 'absolute'
                    })
                }
                else {
                    if (self.configs.onTopStop) {
                        self.configs.onTopStop.apply(self, arguments);
                    }
                    $(self.configs.target).css({
                        left: '',
                        top: '',
                        margin:margin,
                        position: 'static'
                    })
                }
            }
            self.onscroll();//初始化执行一次 进行判断
            win.off('scroll', self.onscroll).on('scroll', self.onscroll);
        },
        bindResize : function(){
          var self = this;
          var win = $(window);
          win.on('resize',function(){
            var containerOffset = $(self.configs.container).offset();
            var diffNum = 0;
            if(containerOffset.left != self.data.containerOffset.left){
              diffNum = self.data.containerOffset.left - containerOffset.left;
            }
            if(diffNum == 0){
              return false;
            }
            else{
              self.data.containerOffset.left = self.data.containerOffset.left - diffNum;
              self.data.nodeoffset.left = self.data.nodeoffset.left - diffNum;
              if($(self.configs.target).css('position') == 'fixed') {
                $(self.configs.target).css('left', self.data.nodeoffset.left + self.data.margin[1]);
              }
            }
          })
        }
    };
    var floatfix = function (configs) {
        return new PIN(configs);
    };
    return floatfix;
})