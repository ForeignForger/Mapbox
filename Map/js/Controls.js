//Создадим панель контроллеров, каждый из контроллеров в отдельной вкладке, так же есть кнопка скрывающаяя все контроллеры
//для mapbox control-panel это и есть контрол. Для нас входящие control которые имеют специфическую функциональность
function ControlService(map, info){
	var self = this;
	self.map = map;
	self.info = info;
	self.controlPanels = {};
	self.controlFunctionalityObjects = {};
	
	self.controlFunctionalityObjects["main-control"] = function(){
		this.sayHello = function(){
			console.log("control " + this.controlId() + " want to say hello");
		};
	};
	
	self.addControls = function(){
		$.each(self.info.controlPanels, function(index, controlPanel){
			if (!self.controlPanels[controlPanel.position]){
					self.controlPanels[controlPanel.position] = new ControlPanel(controlPanel);
					$.each(controlPanel.controls, function (index, controlInfo){
						var defaultControl = new Control(controlInfo);
						var functionalityObject = new self.controlFunctionalityObjects[defaultControl.controlId()]();
						var control = $.extend(true, {}, defaultControl, functionalityObject)
						control.sayHello();
						self.controlPanels[controlPanel.position].controls.push(control);
					});
					//инициализация контрола, добавление на карту, аплай биндинг
			}
		});
		
	}
	
	function ControlPanel(info){
		var self = this;
		self.panelHtml = info.PanelHtml;
		self.position = info.position;
		self.controls = [];
	}
	
	ControlPanel.prototype.onAdd = function (map){
		this._map = map;
		//создание контроллера
		return this._container;
	}
	

	ControlPanel.prototype.onRemove = function() {
		this._container.parentNode.removeChild(this._container);
		this._map = undefined;
	}
	function Control(controlInfo)
	{
		var self = this;
		self.controlId = ko.observable(controlInfo.controlId);
		self.LayerId = ko.observable(controlInfo.controlId);
		self.IsOpen = ko.observable(false);		
	}
	/*

	controlPanel теперь контрол для mapbox, (control, для него это часть его функциональности)
	*/
	
}


