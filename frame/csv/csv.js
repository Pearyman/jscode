define(function(){
	var CSV = function(){
		this.init.apply(this,arguments);
	};
	CSV.prototype = {
		init : function(configs){
			var self = this,
				configs = configs || {};
			self.configs = {
				downloadNode : configs.downloadNode || null,
				dataNode : configs.dataNode || null
			}
			self.initData();
		},
		initData : function(){
			var self = this;
			self.data = [];
			self.configs.dataNode.find('tr').each(function(){
				var arr = [];
				$(this).children().each(function(){
					arr.push($(this).text());
				})
				self.data.push(arr);
			})
			self.buildCsvFile();
		},
		buildCsvFile : function(){
			var self = this;
			self.csvContent = 'data:text/csv;charset=utf-8,';
			$.each(self.data,function(i,o){
				var str = o.join(',');
				self.csvContent += o.join(',') + '\n';
			})
			self.buildHref();
		},
		buildHref : function(){
			var self = this;
			self.configs.downloadNode.attr({
				target : '_blank',
				href : encodeURI(self.csvContent),
				download : 'data.csv'
			})
		}
	}
	var interface = function(configs){
		return new CSV(configs);
	}
	return interface;
})