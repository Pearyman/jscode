define(function() {
	var BASE = {
		version: '1.0.0',
		ui: {},
		method: {}
	};

	BASE.ui = {
		init: function() {
			var self = this;
			self.changeFont();
		},
		changeFont: function() {
			var default_width = 20,
				default_dpr = 1,
				dpr = window.devicePixelRatio,
				width = screen.width,
				html_style = '',
				body_style = '';
			//dpr倍数
			var difference = dpr / default_dpr;
			if (difference === 1 || difference === 2 || difference === 3) {
				var default_min_size = 20 * difference;
				var default_max_size = 33.75 * difference;
				var default_coefficient = 0.0625 * difference;
				html_style = BASE.ui.get_font_size(width, default_min_size, default_max_size, default_coefficient);
				body_style = 'font-size:' + difference * 12 + 'px';
			} else {
				html_style = BASE.ui.get_font_size(width, 20, 33.75, 0.0625);
				body_style = 'font-size:12px';
			}
			$("html").attr('style', html_style);
			$("html").attr("data-dpr", difference);
			$("body").attr('style', body_style);
		},
		get_font_size: function(width, default_min_size, default_max_size, default_coefficient) {
			var style = '';
			//屏幕宽度需要在320-540之间进行计算
			if (width < 320) {
				style = 'font-size:' + default_min_size + 'px';
			} else if (width > 540) {
				style = 'font-size:' + default_max_size + 'px';
			} else {
				var difference = width - 320;
				var fontsize = default_min_size + difference * default_coefficient;
				style = 'font-size:' + fontsize + 'px';
			}
			return style;

		}
	}

  

	BASE.method = {
		/*
	     *@param 用于和android IOS传递数据 
	     *@param 数据利用item对象来进行传递
	     *example:item={
	     *     			a:1,
	     *     			b:2,
	     *     			c:aa	
	     * 			 }
	     */
		doAction: function(item, key, e) {
			if (window.ANDROID_WODFAN_INSTANCE) {
				e.preventDefault();
				ANDROID_WODFAN_INSTANCE.doAction(JSON.stringify(item), 'javascript:' + key);
			}

			function connectWebViewJavascriptBridge(callback) {
				if (window.WebViewJavascriptBridge) {
					callback(WebViewJavascriptBridge)
				} else {
					document.addEventListener('WebViewJavascriptBridgeReady', function() {
						callback(WebViewJavascriptBridge)
					}, false)
				}
			}
			connectWebViewJavascriptBridge(function(bridge) {
				item.actionKey = key;
				window.WebViewJavascriptBridge.callHandler('doAction', item);

			})
		},
		/**
		 * @example:
		 *     ① templates:'<tr><td>{id}</td><td>{user}</td></tr>' 
		 *	   ② var list = respone.message.staruser_list,
		 *				listhtml = '',
		 *				item = {};
		 *			$.each(list, function(i, n) {
		 *				item = {
		 *					id: n.id,
		 *					user: n.user
		 *				}
		 *			listhtml += Base.lang.sub(templates, item);
		 *
		 * @note: ①(it is a html moudle)
		 *        ② in ajax when you get the request successful 
		 *          initialize list (get it in response)
		 *          initialize listhtml,item
		 *
		 */
		sub: function (s, o) {
			var SUBREGEX = /\{\s*([^|}]+?)\s*(?:\|([^}]*))?\s*\}/g;
			return s.replace ? s.replace(SUBREGEX, function (m, k) {
				return o[k] === 'undefined' ? m : o[k];
			}) : s;

		},
		/**
		 * @method getparam   get params from url
		 * @param name{string}
		 * @param url{string} url not neaded the default is current url
		 * @return {string} return the param's value what you need
		 * @static
		 */
		getUrlParam: function (name, url) {
			var search = url || document.location.search;
			var pattern = new RegExp("[?&]" + name + "\=([^&]+)", "g");
			var matcher = pattern.exec(search);
			var items = null;
			if (null != matcher) {
				try {
					items = decodeURIComponent(decodeURIComponent(matcher[1]));
				} catch (e) {
					try {
						items = decodeURIComponent(matcher[1]);
					} catch (e) {
						items = matcher[1];
					}
				}
			}
			return items;
		}
	}

	return BASE;
})