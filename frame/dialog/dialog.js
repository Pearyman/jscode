/*
 *  @ ui dialog
 *       @param{width} {string}   define dialog's width
 *       @param{dialogBody} {string} define dialog's content
 *       @param{title} {string} define dialog's head title
 *       @param{hideTitle} {boolean} whether hide dialog's head or not
 *       @param{hideFoot} {boolean}  whether hide dialog's foot or not
 *       @param{animate}  {string}
 *               fade : set dialog's animate as fadeIn/fadeOut
 *               ... to be continued
 *       @param{autoClose} {array} see detail explain in dialog.tip
 *       @param{onload} {function}  callback function  diy
 *               onload(dialog,node){}
 *              @{dialog} dialog object
 *              @{node}  dialog box node
 *       @param{afterClose}{function}关闭后回调
 *       @param{draggable} {boolean}  ...to be continued
 *       @param{overlay} {boolean} whether need overlay behind dialog or not
 *       @param{overlayClickHide} {boolean} if click overlay close the dialog or not
 *       @param{needConfirmBtn} {boolean} whether need confirm button or not
 *       @param{confirmTxt} {string} confirm button's innerText
 *       @param{needCancelBtn} {boolean} whether need cancel button or not
 *       @param{cancelTxt} {string} cancel button's innerText
 *       @param{disableScroll} {boolean} whether disable window'scroll or not
 *       @param{diyKeyToHide} {boolean} blank key can close the alert dialog
 *  @ dialog.alert
 *       only confirm button  please use onload to define callback yourself
 *  @ dialog.confirm
 *       confirm & cancel button  cancel button has close function  please use onload to define callback yourself for confirm button
 *  @ dialog.tip
 *       neither one button this modal will autoClose in any times  such as [duration,callback]
 *       @autoClose  param{duration}    set dialog auto close time   until : s
 *                   param{callback}    callback fn
 * */
