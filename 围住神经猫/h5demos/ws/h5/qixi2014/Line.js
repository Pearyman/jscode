/**
 * Created by plter on 8/1/14.
 */
(function () {
    function Line(gameView) {
        var _this = new createjs.Container();

        var rectWidth = gameView.width/GAME_CONFIG_H_NUM;
        var ql = new lib.QLMc();
        var ratio = rectWidth/ql.getBounds().width;
        ql.scaleX = ratio;
        ql.scaleY = ratio;
        var qlIndex = parseInt(Math.random()*GAME_CONFIG_H_NUM);
        ql.x = qlIndex * rectWidth;
        _this.addChild(ql);


        _this.checkToRemove = function () {
            if(_this.y>=gameView.height){
                if(_this.parent){
                    _this.parent.removeChild(_this);
                }
            }
        };

        _this.moveDown = function(){
            createjs.Tween.get(_this).to({"y":_this.y+rectWidth},100).call(_this.checkToRemove);
        };

        _this.getQlIndex = function () {
            return qlIndex;
        };

        return _this;
    }

    window.Line = Line;
}());