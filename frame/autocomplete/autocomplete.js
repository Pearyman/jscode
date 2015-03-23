define(['selectpanel','base'],function (selectpanel,base) {


    var HC = base;

    var keyCode = {
        up : 38,
        down : 40,
        enter :13
    };

    function autoComplete (opts) {

        this.opts = $.extend({
            input : '',
            wrapper : '',
            position :'',
            classMain : 'autocomplete',
            width : 0,
            delay : 200,
            /*fnRequest : function (value, node)*/
            fnRequest : null,
            /*fnSelect : function (index, node, len, nodes)*/
            fnSelect : null,
            fnFocus : null
        }, opts || {});

        this.wrapper = null;

        this.listContainer = null;

        this.emptyContainer = null;

        this.input = $(this.opts.input);

        this.inputTimeout = null;

        this.selectPannel = selectpanel({
            classMain : '',
            fnSelect : HC.util.bind(this.handleEventSelected, this)
        });

        this.init();
    }

    autoComplete.prototype = {

        init : function () {
            this.interface();
            this.handleEvent();
            this.selectPannel.appendTo(this.listContainer);
            this.position();
            this.hide();
        },
        handleEvent : function () {
            var that = this,
                selectPanel = this.selectPannel;
            this.input.bind('keyup', function (e) {
                mCurNum = selectPanel.getSelected().number;
                switch (e.keyCode){
                    case keyCode.up:
                        selectPanel.select('preview');
                        break;
                    case keyCode.down:
                        selectPanel.select('next');
                        break;
                    case keyCode.enter:
                        selectPanel.handleEventSelected();
                        mCurNum = -1;
                        break;
                    default :
                        that.getContent();
                        break;
                }
            })
                .bind('keydown', function(e){
                    //使用第三方输入法时
                    if(e.keyCode == 229){
                        setTimeout(function(){
                            that.getContent();
                        }, 20);
                    }
                })
            .focus(function () {
                //that.show();
                that.opts.fnFocus && that.opts.fnFocus.call(that);

            })
            /*
            .blur(function () {
                that.hide();
            })
            */
            .bind('click', function (e) {
                e.stopPropagation();
            });
            this.listContainer.bind('mousedown', function (e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            });
            if(!this.opts.wrapper){
                $(document).bind('click.wid-doc-autocomplete', function(e){
                    var tg = e.target;
                    if(tg === that.input.get(0)){
                        return;
                    }
                    that.hide();
                });
                $(window).bind('resize', function () {
                    that.hide();
                });
            }
        },
        interface : function () {
            this.wrapper = $('<div></div>').appendTo(this.opts.wrapper || document.body)
                .addClass(this.opts.classMain || '')
                .html('<div class="ac_empty"></div><div class="ac_list"></div>');
            this.listContainer = this.wrapper.find('.ac_list');
            this.emptyContainer = this.wrapper.find('.ac_empty');
        },
        getContent : function () {
            var input = this.input,
                value = $.trim(input.val()),
                preVal = input.attr('data-preval'),
                that = this;
            if(!value){
                //this.hide();
                //return;
            }
            if(value == preVal){
                //return;
            }
            input.attr('data-preval', value);
            clearTimeout(this.inputTimeout);
            this.inputTimeout = setTimeout(function () {
                that.opts.fnRequest.call(that, value, input);
            }, this.opts.delay || 16);
            input.focus();
        },
        getSelected : function () {
            return this.selectPannel.getSelected();
        },
        setSelected : function (num) {
            this.selectPannel.setSelected(num);
        },
        /**
         * for recover if necessary
         */
        handleEventSelected : function (numIndex, $node, numLen, $allNode) {
            if(!$node) return;
            if(this.opts.fnSelect){
                this.opts.fnSelect.apply(this, arguments);
            }
            else{
                /*default logic*/
                var val = $node.text();
                this.input.val(val);
                this.selectPannel.unselect();
                this.hide();
            }
        },
        /**
         *
         * @param arrContent {array}
         */
        setContent : function (arrContent){
            this.selectPannel.setContent(arrContent);
            this.emptyContainer.hide();
            if(arrContent && arrContent.length){
                this.listContainer.show();
            }
            else{
                this.listContainer.hide();
            }
        },

        /**
         *
         * @param content {string | node}
         */
        setEmpty : function (content) {
            this.emptyContainer.empty().append(content).show();
            this.show();
            this.listContainer.hide();
        },
        position : function () {
            if(!this.opts.wrapper){
                this.posFollow();
            }
        },
        posFollow : function () {
            var input = this.input;
            var offset = $(input).offset(),
                width  = $(input).outerWidth(),
                height = $(input).outerHeight();
            $(this.wrapper).css({
                position : 'absolute',
                zIndex : 1000,
                left : offset.left,
                top : offset.top + height,
                width : this.opts.width || width
            });
        },
        show : function () {
            this.position();
            this.selectPannel.show();
            this.wrapper.show().css({
                zIndex : ++HC.ZINDEX
            });
        },
        hide : function () {
            this.selectPannel.hide();
            this.wrapper.hide();
        },
        die : function () {
            this.selectPannel.die();
            this.wrapper.remove();
            this.input.off();
        }
    };

    return function (opts) {
        return new autoComplete(opts);
    };

});