define(['base'], function (base) {
	var HC = base,
		Util = HC.util,
		Lang = HC.lang;

	var BOX = function () {
		this.init.apply(this, arguments);
	};
	BOX.prototype = {
		/**
		 * @method init
		 * @static
		 * @param configs {object}  ↑↑
		 * @return none
		 */
		init: function (configs) {
			var self = this,
				configs = configs || {};
			self.configs = {
				width: configs.width || "400",
				height: configs.height || '',
				dialogBody: configs.dialogBody || "",
				title: configs.title || "提示",
				hideTitle: configs.hideTitle || null,
				hideFoot: configs.hideFoot || null,
				animate: configs.animate || 'none',
				autoClose: configs.autoClose || [3],
				onload: configs.onload || null,
        afterClose : configs.afterClose || null,
				draggable: configs.draggable || null,
				overlay: configs.overlay || null,
				overlayClickHide: configs.overlayClickHide || null,
				needConfirmBtn: configs.needConfirmBtn || null,
				confirmTxt: configs.confirmTxt || "确定",
				needCancelBtn: configs.needCancelBtn || null,
				cancelTxt: configs.cancelTxt || "取消",
				disableScroll : configs.disableScroll || null,
				diyKeyToHide : configs.diyKeyToHide || null
			};
			self.param = {
				overlayTemplate: '<div class="HC-dialog-overlay"></div>',
				temlate: '<div class="HC-dialog-box clearfix">' +
				'<div class="HC-dialog-head clearfix"><h4><a href="#" class="HC-dialog-close">x</a><span>{TITLE}</span></h4></div>' +
				'<div class="HC-dialog-body">{BODY}</div>' +
				'<div class="HC-dialog-foot clearfix">{FOOT}</div>' +
				'</div>',
				confirmBtnTemplate: '<button class="btn btn-primary HC-dialog-confirm">{CONFIRMTXT}</button>',
				cancelBtnTemplate: '<button class="btn btn-default HC-dialog-cancel">{CANCELTXT}</button>'
			};
			if($('.HC-dialog-overlay').length >0 && $('.HC-dialog-box').length > 0){
				return;
			}
			self.setTemplate();
		},
		/**
		 * @method setTemplate set dialog overlay and dialog body
		 * @static
		 * @return none
		 */
		setTemplate: function () {
			var self = this;
			var item = {
				TITLE: self.configs.title,
				BODY: self.configs.dialogBody,
				FOOT: ""
			};
			item.FOOT += self.configs.needConfirmBtn ? Lang.sub(self.param.confirmBtnTemplate, {CONFIRMTXT: self.configs.confirmTxt}) : "";
			item.FOOT += self.configs.needCancelBtn ? Lang.sub(self.param.cancelBtnTemplate, {CANCELTXT: self.configs.cancelTxt}) : "";
			var body = Lang.sub(self.param.temlate, item);
			self.nodelist = {
				box_node: $(body)
			};
			self.nodelist.box_overlay_node = $(self.param.overlayTemplate);
			var htmlBody = $("body"),
				box_overlay_node = self.nodelist.box_overlay_node,
				box_node = self.nodelist.box_node;
			self.nodelist.box_head_node = box_node.find('.HC-dialog-head');
			self.nodelist.box_body_node = box_node.find('.HC-dialog-body');
			self.nodelist.box_foot_node = box_node.find('.HC-dialog-foot');
			self.nodelist.box_title_node = self.nodelist.box_head_node.find('span');
			self.nodelist.box_close_node = self.nodelist.box_head_node.find('.HC-dialog-close');
			if (self.configs.hideTitle) {
				self.nodelist.box_head_node.hide();
			}
			if (self.configs.hideFoot) {
				self.nodelist.box_foot_node.hide();
			}
			if (self.configs.draggable) {

			}
			if (self.configs.overlay) {
				htmlBody.append(box_overlay_node);
			}
			htmlBody.append(box_node);
			self.setPosition();
		},
		/**
		 * @method setPosition   set dialog's position in window
		 * @static
		 * @return none
		 */
		setPosition: function () {
			var self = this;
			var width = self.configs.width,
				height = self.configs.height,
				winWidth = $(window).width(),
				winHeight = $(window).height(),
				scrollLeft = $(window).scrollLeft(),
				scrollTop = $(window).scrollTop(),
				bodyHeight = $(document).height(),
				posLeft = winWidth > width ? ((winWidth - width) / 2) : winWidth,
				//posTop = winHeight > height ? ((winHeight - height) / 5) : winHeight;
				posTop = winHeight * 0.15;  //top 15%
			self.configs.height = height;
			self.nodelist.box_overlay_node.css({
				visibility: 'visible',
				display: 'none',
				width: winWidth + scrollLeft,
				height: bodyHeight > winHeight + scrollTop ? bodyHeight : winHeight + scrollTop,
				'z-index': ++HC.ZINDEX
			})
			self.nodelist.box_node.css({
				width: width,
				left: posLeft,
//                top : posTop,
				top: posTop,
				visibility: 'visible',
				display: 'none',
				'z-index': ++HC.ZINDEX
			});
			if(self.configs.height){
				self.nodelist.box_node.css('height',self.configs.height);
			}
			var maxheight = winHeight - posTop - 80 - (self.configs.hideTitle ? 0 : 51) - (self.configs.hideFoot ? 0 : 50);
			self.nodelist.box_body_node.css({
				maxHeight : maxheight,
				overflowY : 'auto'
			})
			self.show();
		},
		/**
		 * @method show   show dialog
		 * @static
		 * @return none
		 */
		show: function () {
			var self = this;
			if (self.configs.animate == "fade") {
				self.nodelist.box_overlay_node.fadeIn();
				self.nodelist.box_node.fadeIn(function () {
					self.afterShow();
				})
			}
			else {
				self.nodelist.box_overlay_node.css('display', 'block');
				self.nodelist.box_node.css('display', 'block');
				self.afterShow();
			}
		},
		/**
		 * @method afterShow
		 * @static
		 * @return none
		 */
		afterShow : function(){
			var self = this;
			if(self.configs.autoClose.length == 2){
				self.boxAutoClose();
			}
			if(self.configs.diyKeyToHide){
				self.diyKeyEvent = function(e){
					if(e.which == self.configs.diyKeyToHide){
						e.preventDefault();
						self.close();
					}
				}
				$(document).on('keydown',self.diyKeyEvent);
			}
			self.bindEvent();
			self.configs.disableScroll && self.disableScroll();
			self.resizeEvent();
			/*if (self.configs.draggable) {
				DRAG({
					handleNode : self.nodelist.box_head_node,
					dragNode: self.nodelist.box_node
				})
			}*/
			self.configs.onload && self.configs.onload(self, self.nodelist.box_node);
      /*毛玻璃效果*/
      $(".header").addClass('dl-blur');
      $(".top-menu").addClass('dl-blur');
      $(".main").addClass('dl-blur');
      $(".footer").addClass('dl-blur');
		},
		/**
		 *
		 * @method hide   hide dialog
		 * @static
		 * @return none
		 */
		hide: function (type) {
			var self = this,
				type = type || "";
			if (self.configs.animate == "fade") {
				self.nodelist.box_overlay_node.fadeOut();
				self.nodelist.box_body_node.fadeOut(function () {
					self.afterHide(type);
					self.diyKeyEvent && $(document).off('keydown',self.diyKeyEvent);
				});
			}
			else {
				self.nodelist.box_overlay_node.css('display', 'none');
				self.nodelist.box_body_node.css('display', 'none');
				self.afterHide(type);
				self.diyKeyEvent && $(document).off('keydown',self.diyKeyEvent);
			}
      /*毛玻璃效果*/
      $(".header").removeClass('dl-blur');
      $(".top-menu").removeClass('dl-blur');
      $(".main").removeClass('dl-blur');
      $(".footer").removeClass('dl-blur');
		},
		/**
		 *
		 * @method hide   hide dialog
		 * @static
		 * @return none
		 */
		afterHide : function(type){
			var self = this;
			if (type) {
				self.configs.disableScroll && self.enableScroll();
				self.unBindEvent();
				self.nodelist.box_overlay_node.remove();
				self.nodelist.box_node.remove();
			}
      self.configs.afterClose && self.configs.afterClose(self, arguments);
		},
		/**
		 * @method bindEvent   bind cancel and close button event
		 * @static
		 * @return none
		 */
		bindEvent: function () {
			var self = this;
			self.nodelist.box_node.on('click', '.HC-dialog-close,.HC-dialog-cancel', function (e) {
				e.preventDefault();
				self.close();
				self.autoTimeout && clearTimeout(self.autoTimeout);
				self.configs.autoClose[1] && self.configs.autoClose[1]();
			})
			if (self.configs.overlayClickHide) {
				self.nodelist.box_overlay_node.on('click', function () {
					self.close();
				})
			}
		},
		/**
		 * @method unBindEvent   unbind cancel and close button event
		 * @static
		 * @return none
		 */
		unBindEvent: function () {
			var self = this;
			self.nodelist.box_node.off('click');
			self.nodelist.box_overlay_node.off('click');
		},
		/**
		 * @method resizeEvent   when window resize, the dialog recount dislog's position
		 * @static
		 * @return none
		 */
		resizeEvent: function () {
			var self = this,
				win = $(window),
				doc = $(document);
			win.resize(function () {
				var winWidth = win.innerWidth(),
					winHeight = win.innerHeight(),
					docHeight = doc.innerHeight();
				self.nodelist.box_overlay_node.css({width: winWidth, height: docHeight});
				self.nodelist.box_node.css({left: (winWidth - parseInt(self.configs.width)) / 2});
			})
		},
		/**
		 * @method disableScroll   disableScroll when dialog show
		 * @static
		 * @return none
		 */
		disableScroll : function(){
			var self = this;
			var scrolltop = $(window).scrollTop();
			self.disScroll = function(){
				$(window).scrollTop(scrolltop);
			}
			$(window).on('scroll',self.disScroll);
		},
		/**
		 * @method enableScroll   enableScroll when dialog close
		 * @static
		 * @return none
		 */
		enableScroll : function(){
			var self = this;
			$(window).off('scroll',self.disScroll);
		},
		/**
		 * @method boxAutoClose   dialog auto close
		 * @static
		 * @return none
		 */
		boxAutoClose: function () {
			var self = this;
			var duration = self.configs.autoClose[0] * 1000;
      if(duration > 0) {
        self.autoTimeout = setTimeout(function () {
          self.close();
          self.configs.autoClose[1]();
        }, duration);
      }
		},
		/**
		 * @method close   dialog close
		 * @static
		 * @return none
		 */
		close: function () {
			var self = this;
			self.hide(true);
		}
	};
	var dialog = {
		alert: function (configs) {
			$.extend(configs, {
				needConfirmBtn: true
			});
			if(!configs.onload){
				configs.onload = function(dialog,node){
					node.find('.HC-dialog-confirm').click(function(){
					  dialog.close();
					});
				}
			}
			return new BOX(configs);
		},
		confirm: function (configs) {
			$.extend(configs, {
				needConfirmBtn: true,
				needCancelBtn: true
			})
			return new BOX(configs);
		},
		tip: function (configs) {
			$.extend(configs, {
				//onload: null,
				autoClose: configs.autoClose || [3000, null]
			});
			return new BOX(configs);
		}
	}
	return dialog;
})
