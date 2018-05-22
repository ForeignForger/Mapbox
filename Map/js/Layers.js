function LayerService(map){
	var self = this;
	self._map = map;
	
	self.addLayers = function(jsonElementId){
		if (self._map){
			var layersJson = getMainJson(jsonElementId);
			
			if (layersJson){
				var jsonObj = JSON.parse(layersJson);
				
				$.each(jsonObj.layers,function(index, value){
					self._map.addLayer(value);
					addEvents(value.id);
					
				});
				
				return jsonObj.info;
			}
		}
	};
	
	function getMainJson(jsonElementId){
		return $('#' + jsonElementId).html();
	}
	
	function addEvents(layerId){
		map.on('click', layerId, function (e) {
			var coordinates = e.features[0].geometry.coordinates.slice();
			if (!coordinates || coordinates.length != 2 || coordinates[0].length || coordinates[1].length){
				coordinates = e.lngLat;
			}
			var layer = self._map.getLayer(layerId);
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
		self._map.on('mouseenter', layerId, function () {
			map.getCanvas().style.cursor = 'pointer';
		});

		self._map.on('mouseleave', layerId, function () {
			map.getCanvas().style.cursor = '';
		});
	}
	
	self.getLayerObjectTree = function(rootLayerId){
		var result = self.getLayerObjectById(rootLayerId);
		if(result){	
			result.childLayerObjects = {};
			$.each(result.childLayers, function (index, layerId){
				var obj = self.getLayerObjectTree(layerId);
				if(obj){
					result.childLayerObjects[layerId] = obj;
				}
				
			});
			
			return result;
		}
		
		return undefined;
	}
	
	self.getLayerObjectById = function(layerId){
		var layer = self._map.getLayer(layerId);
		
		if(layer && layer.metadata){
			layer.metadata.layerId = layerId;
			return layer.metadata;
		}
		
		return undefined;
	}
	
	self.getLayer = function(layerId){
		var layer = self._map.getLayer(layerId);
		
		if(layer){
			return layer;
		}
		
		return undefined;
	}
	
	self.hideLayerTree = function(layerId, only){
		var tree = self.getLayerObjectTree(layerId);
		if(tree){
			hideLayer(tree.layerId);
			if (!only){
				for (var i = 0; i < tree.childLayers.length; i++){
					self.hideLayerTree(tree.childLayers[i]);
				}
			}

		}
		
	}
	
	self.showLayerTree = function(layerId, only){
		var tree = self.getLayerObjectTree(layerId);
		if(tree){
			showLayer(tree.layerId);
			if (!only){
				for (var i = 0; i < tree.childLayers.length; i++){
					self.showLayerTree(tree.childLayers[i]);
				}
			}
		}
	}
	
	self.isLayerVisible = function(layerId){
		var visibility = self._map.getLayoutProperty(layerId, 'visibility');
		return visibility === 'visible';
	}
	
	function hideLayer(layerId){
		self._map.setLayoutProperty(layerId, 'visibility', 'none');
	}
	
	function showLayer(layerId){
		self._map.setLayoutProperty(layerId, 'visibility', 'visible');
	}
}
//Дописать обработку кликов по слоям итд