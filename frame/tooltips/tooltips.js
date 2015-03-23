define(['base'], function (BASE) {
    var TIPS = function () {
        this.init.apply(this, arguments);
    };
    TIPS.prototype = {
        init: function (configs) {
            var self = this, configs = configs || {};
            self.configs = {
                target: configs.target || '.j_show_tips',
                content: configs.content || '',
                position: configs.position || 'top', // top bottom  left right
                bgColorCls: configs.bgColorCls || 'yellow',
                margin : configs.margin || [0,0],
                delay: configs.delay || 200,
                speed: configs.speed || 200,
                pause: configs.pause || 3000,
                autoHide: configs.autoHide || null,
                onShow: configs.onShow || null,
                onHide: configs.onHide || null
            };
            if ($(self.configs.target).length > 0) {
                self.bindMouseEvent();
            }
        },
        bindMouseEvent: function () {
            var self = this;
            $(self.configs.target).each(function () {
                self.currentNode = $(this);
                var closebtn = '';
                var content = self.configs.content || self.currentNode.attr('data-title');
                var arrowPosition = '';
                if (self.configs.position == 'top') {
                    arrowPosition = 'bottom';
                }
                else if (self.configs.position == 'bottom') {
                    arrowPosition = 'top';
                }
                else if (self.configs.position == 'left') {
                    arrowPosition = 'right';
                }
                else if (self.configs.position == 'right') {
                    arrowPosition = 'left';
                }
                if (!self.configs.autoHide) {
                    closebtn = '<a class="h-tooltips-close" alt="close">X</a>';
                }
                self.toolTipContainer = $('<div class="h-tooltips-container"><div class="h-tooltips-body ' + self.configs.bgColorCls + '">' + closebtn + content + '</div><div class="h-tooltips-icon h-tooltips-icon-' + arrowPosition + ' ' + self.configs.bgColorCls + '"></div></div>');
                $('body').append(self.toolTipContainer);
                self.toolTipContainer.css({
                    display: 'none',
                    opacity: 0,
                    position: 'absolute',
                    zIndex: ++BASE.ZINDEX
                })
                var toolTip = self.toolTipContainer;
                var toolTipBody = $('.h-tooltips-body', self.toolTipContainer);
                var toolTipIcon = $('.h-tooltips-icon', self.toolTipContainer);
                var timeout = null;
                self.currentNode.on('mouseenter', function () {
                    var offset = $(this).offset();
                    var left = offset.left;
                    var top = offset.top;
                    if (self.configs.position == 'top') {
                        top -= toolTip.height();
                        var iconTop = toolTip.height();
                        toolTipIcon.css('top', iconTop - toolTipIcon.outerHeight());
                    }
                    else if (self.configs.position == 'bottom') {
                        top += $(this).height() + toolTipIcon.outerHeight();
                        var iconTop = toolTip.position().top;
                        toolTipIcon.css('top', -toolTipIcon.outerHeight());
                    }
                    else if (self.configs.position == 'left') {
                        left -= toolTip.outerWidth();
                        var iconLeft = toolTipBody.position().left + toolTipBody.outerWidth();
                        toolTipIcon.css('left', iconLeft);
                    }
                    else if (self.configs.position == 'right') {
                        left += $(this).outerWidth();
                        toolTipBody.css('left', toolTipIcon.outerWidth());
                        toolTipIcon.css('left', 0);
                    }
                    toolTip.css({left: left + self.configs.margin[0], top: top + self.configs.margin[1]});
                    timeout = setTimeout(function () {
                        self.showToolTip(toolTip);
                    }, self.configs.delay);
                })
                self.currentNode.on('mouseleave', function () {
                    if (!self.configs.autoHide) {
                        clearTimeout(self.autoHideTimeOut);
                    }
                    timeout = setTimeout(function () {
                        self.hideToolTip(toolTip);
                    }, self.configs.delay);
                })
                self.toolTipContainer.on('mouseenter', function () {
                    clearTimeout(timeout);
                    if (self.configs.autoHide) {
                        clearTimeout(self.autoHideTimeOut);
                    }
                })
                self.toolTipContainer.on('mouseleave', function () {
                    timeout = setTimeout(function () {
                        self.hideToolTip(toolTip);
                    }, self.configs.delay);
                })
                $('.h-tooltips-close', toolTip).click(function () {
                    self.hideToolTip(toolTip);
                });
            })
        },
        showToolTip: function (toolTip) {
            var self = this;
            toolTip.css({display: 'block'}).stop(false, true).animate({opacity: 1}, self.configs.speed, function () {
                self.configs.onShow && self.configs.onShow.apply(self, arguments);
                if (self.configs.autoHide) {
                    self.autoHideTimeOut = setTimeout(function () {
                        self.hideToolTip(toolTip);
                    }, self.configs.pause);
                }
            });
        },
        hideToolTip: function (toolTip) {
            var self = this;
            toolTip.css({display: 'none'}).stop(false, true).animate({opacity: 0}, self.configs.speed, function () {
                $(this).css('display', 'none');
                self.configs.onHide && self.configs.onHide.apply(self, arguments);
            });
        }
    };
    var tooltips = function (configs) {
        return new TIPS(configs);
    }
    return tooltips;
})