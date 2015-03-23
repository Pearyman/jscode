define(['base'],function(base){
	var HC = base;
	var D = function(){
		this.init.apply(this, arguments);
	};
	D.prototype = {
		init : function(configs){
			var self = this,
				configs = configs || {};
			self.configs = {
				dragNode : configs.dragNode || '',
				handleNode : configs.handleNode || '',
				containMent : configs.containMent || $(window),
				scroll : configs.scroll || false,
				dragPosition : configs.dragPosition || 'xy',
				onMove : configs.onMove || null,
				onDrop : configs.onDrop || null,
				zindex : '',
				dragging : false
			};
			if(self.configs.dragNode.length == 0){
				return;
			}
			self.configs.handleNode = self.configs.handleNode.length > 0 ? self.configs.handleNode : self.configs.dragNode;
			self.count();
		},
		count : function(){
			var self = this;
			var position = self.configs.dragNode.css('position');
			if(!position || position == 'static'){
				self.configs.dragNode.css('position','absolute');
			}
			self.max = {
				x : self.configs.containMent.innerWidth() - self.configs.dragNode.outerWidth(),
				y :  self.configs.containMent.innerHeight() - self.configs.dragNode.outerHeight()
			}
			self.min = {
				x : 0,
				y : 0
			}
			self.drag();
		},
		drag : function(){
			var self = this,
				handle = self.configs.handleNode;
			handle.on('mousedown',function(e){
				self.loc = {
					x : self.configs.dragNode.position().left,
					y : self.configs.dragNode.position().top
				};
				self.start = {
					x : e.pageX,
					y : e.pageY
				};
				self.configs.dragNode.css('z-index',++HC.ZINDEX);
				handle.on('mousemove',function(s){
					if(!self.configs.dragging){
						self.configs.dragging = true;
					}
					if(!handle.prop('tagname')){
						self.configs.dragNode.css('cursor','move');
					}
					else{
						handle.css('cursor','move');
					}
					self.end = {
						x : s.pageX,
						y : s.pageY
					};
					var left = self.loc.x + self.end.x - self.start.x,
						top = self.loc.y + self.end.y - self.start.y;
					if(left < self.min.x){
						left = self.min.x;
					}
					else if(left > self.max.x){
						left = self.configs.scroll ? left : self.max.x;
					}
					if(top < self.min.y){
						top = self.min.y;
					}
					else if(top > self.max.y){
						top = self.configs.scroll ? top : self.max.y;
					}
					if(self.configs.dragPosition == 'xy') {
						self.configs.dragNode.css({
							left: left,
							top: top
						})
					}
					else if(self.configs.dragPosition == 'y'){
						self.configs.dragNode.css({
							left: self.loc.x,
							top: top
						})
					}
					else if(self.configs.dragPosition == 'x'){
						self.configs.dragNode.css({
							left: left,
							top: self.loc.y
						})
					}
					self.configs.onMove &&  self.configs.onMove(self);
				})
			})
			handle.on('mouseup',function(){
				self.configs.dragNode.css('cursor','default');
				handle.css('cursor','default');
				handle.off('mousemove');
				self.configs.dragging = false;
				self.configs.onDrop && self.configs.onDrop(self);
			})

		},
		disable : function(){
			var self = this;
			self.configs.handleNode.off('mousedown');
		},
		enable : function(){
			var self = this;
			self.configs.handleNode.off('mousedown');
			self.count();
		}
	};
	var drag = function(configs){
		return new D(configs);
	};
	return drag;
})
