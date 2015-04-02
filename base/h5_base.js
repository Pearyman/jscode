$(function() {
	var BASE = {
		version: '1.0.0',
		ui: {},
		method: {}
	};

	BASE.ui = {
		init: function() {
			var self = this;
			self.autorun();
		},
		autorun: function() {
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

  /*
   *用于和安卓 IOS传递数据 
   *数据利用item对象来进行传递
   *eg:item={
   *     a:1,
   *     b:2,
   *     c:aa	
   * }
   *
   */

	BASE.method = {
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
		}
	}

	BASE.ui.init();
})