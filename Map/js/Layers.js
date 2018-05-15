function LayerService(map){
	var self = this;
	self.map = map;
	
	self.addLayers = function(jsonElementId){
		if (self.map){
			var layersJson = getLayersByIds(jsonElementId);
			
			if (layersJson){
				var layersObj = JSON.parse(layersJson);
				
				$.each(layersObj.layers,function(index, value){
					self.map.addLayer(value);
					addEvents(value.id);
					
				});
				
				return layersObj.info;
			}
		}
	};
	
	function getLayersByIds(jsonElementId){
		return $('#' + jsonElementId).html();
	}
	function addEvents(layerId){
		map.on('click', layerId, function (e) {
			var coordinates = e.features[0].geometry.coordinates.slice();
			if (!coordinates || coordinates.length != 2 || coordinates[0].length || coordinates[1].length){
				coordinates = e.lngLat;
			}
			var layer = self.map.getLayer(layerId);
			var popupData = JSON.parse(e.features[0].properties.popupData);
			var popupId = 'map-box-popupId';
			var popupHtml = '<div id="' + popupId + '">' + layer.metadata.popupHtml + '</div>';
			
			while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
				coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
			}
			
			if($('#' + popupId)[0]){
				return;
			}
			
			new mapboxgl.Popup()
				.setLngLat(coordinates)
				.setHTML(popupHtml)
				.addTo(map);
				
			ko.applyBindings(popupData, $('#' + popupId)[0]);
		});
		map.on('mouseenter', layerId, function () {
			map.getCanvas().style.cursor = 'pointer';
		});

		map.on('mouseleave', layerId, function () {
			map.getCanvas().style.cursor = '';
		});
		}
}
//Дописать обработку кликов по слоям итд