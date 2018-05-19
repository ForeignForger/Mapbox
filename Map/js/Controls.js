function ControlService(map){
	var self = this;
	self._map = map;
	var controlFunctionalityObjects = {};
	
	self.get = function(controlInfo){
		var defaultControl = new Control(controlInfo);
		var functionalityObject = getControlFunctionalityObject(defaultControl.controlId());
		if (controlFunctionalityObjects[defaultControl.controlId()]){
			var control = $.extend(true, {}, defaultControl, functionalityObject)
			return control;
		}
		
		return undefined;
	}
	
	function Control(controlInfo)
	{
		this.name = 'name-' + controlInfo.controlId;
		this._map = self._map;
		this.controlId = ko.observable(controlInfo.controlId);
		this.controlHtml = controlInfo.controlHtml;
		this.LayerId = ko.observable(controlInfo.controlId);	
	}
	
	function getControlFunctionalityObject(controlId){
		if (controlFunctionalityObjects[controlId]){
			var obj  = new controlFunctionalityObjects[controlId]();
			return obj;
		}
		
		return undefined;
	}
	controlFunctionalityObjects["main-control"] = function(map){
		this._map = map;
		this.sayHello = function(){
			console.log("control " + this.controlId() + " wants to say hello");
		};
	};
}