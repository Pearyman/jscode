
define([],function () {

    /**
     * animate none 0
     * based in jQuery 
     */
    function animNone (config) {
        config.nodeCur && $(config.nodeCur).hide();
        $(config.nodeNext).show();
        config.fnDone && config.fnDone(config);
    }

    /**
     * animate vertical 1 9
     */
    function animV (config) {
        /**
         * 1 : top to bottom
         * 2 : bottom to top
         */
        var direct = config.direction || 1,
            nodeCur, nodeNext;
        if(config.nodeCur){
            nodeCur = $(config.nodeCur);
            nodeCur.show().css({
                position : 'absolute',
                top : 0,
                left : 0,
                zIndex : 5
            });
            if(direct == 1){
                nodeCur.animate({ top : config.height/2 }, { queue : false });
            }
            else{
                nodeCur.animate({ top : -config.height/2 }, { queue : false });
            }
        }
        nodeNext = $(config.nodeNext);
        nodeNext.show().css({
            position : 'absolute',
            left : 0,
            zIndex : 6
        });
        if(direct == 1){
            nodeNext.css({ top : - config.height });
        }
        else{
            nodeNext.css({ top : config.height });
        }
        nodeNext.animate({ top : 0 }, {
            queue : false,
            done : function () {
                nodeCur && nodeCur.hide();
                nodeNext.show();
                config.fnDone && config.fnDone(config);
            }
        });
    }

    /**
     * animate horizontal 2 8
     */
    function animH (config) {
        /**
         * 1 : left to right
         * 2 : right to left
         */
        var direct = config.direction || 1,
            nodeCur, nodeNext;
        if(config.nodeCur){
            nodeCur = $(config.nodeCur);
            nodeCur.show().css({
                position : 'absolute',
                top : 0,
                left : 0,
                zIndex : 5
            });
            if(direct == 1){
                nodeCur.animate({ left : config.width/2 }, { queue : false });
            }
            else{
                nodeCur.animate({ left : -config.width/2 }, { queue : false });
            }
        }
        nodeNext = $(config.nodeNext);
        nodeNext.show().css({
            position : 'absolute',
            top : 0,
            zIndex : 6
        });
        if(direct == 1){
            nodeNext.css({ left : - config.width });
        }
        else{
            nodeNext.css({ left : config.width });
        }
        nodeNext.animate({ left : 0 }, {
            queue : false,
            done : function () {
                nodeCur && nodeCur.hide();
                nodeNext.show();
                config.fnDone && config.fnDone(config);
            }
        });
    }

    /**
     * animate opacity 3
     */
    function animOpacity (config) {
        var nodeCur = config.nodeCur ? $(config.nodeCur) : '',
            nodeNext = $(config.nodeNext);
        nodeCur && nodeCur.show().css({
            position : 'absolute',
            left : 0,
            top : 0
        }).animate({ opacity : 0 }, { queue : false });
        nodeNext.show().css({
            position : 'absolute',
            left : 0,
            top : 0,
            opacity : 0
        }).animate({ opacity : 1 }, {
                queue : false,
                done : function () {
                    nodeCur && nodeCur.hide();
                    nodeNext.show();
                    config.fnDone && config.fnDone(config);
                }
            });
    }

    /**
     * animate blind 4
     * only for image
     */
    function animBlind (config) {
        var curImg = $(config.nodeCur).find('img').eq(0);
        if(!curImg.length){
            animNone(config);
            return;
        }
        var p = 20,
            ew = config.width/ p,
            covers = [];
        for(var i = 0; i < p; i++){
            covers[i] = $('<div></div>').css({
                position : 'absolute',
                left : i*ew,
                top : 0,
                width : ew,
                height : config.height,
                backgroundImage : 'url('+ curImg.attr('src') +')',
                backgroundPosition : -i*ew + 'px 0',
                zIndex : 10
            }).appendTo(config.boxWrapper);
            (function (i) {
                setTimeout(function () {
                    covers[i].animate({
                        opacity : 0
                    }, function () {
                        this.remove();
                    });
                }, i*50);
            })(i);
        }
        config.nodeCur && $(config.nodeCur).hide();
        $(config.nodeNext).show().css({
            position : 'absolute',
            left : 0,
            top : 0,
            zIndex : 9
        });
        config.fnDone && config.fnDone(config);
    }
    /**
     * animate door 5
     * only for image
     */
    function animDoor (config) {
        var curImg = $(config.nodeCur).find('img').eq(0);
        if(!curImg.length){
            animNone(config);
            return;
        }
        var ew = config.width/ 2;
        for(var i = 0; i < 2; i++){
            $('<div></div>').css({
                position : 'absolute',
                left : i*ew,
                top : 0,
                width : ew,
                height : config.height,
                backgroundImage : 'url('+ curImg.attr('src') +')',
                backgroundPosition : -i*ew + 'px 0',
                zIndex : 10
            }).appendTo(config.boxWrapper)
                .animate({
                    left : (i == 0?-ew:config.width)
                }, 1000, function () {
                    this.remove();
                });
        }
        config.nodeCur && $(config.nodeCur).hide();
        $(config.nodeNext).show().css({
            position : 'absolute',
            left : 0,
            top : 0,
            zIndex : 9
        });
        config.fnDone && config.fnDone(config);
    }

    /**
     * animate page 6
     */
    function animPage (config) {
        config.nodeCur && $(config.nodeCur).show().css({
            position : 'absolute',
            left : 0, top : 0,
            zIndex : 5
        })
            .animate({ left : config.width/2 }, function () {
                $(this).css('zIndex', 4).animate({ left : 0 }, function () {
                    $(this).hide();
                })
            });
        $(config.nodeNext).show().css({
            position : 'absolute',
            left : 0,
            top : 0,
            zIndex : 4
        })
            .animate({ left : -config.width/2 }, function () {
                $(this).css('zIndex', 5).animate({ left : 0 });
            });
        config.fnDone && config.fnDone(config);
    }
    /**
     * animate fence 7
     * only for image
     */
    function animFence (config) {
        var curImg = $(config.nodeCur).find('img').eq(0);
        if(!curImg.length){
            animNone(config);
            return;
        }
        var p = 20,
            ew = config.width/ p,
            covers = [];
        for(var i = 0; i < p; i++){
            covers[i] = $('<div></div>').css({
                position : 'absolute',
                left : i*ew,
                top : 0,
                width : ew,
                height : config.height,
                backgroundImage : 'url('+ curImg.attr('src') +')',
                backgroundPosition : -i*ew + 'px 0',
                zIndex : 10
            }).appendTo(config.boxWrapper);
            (function (i) {
                setTimeout(function () {
                    covers[i].animate({
                        top : i%2 ? -config.height : config.height,
                        opacity :.3
                    }, function () {
                        this.remove();
                    });
                }, i*50);
            })(i);
        }

        config.nodeCur && $(config.nodeCur).hide();
        $(config.nodeNext).show().css({
            position : 'absolute',
            left : 0,
            top : 0,
            zIndex : 9
        });
        config.fnDone && config.fnDone(config);
    }
    var Anim = {};
    Anim.anim = function (config) {
        config = $.extend({
            animate : 0,
            nodeCur : null,
            nodeNext : null,
            width : '',
            height : '',
            boxWrapper : null,
            fnDone : null
        }, config);

        config.boxWrapper = config.boxWrapper || $(config.nodeNext).parent();

        $(config.boxWrapper).css({
            position: 'relative',
            overflow: 'hidden'
        });

        switch (config.animate){
            case 1 :
                animV($.extend(config,{
                    direction : 1
                }));
                break;
            case 2 :
                animH($.extend(config,{
                    direction : 1
                }));
                break;
            case 3 :
                animOpacity(config);
                break;
            case 4 :
                animBlind(config);
                break;
            case 5 :
                animDoor(config);
                break;
            case 6 :
                animPage(config);
                break;
            case 7 :
                animFence(config);
                break;
            case 8 :
                animH($.extend(config,{
                    direction : 2
                }));
                break;
            case 9 :
                animV($.extend(config,{
                    direction : 2
                }));
                break;
            default :
                animNone(config);
                break;
        }
    }
    return Anim;
});