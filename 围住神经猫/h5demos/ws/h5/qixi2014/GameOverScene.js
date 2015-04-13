/**
 * Created by plter on 8/1/14.
 */

(function () {
    function GameOverScene(gameView,sendCount) {
        var _this = new createjs.Container();

        var flowersContainer = new createjs.Container();
        _this.addChild(flowersContainer);

        var contentLabel = new createjs.Text("","bold 20px Arial","#ff00ff");

        function centerObject(target) {
            var targetRect = target.getBounds();
            target.x = (gameView.width-targetRect.width)/2;
            target.y = (gameView.height-targetRect.height)/2;
        }

        function addFlowers() {
            var f;
            for(var i=0;i<9;i++){
                f = new lib.Rose();
                f.x = Math.random()*(gameView.width-100)+50;
                f.y = Math.random()*(gameView.height-100)+50;
                f.rotation = Math.random()*360;
                flowersContainer.addChild(f);
            }
        }

        function restartGameBtn_clickHandler(e) {
            startGameBtn.removeEventListener("click",restartGameBtn_clickHandler);
            replaceScene(GameScene(gameView,_this.getStage()));
        }

        function addReStartGameBtn() {
            startGameBtn = new lib.RestartGameBtn();
            centerObject(startGameBtn);
            _this.addChild(startGameBtn);
            startGameBtn.addEventListener("click",restartGameBtn_clickHandler);
        }

        function addContentLabel() {
            _this.addChild(contentLabel);

            if(sendCount<30){
                contentLabel.text = "才送出"+sendCount+"个祝福，难怪现在你还单身";
            }else if(sendCount<50){
                contentLabel.text = "送出"+sendCount+"个祝福，一般一般吧，隔壁姐们随便动动手都比你送得多";
            }else if(sendCount<70){
                contentLabel.text = "送出"+sendCount+"个祝福，很不错哦，再接再厉哇";
            }else{
                contentLabel.text = "送出"+sendCount+"个祝福，你太厉害了，一定是情圣";
            }

            contentLabel.text = contentLabel.text.cutStr(10).join("\n");
            contentLabel.y=20;
            contentLabel.x = (gameView.width-contentLabel.getBounds().width)/2;
        }

        function addGameAboutTxt() {
            var aboutTxt = new createjs.Text("游戏作者：极客学院 ime\n如果你想学习开发该游戏\n请到极客学院官网\nhttp://jikexy.com","bold 20px Arial","#0000ff");
            _this.addChild(aboutTxt);

            var b = aboutTxt.getBounds();
            aboutTxt.x = (gameView.width- b.width)/2;
            aboutTxt.y = gameView.height - b.height -10;
        }

        addFlowers();
        addContentLabel();
        addReStartGameBtn();
        addGameAboutTxt();

        return _this;
    }

    window.GameOverScene = GameOverScene;
}());