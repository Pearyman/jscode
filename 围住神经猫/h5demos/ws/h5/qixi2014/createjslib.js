(function (lib, img, cjs) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 550,
	height: 400,
	fps: 24,
	color: "#FFFFFF",
	manifest: [
		{src:"images/Bitmap2.png", id:"Bitmap2"},
		{src:"images/Bitmap3.png", id:"Bitmap3"},
		{src:"images/Bitmap4.png", id:"Bitmap4"},
		{src:"images/Bitmap5.png", id:"Bitmap5"},
		{src:"images/Bitmap6.png", id:"Bitmap6"},
		{src:"images/Bitmap7.png", id:"Bitmap7"},
		{src:"images/qlqq.png", id:"qlqq"},
		{src:"images/Rose.png", id:"Rose"}
	]
};



// symbols:



(lib.Bitmap2 = function() {
	this.initialize(img.Bitmap2);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,48,48);


(lib.Bitmap3 = function() {
	this.initialize(img.Bitmap3);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,48,48);


(lib.Bitmap4 = function() {
	this.initialize(img.Bitmap4);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,48,48);


(lib.Bitmap5 = function() {
	this.initialize(img.Bitmap5);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,48,48);


(lib.Bitmap6 = function() {
	this.initialize(img.Bitmap6);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,48,48);


(lib.Bitmap7 = function() {
	this.initialize(img.Bitmap7);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,48,48);


(lib.qlqq = function() {
	this.initialize(img.qlqq);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,48,48);


(lib.Rose = function() {
	this.initialize(img.Rose);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,48,48);


(lib.QLMc = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.qlqq();

	this.instance_1 = new lib.Bitmap2();

	this.instance_2 = new lib.Bitmap3();

	this.instance_3 = new lib.Bitmap4();

	this.instance_4 = new lib.Bitmap5();

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},5).to({state:[{t:this.instance_2}]},5).to({state:[{t:this.instance_3}]},5).to({state:[{t:this.instance_4}]},5).wait(5));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,48,48);


(lib.CustomGameBtn = function() {
	this.initialize();

	// label
	this.label = new cjs.Text("点击这里送上你的祝福", "20px 'Arial'");
	this.label.name = "label";
	this.label.lineHeight = 22;
	this.label.lineWidth = 205;
	this.label.setTransform(9,8);

	// bg
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#990000").ss(3,1,1).p("Avti9IfbAAQBkAAABAyIAAEXQgBAyhkAAI/bAAQhlAAABgyIAAkXQgBgyBlAAg");
	this.shape.setTransform(112,19);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("rgba(255,102,0,0.298)").s().p("AvtC9QhlAAABgxIAAkWQgBgzBlAAIfaAAQBlAAABAzIAAEWQgBAxhlAAg");
	this.shape_1.setTransform(112,19);

	this.addChild(this.shape_1,this.shape,this.label);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-0.2,-1.5,224.4,41);


(lib.RestartGameBtn = function() {
	this.initialize();

	// label
	this.label = new cjs.Text("重新开始", "bold 22px 'Arial'", "#FFFFFF");
	this.label.name = "label";
	this.label.lineHeight = 24;
	this.label.lineWidth = 91;
	this.label.setTransform(9,6);

	// bg
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#FF9900").ss(3,1,1).p("Anyi9IPlAAQAyAAAAAyIAAEXQAAAygyAAIvlAAQgyAAAAgyIAAkXQAAgyAyAAg");
	this.shape.setTransform(55,19);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("rgba(51,204,255,0.698)").s().p("AnyC9QgyAAAAgxIAAkWQAAgzAyAAIPlAAQAyAAAAAzIAAEWQAAAxgyAAg");
	this.shape_1.setTransform(55,19);

	this.addChild(this.shape_1,this.shape,this.label);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-1.5,-1.5,113,41);


(lib.StartGameBtn = function() {
	this.initialize();

	// label
	this.label = new cjs.Text("开始送花", "22px 'Wawati TC'");
	this.label.name = "label";
	this.label.lineHeight = 24;
	this.label.lineWidth = 95;
	this.label.setTransform(9,3);

	// bg
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#990000").ss(3,1,1).p("Anyi9IPlAAQAyAAAAAyIAAEXQAAAygyAAIvlAAQgyAAAAgyIAAkXQAAgyAyAAg");
	this.shape.setTransform(55,19);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("rgba(255,102,0,0.298)").s().p("AnyC9QgyAAAAgxIAAkWQAAgzAyAAIPlAAQAyAAAAAzIAAEWQAAAxgyAAg");
	this.shape_1.setTransform(55,19);

	this.addChild(this.shape_1,this.shape,this.label);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-1.5,-1.5,113,41);


// stage content:
(lib.createjslib = function() {
	this.initialize();

}).prototype = p = new cjs.Container();
p.nominalBounds = null;

})(lib = lib||{}, images = images||{}, createjs = createjs||{});
var lib, images, createjs;