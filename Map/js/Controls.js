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
		this.mainLayer = self.layerService.getLayerObjectTree(controlInfo.layerId);
		this.layers = {};
		getLayersDictionary(this.mainLayer, this.layers);
		
		this.showHideLayer = function(layerId, control){
			 if (layerService.isLayerVisible(layerId)) {
				layerService.hideLayerTree(layerId, control.mainLayer.layerId != layerId);
				control.layers[layerId].IsLayerShown(false);
			 }
			 else{
				layerService.showLayerTree(layerId, control.mainLayer.layerId != layerId);
				control.layers[layerId].IsLayerShown(true);
			 }
			
		};
		
		this.showHideLayerMenu = function(e){
		};
		
		function getLayersDictionary(tree, result){
			result[tree.layerId] = {
				IsLayerShown: ko.observable(layerService.isLayerVisible(tree.layerId))
			}
			
			for(var i = 0; i < tree.childLayerObjects.length; i++){
				getLayersDictionary(tree.childLayerObjects[i], result);
			}
		}
	};
}