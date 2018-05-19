function ControlService(map){
	var self = this;
	self._map = map;
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
		this.mainLayer = layerService.getLayerObjectTree(controlInfo.layerId);
		addAdditionalInfoToLayers(this.mainLayer);
		
		function addAdditionalInfoToLayers(layerObject){
			layerObject.IsShown = ko.observable(true);
			
			layerObject.elements = layerObject.elements;
			
			layerObject.showHideLayer = function(){
				var visibility = map.getLayoutProperty(this.layerId, 'visibility');
					
				if(visibility === 'visible'){
					map.setLayoutProperty(this.layerId, 'visibility', 'none');
					this.IsShown(false);
				}
				else{
					map.setLayoutProperty(this.layerId, 'visibility', 'visible');
					this.IsShown(true);
				}
			};
		}
	};
}