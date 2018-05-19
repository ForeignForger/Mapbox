//Создадим панель контроллеров, каждый из контроллеров в отдельной вкладке, так же есть кнопка скрывающаяя все контроллеры
//для mapbox control-panel это и есть контрол. Для нас входящие control которые имеют специфическую функциональность
function ControlPanelService(map, info){
	var self = this;
	self._map = map;
	self.info = info;
	self.controlPanels = {};
	self.controlService = new ControlService(self._map);
	
	self.addControlPanelsAtMap = function(){
		initControlPanels();
		$.each(self.controlPanels, function(index, controlPanel){
			self._map.addControl(controlPanel);
			ko.applyBindings(controlPanel, $('#' + controlPanel.controlPanelId)[0]);
			controlPanel.selectControl();
		});
	}
	
	function initControlPanels(){
		$.each(self.info.controlPanels, function(index, controlPanel){
			if (!self.controlPanels[controlPanel.position]){
				self.controlPanels[controlPanel.position] = new ControlPanel(controlPanel);
				$.each(controlPanel.controls, function (index, controlInfo){
					self.controlPanels[controlPanel.position].addControl(controlInfo);
				});
			}
		});
	}
	
	function ControlPanel(info){
		this.controlPanelId = 'control-panel-' + info.position;
		this.panelHtml = info.panelHtml;
		this.position = info.position;
		this.IsOpen = ko.observable(false);	
		this.controls = ko.observableArray();
		
		this.toggleControlPanel = function(){
			var side;
			
			if (this.position == 'top-right' || this.position == 'bottom-right' ){
				side = 'left'
			}
			else{
				side = 'right';
			}
			
			var $controlPanel =  $('#' + this.controlPanelId + ' .control-panel');
			
			if (this.IsOpen()){
				var $controlArea = $('#' + this.controlPanelId + ' .control-area');
				var width = $controlArea.css('width');
				$controlPanel.css(side, width);
				this.IsOpen(false);
			}
			else {
				$controlPanel.css(side, 0);
				this.IsOpen(true);
			}
		}
		
		this.selectControl = function(controlId){
			var selectedControl;
			var controls = this.controls();
			if (!controlId && controls.length > 0){
				selectedControl = controls[0]
			}
			
			
			for (var i = 0; i < controls.length; i++){
				if (controls[i].controlId == controlId){
						selectedControl = controls[i];
						break;
				}
			}
			
			if(selectedControl){
				var $controlBody = $('#' + this.controlPanelId + ' .control-area .body');
				$controlBody.empty();
				var $control = $('<div></div>');
				$control.append(selectedControl.controlHtml);
				$controlBody.append($control[0]);
				ko.applyBindings(selectedControl, $control[0]);
			}
		}
		
		this.addControl = function(controlInfo){
			var control = self.controlService.get(controlInfo)
			this.controls.push(control);
		}	
	}
	
	ControlPanel.prototype.onAdd = function (map){
		var $container = $('<div id="' + this.controlPanelId + '"></div>')
		$container.append(this.panelHtml);
		this._container = $container[0];
		this._map = map;
		return this._container;
	}
	

	ControlPanel.prototype.onRemove = function() {
		this._container.parentNode.removeChild(this._container);
		this._map = undefined;
	}
}