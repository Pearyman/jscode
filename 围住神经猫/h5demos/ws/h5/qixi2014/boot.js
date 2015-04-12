/**
 * Created by plter on 8/1/14.
 */

(function () {
    //pre set

    var gameView = document.getElementById("gameView");
    var stage = new createjs.Stage(gameView);
    var currentScene = null;

    String.prototype.cutStr = function(len){
        var arr = [];

        for(var i=0;i<this.length;i+=len){
            arr.push(this.substr(i,len))
        }
        return arr;
    }

    function resizeGameViewByBodySize() {
        gameView.width = window.innerWidth;
        gameView.height = window.innerHeight;
    }
    resizeGameViewByBodySize();

    function setupStage() {
        createjs.Ticker.setFPS(30);
        createjs.Ticker.addEventListener("tick",stage);
    }
    setupStage();

    window.replaceScene = function (scene) {
        if(currentScene!=null&&currentScene.parent!=null){
            currentScene.parent.removeChild(currentScene);
        }
        currentScene = scene;
        stage.addChild(currentScene);
    };

    replaceScene(LoadingScene(gameView));
}());