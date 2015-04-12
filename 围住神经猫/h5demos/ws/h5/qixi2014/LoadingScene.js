/**
 * Created by plter on 8/1/14.
 */

(function () {
    function LoadingScene(gameView) {
        var _this = new createjs.Container();
        var loadingLabel = new createjs.Text("Loading...","bold 20px Arial");
        _this.addChild(loadingLabel);

        function centerText(target) {
            target.x = (gameView.width-target.getMeasuredWidth())/2;
            target.y = (gameView.height-target.getMeasuredHeight())/2;
        }
        centerText(loadingLabel);

        function showLoading(progress) {
            loadingLabel.text = "Loading "+parseInt(progress*100)+"%";
            centerText(loadingLabel);
        }

        function handleFileLoad(evt) {
            if (evt.item.type == "image") { images[evt.item.id] = evt.result; }
        }

        function handleComplete() {
            replaceScene(StartScene(gameView));
        }

        function handleProgress(e) {
            showLoading(e.progress);
        }

        function startLoadRes() {
            var loader = new createjs.LoadQueue(false);
            loader.addEventListener("fileload", handleFileLoad);
            loader.addEventListener("complete", handleComplete);
            loader.addEventListener("progress",handleProgress);
            loader.loadManifest(lib.properties.manifest);
        }

        startLoadRes();
        return _this;
    }
    window.LoadingScene = LoadingScene;
}());