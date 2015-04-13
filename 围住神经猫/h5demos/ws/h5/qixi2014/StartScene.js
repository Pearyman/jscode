/**
 * Created by plter on 8/1/14.
 */

(function () {
    function StartScene(gameView) {
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

        function startGameBtn_clickHandler(e) {
            startGameBtn.removeEventListener("click",startGameBtn_clickHandler);

            replaceScene(GameScene(gameView));
        }

        function addStartGameBtn() {
            startGameBtn = new lib.StartGameBtn();
            centerObject(startGameBtn);
            _this.addChild(startGameBtn);
            startGameBtn.addEventListener("click",startGameBtn_clickHandler);
        }

        function addContentLabel() {
            _this.addChild(contentLabel);

            var textContent = null;

            var index = location.href.indexOf("?");
            if(index>-1){
                try {
                    textContent = location.href.substr(index + 1);
                    var textContentArr = textContent.split("&");
                    var kvs = {};
                    for(var i=0;i<textContentArr.length;i++){
                        var kv = textContentArr[i].split("=");
                        kvs[kv[0]]=kv[1];
                    }
                    var words = kvs["words"];
                    if(words) {
                        textContent = decodeURI(kvs["words"]);
                    }else{
                        textContent = null;
                    }
                }catch (err){}
            }

            if(!textContent||textContent==""){
                textContent = "以此游戏献给我深爱的秋儿，祝秋儿天天开心！这9朵玫瑰代表我永久爱你"
            }

            contentLabel.text = textContent.cutStr(10).join("\n");

            contentLabel.y=20;
            contentLabel.x = (gameView.width-contentLabel.getBounds().width)/2;
        }

        function customButton_clickHandler(e) {
            location.href = "customgame.html";
        }

        function addCustomButton() {
            var customBtn = new lib.CustomGameBtn();
            _this.addChild(customBtn);
            customBtn.addEventListener("click",customButton_clickHandler);
            var b = customBtn.getBounds();
            customBtn.x = (gameView.width- b.width)/2;
            customBtn.y = gameView.height - b.height-20;
        }

        addFlowers();
        addContentLabel();
        addStartGameBtn();
        addCustomButton();

        return _this;
    }

    window.StartScene = StartScene;
}());