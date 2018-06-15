function ControlPanelService(map, info){
	var self = this;
	self._map = map;
	self.info = info;
	self.controlPanels = {};
	self.controlService = new ControlService(self._map);
	
	self.addControlPanelsAtMap = function(){
		initControlPanels();
		$.each(self.controlPanels, function(index, controlPanel){
			self._map.addControl(controlPanel, controlPanel.position);		
			controlPanel.applyPanelBindings();
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
		var panel = this;
		panel.controlPanelId = 'control-panel-' + info.position;
		panel.panelHtml = info.panelHtml;
		panel.position = info.position;
		panel.IsOpen = ko.observable(true);
		panel.IsControlListOpen = ko.observable(false);
		panel.controls = ko.observableArray();
		panel.selectedControl = undefined;
		
		panel.toggleControlPanel = function(){
			var side;
			
			if (panel.position == 'top-right' || panel.position == 'bottom-right' ){
				side = '';
			}
			else{
				side = '-';
			}
			
			var $controlPanel =  $('#' + panel.controlPanelId + ' .control-panel');
			
			if (panel.IsOpen()){
				var $controlArea = $('#' + panel.controlPanelId + ' .control-area');
				var width = $controlArea.css('width');
				$controlPanel.css('left', side + width);
				panel.IsOpen(false);
			}
			else {
				$controlPanel.css('left', 0);
				panel.IsOpen(true);
			}
		}
		
		panel.toggleControlList = function(){
			panel.IsControlListOpen(!panel.IsControlListOpen());
		}
		panel.applyPanelBindings = function(controlModel){
			var control = controlModel
			var $panel = $('#' + panel.controlPanelId);
			ko.cleanNode($panel[0]);
			$panel.empty();
			$panel.append(panel.panelHtml);
			
			if (!control && panel.controls && panel.controls() && panel.controls().length > 0){
				control = panel.controls()[0];
			}
			
			var $controlBody = $panel.children('.control-panel').children('.control-area').children('.body');
			$controlBody.append(control.controlHtml);
			panel.selectedControl = ko.observable(control);
			ko.applyBindings(panel, $panel[0]);

		}
		
		panel.selectControl = function(controlId){
			var controls = panel.controls();
			for (var i = 0; i < controls.length; i++){
				if (controls[i].controlId == controlId){
					if (panel.selectedControl){
						if (panel.selectedControl().controlId() != controlId()){
							panel.applyPanelBindings(controls[i]);
							panel.IsControlListOpen(false);
						}
						else{
							break;
						}
					}
					else{
						panel.applyPanelBindings(controls[i]);
						panel.IsControlListOpen(false);
					}
				}
			}
		}
		
		panel.addControl = function(controlInfo){
			var control = self.controlService.get(controlInfo)
			panel.controls.push(control);
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