/**
 * Created by plter on 8/1/14.
 */

(function () {
    function GameScene(gameView) {
        var _this = new createjs.Container();
        var linesContainer = new createjs.Container();
        window.GAME_CONFIG_H_NUM = 4;
        var cardWidth = gameView.width/GAME_CONFIG_H_NUM;
        var timerCount = 50;
        var timerLabel = new createjs.Text(timerCount+"秒","bold 30px Arial","#ff0000");
        var sendCount = 0;
        var bg = new createjs.Shape();
        var gameRoleLabel=new createjs.Text("游戏规则：\n1.从下往上点击情侣开始送花\n2.不能点击空白处","bold 20px Arial","#ff00ff");

        function addTimerLabel() {
            _this.addChild(timerLabel);

            timerLabel.x = (gameView.width- timerLabel.getMeasuredWidth())/2;
            timerLabel.y = 50;
        }

        function addLines() {
            for(var i=2;i<=10;i++){
                addLine(i);
            }
        }

        function addLine(index) {
            var line = Line(gameView);
            line.y = gameView.height - cardWidth * index;
            linesContainer.addChild(line);
        }

        function _this_clickHandler(e) {
            if(Math.floor((gameView.height- e.stageY)/cardWidth)==1){
                for(var i =0;i<linesContainer.children.length;i++){
                    var child = linesContainer.getChildAt(i);

                    if(Math.round(gameView.height- child.y)==Math.round(cardWidth*2)){
                        var clickedIndex = Math.floor(e.stageX/cardWidth);
                        if(clickedIndex==child.getQlIndex()){
                            var rose = new lib.Rose();
                            rose.x = (clickedIndex+1) * cardWidth - rose.getBounds().width;
                            child.addChild(rose);

                            addLine(11);
                            for(var j=0;j<linesContainer.children.length;j++){
                                linesContainer.getChildAt(j).moveDown();
                            }

                            sendCount++;
                        }else{
                            gameOver();
                        }
                        break;
                    }
                }
            }
        }

        function intervalHandler() {
            timerCount--;
            timerLabel.text = timerCount+"秒";

            if(timerCount<=0){
                gameOver()
            }
        }

        function gameOver() {
            clearInterval(timerId);
            linesContainer.removeAllChildren();

            _this.removeEventListener("click", _this_clickHandler);
            replaceScene(GameOverScene(gameView,sendCount));
        }

        function addBg() {
            bg.graphics.beginFill("#eeeeee").drawRect(0,0,gameView.width,gameView.height).endFill();
            _this.addChild(bg);
            _this.addEventListener("click", _this_clickHandler);
        }

        addBg();

        _this.addChild(linesContainer);
        addLines();
        _this.addChild(gameRoleLabel);
        addTimerLabel();

        //startGame
        var timerId = setInterval(intervalHandler,1000);

        return _this;
    }

    window.GameScene = GameScene;
}());