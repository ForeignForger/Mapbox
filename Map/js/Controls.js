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
		
		this.isLayerShown = ko.observable(true); //реализовать функцию для определения по id слоя (можно через атрибуты)
		
		this.showHideLayer = function(layerId, control){
			var visibility = control._map.getLayoutProperty(layerId, 'visibility');
			 if (visibility === 'visible') {
				layerService.hideLayerTree(layerId, control.mainLayer.layerId != layerId);
				control.isLayerShown(false);
			 }
			 else{
				layerService.showLayerTree(layerId, control.mainLayer.layerId != layerId);
				control.isLayerShown(true);
			 }
			
		};
		
		this.showHideLayerMenu = function(e){
		};
	};
}