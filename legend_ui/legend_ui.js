/*
 * used in mobile ui frame, make it more lighter, useful 
 * author:nan
 * email:liyananhappy@sina.cn
 * version : 1.0.0
 */
~(function(){

	var $=function(selector,context){
		var nodeList=(context||document).querySelectorAll(selector),
			i=0;
		this.length=nodeList.length;
		if(this.length===1){
			return nodeList[0];
		}else if(this.length>1){
			for(;i<this.length;i++){
				this[i]=nodeList[i];
			}
			return this;
		}
	}
	window.$=$;
	// var _$=function(selector, context) {
	// 	var nodeList = (context || document).querySelectorAll(selector);
	// 	this.length = nodeList.length;
	// 	if(this.length===1){
	// 		return new _$.fn.init(selector, context)[0];
	// 	}else{
	// 		return new _$.fn.init(selector, context);
	// 	}
		
	// }

	// _$.fn=_$.prototype = {
	// 	init: function(selector, context) {
	// 		var i=0,
	// 		nodeList = (context || document).querySelectorAll(selector);
	// 		this.length = nodeList.length;
	// 		for (; i < this.length; i++) {
	// 			this[i] = nodeList[i];
	// 		}
	// 		return this;
	// 	}
	// }

	// _$.fn.init.prototype={
	// 	css:function(elem,css){
	// 		if(typeof css=='string'&& css.indexOf(':')>0){
	// 			elem.style&&(elem.style.cssText+=';'+css);
	// 		}
	// 	}
	// }
	
	// window.$=_$;
})(window)