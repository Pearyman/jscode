/*
 Base.js for ltz Copyright (c) 2015
 Available via the MIT or new BSD license.
 see: // place code link
 author: nan
 email:liyananhappy@sina.cn
 date:2015-8-18
*/
;(function(){
	var LTZ={version: '1.0.0', methods :{} };
	/*
	 * manage zindex attribute automatically
	 */
	LTZ.ZINDEX = 2015;

	LTZ.methods={
		transToFloat:function(num,exponent){
			if(isNaN(num)){
                alert('请传数字');
                return;
            }
            Number.prototype.toFixed  =   function (exponent){
                return  parseInt(this*Math.pow(10,exponent)+0.5 )/Math.pow(10,exponent);
            }
            return num.toFixed(exponent);
		}

	}

	var a=45.6;
	var b=13;
	var c=a*b;
	console.log(c)
	console.log(LTZ.methods.transToFloat(c,1));
	return LTZ;
})();