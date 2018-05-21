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
		this.controlPanelId = 'control-panel-' + info.position;
		this.panelHtml = info.panelHtml;
		this.position = info.position;
		this.IsOpen = ko.observable(false);	
		this.controls = ko.observableArray();
		this.selectedControl = undefined;
		
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
		
		this.applyPanelBindings = function(){
			if (!this.selectedControl && this.controls && this.controls() && this.controls().length > 0){
				this.selectedControl = ko.observable(this.controls()[0]);
			}
			
			if(this.selectedControl && this.selectedControl()){
					var $panel = $('#' + this.controlPanelId);
					var $controlArea = $panel.find('.control-area .body');
					$controlArea.empty();
					$controlArea.append(this.selectedControl().controlHtml);
					ko.cleanNode($panel[0]);
					ko.applyBindings(this, $panel[0]);
			}

		}
		
		this.selectControl = function(controlId){
			var controls = this.controls();
			var shouldApply = false;
			for (var i = 0; i < controls.length; i++){
				if (controls[i].controlId == controlId){
					if (this.selectedControl){
						if (this.selectedControl().controlId() != controlId()){
							this.selectedControl(controls[i]);
							shouldApply = true;
						}
						else{
							break;
						}
					}
					else{
						this.selectedControl = ko.observable(controls[i]);
						shouldApply = true;
					}
				}
			}
			
			if(this.selectedControl && shouldApply){
				this.applyPanelBindings();
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