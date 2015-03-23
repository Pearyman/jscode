/**
 * @ ui button
 * button's enable and disable
 * set/get button's value
 * version 1.0.0
 */

define(function () {
    var BTN = function () {
        this.init.apply(this, arguments);
    };
    BTN.prototype = {
        /**
         * @method init
         * @static
         * @param configs
         * @return none
         */
        init: function (configs) {
            var self = this;
            var configs = configs || {};
            self.configs = {
                container : configs.container || '',  //父节点   object
                target: configs.target || "",         //要绑定事件的目标   ',class,a,input,button' 支持多个
	              eventType : configs.eventType || 'click',    //事件类型
                eventHandle: configs.eventHandle || null,    //事件
                disabledClass: configs.disabledClass ? configs.disabledClass : 'hc-ui-btn-disable' //禁止点击样式
            }
            if(self.configs.target.container == 0 && self.configs.target.length == 0){return;}
            self.handleEvent();
        },
        /**
         * @method enable   enable BTN and removeClass
         * @static
         *
         */
        enable: function () {
            var self = this,
              node = self.currentTarget;
            node.removeClass(self.configs.disabledClass);
        },
        /**
         * @method disable   disable BTN and addClass
         * @static
         *
         */
        disable: function () {
            var self = this,
              node = self.currentTarget;
            if(!node || node.length == 0){return;}
            node.addClass(self.configs.disabledClass);
        },
        /**
         * @method focus   focus BTN
         * @static
         *
         */
        focus: function () {
            var self = this,
              node = self.currentTarget;
            if(!node || node.length == 0){return;}
            node.focus();
        },
        /**
         * @method blur   blur BTN
         * @static
         *
         */
        blur: function () {
            var self = this,
              node = self.currentTarget;
            if(!node || node.length == 0){return;}
            node.blur();
        },
        /**
         * @method setContent   set BTN value or html
         * @static
         * @param content{string}
         */
        setContent: function (content) {
            var self = this;
            var node = self.currentTarget;
            if (node.get(0).nodeName.toLowerCase() == 'input') {
                node.val(content);
            }
            else {
                node.html(content);
            }
        },
        /**
         * @method getContent   get BTN value or html
         * @static
         * @return {string}
         */
        getContent: function () {
            var self = this;
            var node = self.currentTarget;
            return node.val() || node.html();
        },
        /**
         * @method handleEvent   bind click ti BTN node
         * @static
         */
        handleEvent: function () {
            var self = this;
            if(self.configs.container.length > 0){
                self.configs.container.on(self.configs.eventType,self.configs.target,function(e){
                    e.preventDefault();
                    if ($(this).hasClass(self.configs.disabledClass)) {
                        return;
                    }
                    self.currentTarget = $(this);
                    self.blur();
                    self.configs.eventHandle && self.configs.eventHandle(self, self.currentTarget);
                })
            }
            else {
                $(self.configs.target).on(self.configs.eventType, function (e) {
                    e.preventDefault();
                    if ($(this).hasClass(self.configs.disabledClass)) {
                        return;
                    }
                    self.currentTarget = $(this);
                    self.blur();
                    self.configs.eventHandle && self.configs.eventHandle(self, self.currentTarget);
                })
            }
        },
        /**
         * @method unbind   destory event
         * @static
         */
        unbind: function () {
            var self = this;
            if(self.configs.container.length > 0){
                self.configs.container.off(self.configs.eventType,self.configs.target)
            }
            else {
                $(self.configs.target).off(self.configs.eventType);
            }
        }
    };
    var button = function(configs){
        return new BTN(configs);
    }
    return button;
})
