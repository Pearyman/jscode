define(function () {

	//var Log = require('log');
	/**
	 * based on jquery
	 */

	var HC = {version: '1.0.0', ui: {}, util: {}, lang: {}, brower: {}};

	/**
	 * manage zindex attribute automatically
	 */
	HC.ZINDEX = 2013;

	HC.util = {
		handleJson: function (json, succeedCb, errorCb) {
			json = (typeof json == 'string') ? $.parseJSON(json) : json;
			if (json['status'] != 0) {
				errorCb && errorCb(json);
				throw new Error(json['msg']);
			}
			else {
				succeedCb && succeedCb(json);
			}
		},
		getFrameContent: function (iframeId) {
			var content = '';
			if (navigator.userAgent.indexOf('MSIE') != -1) {
				content = document.frames[iframeId].document.body.innerHTML;
			}
			else {
				content = document.getElementById(iframeId).contentDocument.body.innerHTML;
			}
			return content;
		},
		bind: function (fn, scope) {
			return function () {
				fn.apply(scope, arguments);
			};
		},
		//Object convert to String
		objToString: function (o) {
			var r = [];
			if (typeof o == "string") {
				return "\"" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
			}
			if (typeof o == "object") {
				if (!o.sort) {
					for (var i in o) {
						r.push("\"" + i + "\"" + ":" + arguments.callee(o[i]));
					}
					r = "{" + r.join() + "}";
				} else {
					for (var i = 0; i < o.length; i++) {
						r.push(arguments.callee(o[i]))
					}
					r = "[" + r.join() + "]";
				}
				return r;
			}
			return o.toString();
		},
		//The counting of string length using a byte
		strConversionCharLength: function (str) {
			var bytesCount = 0;
			for (var i = 0; i < str.length; i++) {
				if (/^[\u0000-\u00ff]$/.test(str.charAt(i))) {
					bytesCount += 1;
				} else {
					bytesCount += 2;
				}
			}
			return bytesCount;
		},
		//验证必须为数字
		limitIsNum: function (target, callback) {
			var oldnum = Number($.trim(target.val()));
			target.unbind('blur').bind('blur', function () {
				var val = $.trim($(this).val());
				oldnum = (isNaN(val) || Number(val) < 0) ? oldnum : val;
				$(this).val(oldnum);
				callback && callback(Number($.trim($(this).val())),$(this));
			});
		},
        /*处理浮点型数字*/
        transToFloat : function(num,exponent){
            if(isNaN(num)){
                alert('请传数字');
                return;
            }
            Number.prototype.toFixed  =   function ( exponent){
                return  parseInt( this   *  Math.pow(  10 , exponent)  +   0.5 )/Math.pow(10,exponent);
            }
            return num.toFixed(exponent);
        },
		//验证时间先后
		timeCompare: function (endtime, starttime) {//返回true没有过期,结束时间大于开始时间
			if (!starttime) {
				var today = new Date();
				var today_year = today.getFullYear();
				var today_month = today.getMonth() + 1;
				var today_date = today.getDate();
			} else {
				var starttimeArr = starttime.split('-');
				var today_year = starttimeArr[0];
				var today_month = starttimeArr[1];
				var today_date = starttimeArr[2];
			}
			var endtime_arr = endtime.split('-');
			var endtime_year = endtime_arr[0];
			var endtime_month = endtime_arr[1];
			var endtime_date = endtime_arr[2];
			if (endtime_year < today_year) {
				return false;
			} else if (endtime_year == today_year) {
				if (endtime_month < today_month) {
					return false;
				} else if (endtime_month == today_month) {
					if (endtime_date <= today_date) {
						return false;
					}
				}
			}
			return true;
		},
		unique: function (arr) {//数组去重
			var _res = [];
			var _json = {};
			for (var i = 0; i < arr.length; i++) {
				if (!_json[arr[i]]) {
					_res.push(arr[i]);
					_json[arr[i]] = 1;
				}
			}
			return _res;
		}
	};
	HC.lang = {
		/**
		 * Performs `{placeholder}` substitution on a string. The object passed as the
		 * second parameter provides values to replace the `{placeholder}`s.
		 * `{placeholder}` token names must match property names of the object. For example,
		 * @example:
		 *      var greeting = HC.lang.sub("Hello, {who}!", { who: "World" });
		 *      greeting is   'Hello, World!';
		 * `{placeholder}` tokens that are undefined on the object map will be left
		 * in tact (leaving unsightly `{placeholder}`'s in the output string).
		 *
		 * @method sub
		 * @param {string} s String to be modified.
		 * @param {object} o Object containing replacement values.
		 * @return {string} the substitute result.
		 * @static
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
		},
		/*
		 * @ method getRandom
		 * */
		getRandom: function (name) {
			var name = name || "";
			return name + (new Date().getTime());
		},
		/*
		 * @ method formatDate
		 * @ param
		 *    date ： Date/Date.getTime()
		 *    format : string
		 *    num : init
		 *  @ return string '2000-00-00 00:00:00'
		 * */
		formatDate: function (date, format,num) {
			if (!date) return;
			if (!format) format = "yyyy-MM-dd";
			switch (typeof date) {
				case "string":
					date = new Date(date.replace(/-/g, "/"));
					break;
				case "number":
					date = new Date(date);
					break;
			}
			var num = num || 0;
			var newDate = date.getTime() + (num*60*60*24*1000);
			newDate = new Date(newDate);
			if (!date instanceof Date) return;
			if (!newDate instanceof Date) return;
			var dict = {
				"yyyy": newDate.getFullYear(),
				"M": newDate.getMonth() + 1,
				"d": newDate.getDate(),
				"h": newDate.getHours(),
				"m": newDate.getMinutes(),
				"s": newDate.getSeconds(),
				"MM": ("" + (newDate.getMonth() + 101)).substr(1),
				"dd": ("" + (newDate.getDate() + 100)).substr(1),
				"hh": ("" + (newDate.getHours() + 100)).substr(1),
				"mm": ("" + (newDate.getMinutes() + 100)).substr(1),
				"ss": ("" + (newDate.getSeconds() + 100)).substr(1)
			};
			return format.replace(/(yyyy|MM?|dd?|hh?|ss?|mm?)/g, function () {
				return dict[arguments[0]];
			});
		}
	};

	HC.brower = {
		navigator: window.navigator,
		isIE: /MSIE/.test(this.navigator.appVersion) || /Trident/.test(this.navigator.appVersion),
		isIE6: !!window.ActiveXObject && !window.XMLHttpRequest,
		isIE7: /MSIE 7.0/.test(this.navigator.appVersion),
		isIE8: /MSIE 8.0/.test(this.navigator.appVersion),
		isIE9: /MSIE 9.0/.test(this.navigator.appVersion),
		isIE10: /MSIE 10.0/.test(this.navigator.appVersion)
	};
	return HC;

});