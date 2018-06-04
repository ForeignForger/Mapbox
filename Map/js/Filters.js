function FilterService(){
	var self = this;
	
	self.getFilter = function(action, property, value){
		return new Filter(action, property, value);
	}
	
	function Filter(action, property, value){
		this.action = action;
		this.property = property;
		this.value = value;
		this.IsFilter = true;
		
		this.get = function (){
			return this.value !== undefined ? [this.action, this.property, this.value] : [this.action, this.property];
		};
		
		this.Equals = function(filter){
			return filter && this.action === filter.action && this.property === filter.property && (this.value === filter.value || this.value === undefined && filter.value === undefined);
		};
	}
	
	self.getUniteFilter = function(action, filters){
		return new UniteFilter(action, filters);
	}
	
	function UniteFilter(action, filters){
		this.action = action;
		this.filters = [];
		
		this.addFilter = function(filter){
			if (filter.IsFilter){
				this.filters.push(filter);
			}
			else{
					if (Array.isArray(filter[filter.length - 1])){
						this.filters.push(new UniteFilter(filter[0], filter.slice(1)));
					}
					else{
						this.filters.push(new Filter(filter[0], filter[1], filter[2]));
					}
			}
			
		};
		
		if(filters){
			for (var i = 0; i < filters.length; i++){
				this.addFilter(filters[i]);
			}
		}
		
		this.IsFilter = true;
		this.IsUniteFilter = true;
		
		this.get = function(){
			var filters = [];
			
			for (var i = 0; i < this.filters.length; i++){
					filters.push(this.filters[i].get());
			}
			
			return [this.action].concat(filters);
		};
		

		
		this.removeFilter = function(filter){
			var filters = [];
			
			for (var i = 0; i < this.filters.length; i++){
				if (!this.filters[i].Equals(filter)){
					filters.push(this.filters[i]);
				}
			}
			
			this.filters = filters;
		}
		
		this.Equals = function(filter){
			if(!filter || !filter.IsUniteFilter || filter.action != this.action || filter.filters.length != this.filters.length){
				return false;
			}
			
			var otherFilters = filter.filters.slice(0);
			for (var i = 0; i < this.filters.length; i++){
				var filter = this.filters[i];
				
				for (var j = 0; j < otherFilters.length; j++){
					if (otherFilters[j].Equals(filter)){
						otherFilters.splice(j, 1);
						break;
					}
				}
			}
			
			return otherFilters.length === 0;
		};
	}
}
