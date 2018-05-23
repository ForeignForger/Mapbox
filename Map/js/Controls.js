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
		
		this.showHideLayer = function(control, layerId){
			 if (layerService.isLayerVisible(layerId)) {
				layerService.hideLayerTree(layerId, control.mainLayer.layerId != layerId);
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
			result[tree.layerId] = {
				IsLayerShown: ko.observable(layerService.isLayerVisible(tree.layerId)),
				IsLayerMenuShown: ko.observable(true),
				elements: getElementsDictionary(tree.elements),
			}
			
			for(var i = 0; i < tree.childLayerObjects.length; i++){
				getLayersDictionary(tree.childLayerObjects[i], result);
			}
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