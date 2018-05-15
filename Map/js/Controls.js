//Создадим панель контроллеров, каждый из контроллеров в отдельной вкладке, так же есть кнопка скрывающаяя все контроллеры
function ControlService(map, info){
	var self = this;
	self.map = map;
	self.info = info;
	self.controlPanels = {};
	
	self.addControls = function(){
		$.each(self.info.controls, function(index, controlInfo){
			var control = new Control(controlInfo); //инициализация контрола, добавление на карту, аплай биндинг
		});
		
	}
	
	function Control(controlElementId, obs, position)
	{
		this.self = this;
		this.controlId = ko.observable(controlElementId);
		this.position = position;
		this.IsOpen = ko.observable(false);
		/* убрать от сюда. 
		this.openCloseControl = function (blockId){
			var side; //какой параметр менять
			if (this.position == 'top-right' || this.position == 'bottom-right' ){
				side = 'left'
			}
			else{
				side = 'right';
			}

			if (this.IsOpen()){
				var width = $('#' + blockId).css('width');
				$('#' + blockId).css(side, width);
				this.IsOpen(false);
			}
			else {
				$('#' + blockId).css(side, 0);
				this.IsOpen(true);
			}
		};
		*/
		this.ToggleLayer = function(layerId){
			
			if(this._map && this._map.getLayer(layerId)){
				var visibility = this._map.getLayoutProperty(layerId, 'visibility');

				if (visibility == 'visible') {
					this._map.setLayoutProperty(layerId, 'visibility', 'none');
				} else {
					this._map.setLayoutProperty(layerId, 'visibility', 'visible');
				}
				
				this._map.setLayoutProperty(layerId, 'visibility', this._map.getLayoutProperty(layerId, 'visibility'));
			}
		}
		
	}
	
	Control.prototype.onAdd = function (map){
		this._map = map;
		var $container = $(document.createElement('div'));
		$container.attr('id', this.controlId());
		$container.attr('data-bind', 'template: { data: ' + this.obs + ', name: "' + this.controlId() + '-script' + '"}');
		this._container = $container[0];
		this._container.className = 'mapboxgl-ctrl';
		return this._container;
	}

	Control.prototype.onRemove = function() {
		this._container.parentNode.removeChild(this._container);
		this._map = undefined;
	}

}


