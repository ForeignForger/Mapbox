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
				
				updateLayersPosition(jsonObj.layers);
				return jsonObj.info;
			}
		}
	};
	
	function getMainJson(jsonElementId){
		return $('#' + jsonElementId).html();
	}
	
	function addEvents(layerId){
		var layer = self._map.getLayer(layerId);
		if (layer && layer.metadata.popupHtml){
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
	}
	
	function updateLayersPosition(layersJson){
		var roots = findRoots(layersJson);
		
		for (var i = 0; i < roots.length; i++){
			var order = self.getLayersOrder(roots[i]);
			if(order && order.length){
				self._map.moveLayer(order[order.length - 1]);
				for(var j = order.length - 2; j >= 0; j--){
					self._map.moveLayer(order[j], order[j + 1])
				}
			}
		}
	}
	
	function findRoots(layersJson){
		var roots = [];
		
		for (var i = 0; i < layersJson.length; i++){
			if (!layersJson[i].metadata.parentLayers || !layersJson[i].metadata.parentLayers.length){
				roots.push(layersJson[i].id);
			}
		}
		
		return roots;
	}
	
	self.getLayersOrder = function(rootId){
		var result = [];
		var lastLayerId;
		var obj = self.getLayerObject(rootId);
		
		if (obj){	
			result.push(rootId);

			obj.childLayers.sort(function(a, b){
				if (a.order){
					if(b.order){
						if (a.order > b.order){
							return 1;
						}
						if (a.order < b.order){
							return -1;
						}
						return 0;
					}
					
					return 1;
				}
				
				if (b.order){
					return -1;
				}
				
				return 0;
			});
			
			for (var i = 0; i < obj.childLayers.length; i++){
				result = result.concat(self.getLayersOrder(obj.childLayers[i]));
			}
		}
		
		return result;
	}
	
	self.getLayerObjectTree = function(rootLayerId){
		var result = self.getLayerObject(rootLayerId);
		if(result){	
			result.childLayerObjects = [];
			$.each(result.childLayers, function (index, layerId){
				var obj = self.getLayerObjectTree(layerId);
				if(obj){
					result.childLayerObjects.push(obj);
				}
			});
			
			return result;
		}
		
		return undefined;
	};
	
	self.getLayerObject = function(layerId){
		var layer = self._map.getLayer(layerId);
		
		if(layer && layer.metadata){
			layer.metadata.layerId = layerId;
			return layer.metadata;
		}
		
		return undefined;
	};
	
	self.getLayer = function(layerId){
		var layer = self._map.getLayer(layerId);
		
		if(layer){
			return layer;
		}
		
		return undefined;
	};
	
	self.updateTreeVisiblity = function(layerId, layersInfo){
		if (!layersInfo[layerId]){
			return;
		}
		var obj = self.getLayerObject(layerId);
		
		if(obj){
			if(layersInfo[obj.layerId] && layersInfo[obj.layerId].IsLayerShown()){
				showLayer(obj.layerId);
			}else{
				hideLayer(obj.layerId);
			}
			
			for (var i = 0; i < obj.childLayers.length; i++){
				self.updateTreeVisiblity(obj.childLayers[i], layersInfo);
			}
		}
	};
	
	self.hideLayerTree = function(layerId, only){
		var obj = self.getLayerObject(layerId);
		if(obj){
			hideLayer(obj.layerId);
			if (!only){
				for (var i = 0; i < obj.childLayers.length; i++){
					self.hideLayerTree(obj.childLayers[i], false);
				}
			}

		}
		
	}
	
	self.showLayerTree = function(layerId, only){
		var obj = self.getLayerObject(layerId);
		if(obj){
			showLayer(obj.layerId);
			if (!only){
				for (var i = 0; i < obj.childLayers.length; i++){
					self.showLayerTree(obj.childLayers[i], false);
				}
			}
		}
	};
	
	self.isLayerVisible = function(layerId){
		var visibility = self._map.getLayoutProperty(layerId, 'visibility');
		return visibility === 'visible';
	};
	
	function hideLayer(layerId){
		self._map.setLayoutProperty(layerId, 'visibility', 'none');
	}
	
	function showLayer(layerId){
		self._map.setLayoutProperty(layerId, 'visibility', 'visible');
	}
	
	self.addFilters = function(layerId, filters){
		var obj = self.getLayerObject(layerId);
		
		if(obj){
			var filter = self._map.getFilter(layerId);
			
			for (var i = 0; i < filters.length; i++){
				filter = addFilter(filter, filters[i]);
			}
			
			self._map.setFilter(layerId, filter);
			
			for (var j = 0; j < obj.childLayers.length; j++){
				self.addFilters(obj.childLayers[j], filters);
			}
		}
	};
	
	self.removeFilters = function(layerId, filters){
		var obj = self.getLayerObject(layerId);
		
		if(obj){
			var filter = self._map.getFilter(layerId);
			
			for (var i = 0; i < filters.length; i++){
				filter = removeFilter(filter, filters[i]);
			}
			
			self._map.setFilter(layerId, filter);
			
			for (var j = 0; j < obj.childLayers.length; j++){
				self.removeFilters(obj.childLayers[j], filters);
			}
		}
	};

	function addFilter(oldFilter, newFilter){
		if (!oldFilter){
			oldFilter = ["all"];
		}
		
		oldFilter.push(newFilter);
		return oldFilter;
	}
	
	function removeFilter(oldFilter, filter){
		if (oldFilter && oldFilter.length){
			var result  = [oldFilter[0]];
			
			for (var i = 1; i < oldFilter.length; i++){
				if(!equalFilters(oldFilter[i], filter)){
					result.push(oldFilter[i]);
				}
			}

			return result;
		}
		
		return undefined;
	}
	
	function equalFilters(filterA, filterB){
		if (filterA && filterB && filterA.length === filterB.length){
			for(var i = 0; i < filterA.length; i++){
				if (Array.isArray(filterA[i]) && Array.isArray(filterB[i])){
					if (!equalFilters(filterA[i], filterB[i])){
						return false;
					}
				}
				else if(filterA[i] != filterB[i]){
					return false;
				}
			}
			
			return true;
		}
		
		return false;
	}
}