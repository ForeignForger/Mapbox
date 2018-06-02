function ImagesService(){
	var self = this;
	var dircetory = getDirectory();
	
	self.getImage = function(data){
		return new Image(data);
	};
	
	self.getIcon = function(name){
		var img = new Image();
		img.url = getDirectory() + name + "-icon.png";
		return img;
	};
	
	function Image(data){
		this.url = getDefaultUrl();
		if(data){
			this.url = data.url;
		}
		
	}
	
	function getDefaultUrl(){
		return dircetory + "default-image.png";
	}
	
	function getDirectory(){
		return "content/images/"
	}
}