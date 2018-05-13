function LayerService(map){
	var self = this;
	self.map = map;
	
	self.addLayers = function(jsonElementId){
		if (self.map){
			var layersJson = getLayersByIds(jsonElementId);
			
			if (layersJson){
				var keys = [];
				var layersObj = JSON.parse(layersJson);
				
				$.each(layersObj.layers,function(index, value){
					self.map.addLayer(value);
				});
				
				return layersObj.keys;
			}
		}
	};
	
	function getLayersByIds(jsonElementId){
		return $('#' + jsonElementId).html();
	}
}
//Дописать обработку кликов по слоям итд