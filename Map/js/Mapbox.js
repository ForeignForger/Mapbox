function Mapbox(){
	var self = this;
	self.map = null;	
	self.settings = {
		containerId: 'mapbox',
		layersJsonContainerId: 'mapbox-layers-json',
		style: 'mapbox://styles/groond/cjguv5eo300352smn4qyyf1l3',
		zoom: 3,
		center: [50, 50],
	};
	self.controls = {};
	

	self.run = function run(settings){
		updateSettings(self.settings)
		setToken();
		
		self.map = new mapboxgl.Map({
			container: self.settings.containerId,
			style: self.settings.style,
			zoom: self.settings.zoom,
			center: self.settings.center,
		});
		
		self.map.on('load', function () {
			init();
		});	
	};
	
	function updateSettings(newSettings){
		if(!newSettings){
			return;
		}
		
		self.settings.containerId = newSettings.containerId || self.settings.containerId;
		self.settings.style = newSettings.style || self.settings.style;
		self.settings.zoom = newSettings.zoom || self.settings.zoom;
		self.settings.center = newSettings.center || self.settings.center;
	}
	
	function setToken(){
		mapboxgl.accessToken = 'pk.eyJ1IjoiZ3Jvb25kIiwiYSI6ImNqZHZ3dXpwdzA1cmkzMHFsa2N5OHRkZjMifQ.kxcUljYPNnJF35paLmZKSw';
	}
	
	function init(){
		if(self.map){
			var keys = addLayers();
			//addControls(keys); переписать логику инициализации контроллеров
			//ko.applyBindings(self.controls);
		}
	}
	
	function addLayers(){
		var layerService = new LayerService(self.map);
		var keys = layerService.addLayers(self.settings.layersJsonContainerId);
		return keys;
	}
	
	function addControls(){
		self.controls = getControls(self.settings.containerId);
		var cntrls = self.controls();
		 
		for (var i = 0; cntrls && i < cntrls.length; i++){
			self.map.addControl(cntrls[i], cntrls[i].position);
		}
	}
}
