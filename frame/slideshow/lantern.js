/**
 *
 * User : Kevin
 * Date : 1/16/14
 * Time : 4:52 PM
 * Desc : 走马灯
 *
 */
define([],function () {

    function lantern (config) {

        config = $.extend({
            mover : '',
            items : '',
            width : 0,
            height : 0,
            direction : 'horizon',
            screenCount : 0,
            switchCount : 1,
            line : 1,
            loop : 1,
            auto : 0,
            defaultItemNumber : 0,
            fnPlay : null
        }, config || {});

        var items = $(config.items),
            itemCount = items.length <= config.screenCount * config.line
                ? config.screenCount
                : Math.ceil(items.length/config.line);
        if(!itemCount) return;

        var mover = $(config.mover).css('width', itemCount*config.width + 100),
            position = (mover.css('position') || '').toLowerCase();
        if(position != 'relative' && position != 'absolute'){
            mover.css('position', 'absolute');
        }

        var _curIndex = config.defaultItemNumber || 0;

        var _locked = 0, autoInterval;

        function goto (endIndex) {
            if(_locked) return;
            mover.animate({
                left : -endIndex * config.width
            }, function () {
                _locked = 0;
            });
            _locked = 1;
            _curIndex = endIndex;
            autoPlay();
            config.fnPlay && config.fnPlay(endIndex, itemCount, config);
        }

        function next () {
            var end = Math.min(itemCount - config.screenCount, _curIndex + config.switchCount);
            if(config.loop && _curIndex + config.screenCount >= itemCount){
                end = 0;
            }
            goto(end);
        }

        function prev () {
            var end = Math.max(0, _curIndex - config.switchCount);
            if(config.loop && _curIndex == 0){
                end = itemCount - config.screenCount;
            }
            goto(end);
        }

        function autoPlay () {
            if(config.auto){
                clearInterval(autoInterval);
                autoInterval = setInterval(next, (config.auto || 5) * 1000);
            }
        }

        goto(0);

        return {
            next : next,
            prev : prev
        }

    }

    return lantern;

});