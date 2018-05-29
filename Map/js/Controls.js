function ControlService(map){
	var self = this;
	self._map = map;
	self.layerService = new LayerService(self._map);
	var controlFunctionalityObjects = {};
	
	self.get = function(controlInfo){
		var defaultControl = new Control(controlInfo);
		var functionalityObject = getControlFunctionalityObject(controlInfo);
		if (functionalityObject){
			var control = $.extend(true, {}, defaultControl, functionalityObject)
			return control;
		}
		
		return defaultControl;
	}
	
	function Control(controlInfo)
	{
		this.flag = ko.observable(0);
		this.controlName = controlInfo.controlName;
		this._map = self._map;
		this.controlId = ko.observable(controlInfo.controlId);
		this.controlHtml = controlInfo.controlHtml;
		this.layerId = ko.observable(controlInfo.controlId);	
	}
	
	function getControlFunctionalityObject(controlInfo){
		if (controlFunctionalityObjects[controlInfo.controlId]){
			var obj  = new controlFunctionalityObjects[controlInfo.controlId](controlInfo);
			return obj;
		}
		
		return undefined;
	}
	controlFunctionalityObjects["main-control"] = function(controlInfo){
		var layerService = new LayerService(self._map);
		var filterService = new FilterService();
		this.mainLayer = self.layerService.getLayerObjectTree(controlInfo.layerId);
		this.layers = {};
		getLayersDictionary(this.mainLayer, this.layers);
		
		this.toggleElementFilter = function(control, elementId, layerId){
			var layer = control.layers[layerId];
			var element = layer.elements[elementId];
			var filters = getFilters(control, layerId ,elementId);
			
			if (element.IsElementShown()){
				for (var i = 0; i < filters.length; i++){
					layerService.addFilter(layerId, filters[i]);
				}
				
				element.IsElementShown(false);
			}
			else{
				for (var i = 0; i < filters.length; i++){
					layerService.removeFilter(layerId, filters[i]);
				}
				element.IsElementShown(true);
			}	
		}
		
		function getFilters(control, layerId, elementId){
			var result = [];
			var layer = control.layers[layerId];
			var elements = layer.elements;
			var ownerFilter = filterService.getFilter("!=", "ownerLayer", layerId);
			var elementFilters = [filterService.getFilter("!=", "ownerElement", elementId)];
			
			for (var key in elements){
				if (key != elementId && !elements[key].IsElementShown()){
					var el = elementId < elements[key].elementId ? elementId + ";" + key : key + ";" + elementId;
					elementFilters.push(filterService.getFilter("!=", "ownerElement", el));
				}
			}
			
			for (var i = 0; i < elementFilters.length; i++){
				result.push(filterService.getUniteFilter("any", [ownerFilter, elementFilters[i]]));
			}
			
			return result;
		}
		
		this.showHideLayer = function(control, layerId){
			 if (layerService.isLayerVisible(layerId)) {
				layerService.hideLayerTree(layerId, false);
				control.layers[layerId].IsLayerShown(false);
			 }
			 else{
				control.layers[layerId].IsLayerShown(true);
				layerService.updateTreeVisiblity(layerId, control.layers);
			 }
		
		
		};
		this.showHideLayerMenu = function(control, layerId){
			var layerInfo = control.layers[layerId];
			if (layerInfo && layerInfo.IsLayerShown()){
				layerInfo.IsLayerMenuShown(!layerInfo.IsLayerMenuShown());
			}
		};
		
		function getLayersDictionary(tree, result){
			result[tree.layerId] = new Layer(tree.layerId, tree.elements);
			
			for(var i = 0; i < tree.childLayerObjects.length; i++){
				getLayersDictionary(tree.childLayerObjects[i], result);
			}
		}
		
		function Layer(layerId, elements){
			var layer = this;
			layer.layerId = layerId;
			layer.IsLayerShown = ko.observable(layerService.isLayerVisible(layerId)),
			layer.IsLayerMenuShown = ko.observable(true);
			
			layer.isLayerActive = ko.computed(function(){
				var obj = layerService.getLayerObject(layer.layerId);
				return layer.IsLayerShown() && obj && (obj.elements && obj.elements.length || obj.childLayers && obj.childLayerObjects.length); //стоит убрать проверку на элементы или добавить эту функциональность дальше по уровням
				
			});
			
			layer.elements = getElementsDictionary(elements);
		}
		
		function getElementsDictionary(elements){
			var result = {};
			
			for(var i = 0; i < elements.length; i++){
				result[elements[i].elementId] = {
					IsElementShown: ko.observable(true),// может быть проблема с фильтрами заданными по умолчанию, самое простое решение чистить их.
				}
			}
			
			return result;
		}
	};
}