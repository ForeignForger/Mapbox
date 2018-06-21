function LayerPopupService(){
	var self = this;
	var layerPopups = {};
	
	self.getLayerPopup = function(layerId, popupData){
		if(layerPopups[layerId]){
			return new layerPopups[layerId](popupData);
		}
		
		popupData.initialize = defaultInitialize;
		return popupData;
	}
	
	function defaultInitialize(add){
		add();
	}
	
	layerPopups["mcd-stations"] = function(data){
		var layerId = "mcd-stations";
		var imagesService = new ImagesService();
		this.icon = imagesService.getIcon(layerId);
		this.images = getImages(data.images);
		this.title = data.name;
		this.timeTable = getTimeTable(data.timeTable);
		this.info = data.text;
		this.initialize = function(add){
			add();
			if (this.images && this.images().length > 1){
				initializeCaroulsel(layerId);
			}
		};
		
		function getImages(images){
			var result = ko.observableArray([]);
			if(!images || !images.length){
				result.push(imagesService.getImage());
			}
			else{
				for (var i = 0; i < images.length; i++){
					result.push(imagesService.getImage(images[i]));
				}
			}
		
			return result;
		}
		
		function getTimeTable(data){
			var result = {};
			result.list = ko.observableArray([]);
			
			if (data && data.length){
				for (var i = 0; i < data; i++){
					var el = {
						train: data.train,
						timeSpan: data.timeSpan.value,
						measure: data.timeSpan.measure
					};
					result.list.push(el);
				}
			}
			
			return result;
		}
	};
}