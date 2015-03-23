define(['base'],function (base) {

    /**
     * ------------------
     * list pannel for suggestion, select, etc.
     * ------------------
     */

    var HC = base;

    var _each = function (arr, fn) {
        var len = arr.length;
        for(var i = 0; i < len; i++){
            fn && fn(i, arr[i], arr);
        }
    };

    function selectPannel (opts) {
        this.opts = $.extend({
            classMain : '',
            classSelected : 'ymui_sp_selected',
            container : '',
            /*for usage : tabs existed already, must set "container" as well*/
            classItem : '',
            fnSelect : null,
            fnMouseout : null,
            fnMouseover : null
        }, opts || {});
        this.wrapper = null;
        this.liSign = 'select_pannel_kid';
        this.lis = [];
        this.liLen = 0;
        this.liCurNum = -1;

        this.init();
    }

    selectPannel.prototype = {

        init : function () {
            this.interface();
            this.handleEvent();
        },

        handleEvent : function () {
            var that = this,
                sign = '.' + this.liSign,
                number = 0;
            this.wrapper.on('mouseover', sign, function (e) {
                number = $(this).attr('data-number');
                that.select(parseInt(number));
                that.fnMouseover();
            })
            .on('mouseout', sign, function (e) {
                that.unselect();
                that.fnMouseout();
            })
            .on('click', sign, function (e) {
                number = $(this).attr('data-number');
                that.select(parseInt(number));
                that.handleEventSelected();
            });

            /*
             this.wrapper.bind('mousedown', function (e) {
             e.preventDefault();
             e.stopPropagation();
             return false;
             });
             */

            /*ie8 and older*/
            //this.wrapper.attr('disabled', 'disabled');
        },

        interface : function () {
            if(this.opts.classItem){
                this.wrapper = $(this.opts.container);
                this.liSign = this.opts.classItem;
                this.storeExist();
            }
            else{
                this.wrapper = $('<div></div>').appendTo(document.body)
                    .addClass(this.opts.classMain);
                this.opts.container && this.appendTo(this.opts.container);
            }
        },
        storeExist : function (){
            var lis = this.wrapper.find('.' + this.opts.classItem);
            this.lis = lis.get();
            this.liLen = this.lis.length;
            for(var i = 0; i < this.liLen; i++){
                $(lis[i]).attr('data-number', i);
            }
        },
        /**
         *
         * @param arrContent {array}
         */
        setContent : function (arrContent) {
            this.clear();
            if(!$.isArray(arrContent)){
                throw new Error('unexpected data form(array required) when trying to set selectPannel content');
            }
            var len = arrContent.length;
            for(var i = 0; i < len; i++){
                this.add(arrContent[i]);
            }
        },
        /**
         *
         * @param content {string | node}
         * @param [numPlace] {number} where to append
         */
        add : function (content, numPlace) {
            var sign = this.liSign.replace('.', ''),
                node = $('<div></div>').addClass(sign).append(content);
            if((numPlace || numPlace == 0) && numPlace < this.liLen){
                this.lis[numPlace].before(node);
                this.lis.splice(numPlace, 0, node);
            }
            else{
                this.wrapper.append(node);
                this.lis.push(node);
            }
            this.liLen++;
            this.resort();
        },
        resort : function () {
            for(var i = 0, len = this.lis.length; i < len; i++){
                this.lis[i].attr('data-number', i);
            }
        },
        /**
         * @param item {number | node}
         */
        remove : function (item) {
            var node, number;
            if(typeof item === 'number'){
                node = this.lis[item];
                number = item;
            }
            else{
                node = item;
                number = item.attr('data-number');
            }
            node.remove();
            this.lis.splice(number, 1);
            this.liLen--;
            this.resort();
        },
        appendTo : function (node) {
            this.wrapper.appendTo(node);
        },
        /**
         *
         * @param item {number | string}
         */
        select : function (item) {
            this.unselect();
            var num = 0,
                css = this.opts.classSelected;
            if(typeof item == 'number'){
                num = item;
            }
            else if(/next/.test(item)){
                num = this.liCurNum >= this.liLen-1 || this.liCurNum < 0 ? 0 : this.liCurNum+1;
            }
            else if(/preview/.test(item)){
                num = this.liCurNum <= 0 ? this.liLen-1 : this.liCurNum-1;
            }
            this.liCurNum = num;
            $(this.lis[num]).addClass(css);

            //this.handleEventSelected();

            //this.opts.fnSelect && this.opts.fnSelect(num, this.lis[num], this.liLen, this.lis);
        },

        unselect : function () {
            var css = this.opts.classSelected;
            _each(this.lis, function (index, node){
                $(node).removeClass(css);
            });
        },

        getSelected : function () {
            return {
                node : this.lis[this.liCurNum] || null,
                number : this.liCurNum
            };
        },

        setSelected : function (num) {
            var node = num >= 0 ? this.lis[num] : this.lis;
            this.liCurNum = num;
            this.opts.fnSelect && this.opts.fnSelect.call(this, num, node, this.liLen, this.lis);
        },

        handleEventSelected : function () {
            this.setSelected(this.liCurNum);
        },

        fnMouseover : function () {
            this.opts.fnMouseover && this.opts.fnMouseover.call(this, num, this.lis[num], this.liLen, this.lis);
        },
        fnMouseout : function (){
            this.opts.fnMouseout && this.opts.fnMouseout.call(this, num, this.lis[num], this.liLen, this.lis);
        },

        length : function () {
            return this.liLen;
        },

        clear : function () {
            this.wrapper.empty();
            this.lis = [];
            this.liLen = 0;
            this.liCurNum = -1;
        },

        show : function () {
            this.wrapper.show().css({
                zIndex : ++HC.ZINDEX
            });
        },

        hide : function () {
            this.wrapper.hide();
        },

        die : function () {
            this.wrapper.off();
            this.wrapper.remove();
        }
    };

    return function (config) {
        return new selectPannel(config);
    };
});