

define(['animlogic'],function (anim_logic) {

    var animLogic = animlogic;

    function lazyLoad (node, mode) {
        if($(node).attr('data-loaded')){
            return;
        }
        if(mode == 'img') {
            var img = $(node).find('img[_src]');
            img.each(function () {
                $(this).attr('src', $(this).attr('_src')).removeAttr('_src');
            });
        }
        else if(mode == 'box'){
            var content = $(node).find('textarea').val();
            $(node).empty().html(content);
        }
        else if($.isFunction(mode)){ /* ajax */
            mode(node);
        }
        $(node).attr('data-loaded', '1');
    }

    /**
     * main
     */
    function slideShow (config) {
        config = $.extend({
            tagWrapper : '',
            tagSign : '',
            boxWrapper : '',
            boxSign : '',
            tagSelected : '',
            play : 0,/*default show*/
            animate : 0,
            autoPlay : 0,/*seconds自动播放*/
            event : 'click',
            lazyLoad : null, /* img | box | function */
            fnSelect : null,
            fnPlay : null
        }, config || {});

        $(config.boxWrapper).css('position', 'relative').find(config.boxSign).hide();

        var styleTagSelected = config.tagSelected || 'ymui_ss_tag_on',
            styleBoxShow = 'ymui_ss_box_on',
            curSeletedNum = null,
            curShowBox = null,
            autoPlayDelay = null,
            width = config.width || $(config.boxWrapper).width(),
            height = config.height || $(config.boxWrapper).height(),
            tags = config.tagWrapper ? $(config.tagWrapper).find(config.tagSign) : '',
            boxes = $(config.boxWrapper).find(config.boxSign);

        var animateEffect = config.animate;

        tags && tags.each(function (index) {
            $(this).attr('data-ss-num', index);
        });

        function autoPlay(){
            if(!config.autoPlay){
                return;
            }
            clearTimeout(autoPlayDelay);
            autoPlayDelay = setTimeout(function () {
                playNext();
                autoPlay();
            }, config.autoPlay*1000);
        }

        function playNext (config) {
            config = $.extend({
                animate : ''
            }, config || {});
            config.animate && (animateEffect = config.animate);
            var len = boxes.length,
                next = curSeletedNum >= len - 1 ? 0 : curSeletedNum + 1;
            playGo(next);
        }

        function playPreview (config) {
            config = $.extend({
                animate : ''
            }, config || {});
            config.animate && (animateEffect = config.animate);
            var len = boxes.length,
                preview = curSeletedNum <= 0 ? len - 1 : curSeletedNum - 1;
            playGo(preview);
        }

        function selectTag(index) {
            if(!tags || !tags.length) return;
            tags.removeClass(styleTagSelected);
            tags.eq(index).addClass(styleTagSelected);
        }

        function playGo (node) {
            var len = boxes.length,
                curIndex = 0;
            if(typeof node == 'number'){
                curIndex = node;
            }
            else{
                boxes.each(function (index) {
                    if(node === this){
                        curIndex = index;
                    }
                });
            }
            config.fnSelect && config.fnSelect(curIndex, len, tags, boxes);
            if(curSeletedNum === curIndex){
                return;
            }
            curSeletedNum = curIndex;
            showBox(curIndex);
            selectTag(curIndex);
            autoPlay();
            config.fnPlay && config.fnPlay(curIndex, len, tags, boxes);
        }

        function showBox (index) {
            var nodeCur = curShowBox,
                nodeNext = boxes.eq(index);
            nodeCur && nodeCur.removeClass(styleBoxShow);
            nodeNext.addClass(styleBoxShow);
            if($.isFunction(animateEffect)){
                animateEffect({
                    nodeCur : nodeCur,
                    nodeNext : nodeNext,
                    width : width,
                    height : height,
                    boxWrapper : config.boxWrapper
                });
            }
            else{
                animLogic.anim({
                    animate : animateEffect,
                    nodeCur : nodeCur,
                    nodeNext : nodeNext,
                    width : width,
                    height : height,
                    boxWrapper : config.boxWrapper
                });
            }
            config.lazyLoad && lazyLoad(nodeNext, config.lazyLoad);

            curShowBox = nodeNext;

        }

        playGo(config.play);
        autoPlay();

        $(config.tagWrapper).on(config.event, config.tagSign, function (e) {
            e.preventDefault();
            playGo( parseInt($(this).attr('data-ss-num')) );
        });

        return {
            next : playNext,
            preview : playPreview,
            play : playGo
        }
    }

    return function (config) {
        return slideShow(config);
    };

});