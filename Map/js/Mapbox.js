function Mapbox(){
	var self = this;
	var map = null;	
	var settings = {
		containerId: 'mapbox',
		layersJsonContainerId: 'mapbox-layers-json',
		style: 'mapbox://styles/groond/cji09walv4c4g2sla9irb1790',
		zoom: 10,
		center: [37.618423, 55.751244],
		accessToken: 'pk.eyJ1IjoiZ3Jvb25kIiwiYSI6ImNqZHZ3dXpwdzA1cmkzMHFsa2N5OHRkZjMifQ.kxcUljYPNnJF35paLmZKSw',
	};
	

	self.run = function run(mapContainerId){
		settings.containerId = mapContainerId || settings.containerId;
		prepareContainer();
		setToken();
		
		map = new mapboxgl.Map({
			container: settings.containerId,
			style: settings.style,
			zoom: settings.zoom,
			center: settings.center,
		});
		
		map.on('load', function () {
			init();
		});	
	};
	
	function prepareContainer(){
		settings
	}
	
	function setToken(){
		mapboxgl.accessToken = settings.accessToken;
	}
	
	function init(){
		if(map){
			var layerService = initLayerService();
			addControls(layerService);
		}
	}
	
	function initLayerService(){
		var layerService = new services.layerService(map, new services.filterService(), new services.layerPopupService(new services.imagesService()));
		layerService.init(settings.layersJsonContainerId);
		return layerService;
	}
	
	function addControls(layerService){
		map.addControl(new mapboxgl.FullscreenControl(), "bottom-right");
		map.addControl(new mapboxgl.NavigationControl(), "top-left");
		var controlPanelService = new services.controlPanelService(map, layerService.getInfo(), new services.controlService(map, layerService, new services.filterService()));
		controlPanelService.addControlPanelsAtMap();
	}
	
	var services = {
		imagesService: function ImagesService(){
			var imgS = this;
			
			imgS.getImage = function(data){
				return new Image(data);
			};
			
			function Image(data){
				this.url = getDefaultUrl();
				if(data){
					this.url = data.url;
				}
				
			}
			
			function getDefaultUrl(){
				return "content/images/" + "default-image.png";
			}
		},
		
		layerService: function LayerService(map, filterService, layerPopupService){
			var layerS = this;
			var filterService = filterService;
			var layerPopupService = layerPopupService;
			var info = null;
			layerS._map = map;
			
			layerS.init = function(jsonElementId){
				if (layerS._map){
					var layersJson = getMainJson(jsonElementId);
					
					if (layersJson){
						var jsonObj = JSON.parse(layersJson);
						
						$.each(jsonObj.layers,function(index, value){
							addLayer(value)
							addEvents(value.id);
						});
						
						updateLayersPosition(jsonObj.layers);
						info = jsonObj.info;
					}
				}
			};
			
			layerS.getInfo = function(){
				var clone = $.extend({}, info);
				return clone; 
			};
			
			function getMainJson(jsonElementId){
				return $('#' + jsonElementId).html();
			}
			
			function addLayer(value){
				if (value.metadataOnly){
					var layer = layerS._map.getLayer(value.id);
					
					if(layer){
						layer.metadata = value.metadata;
					}
				}
				else{
					layerS._map.addLayer(value);
				}
			}
			
			function addEvents(layerId){
				var layer = layerS._map.getLayer(layerId);
				if (layer && layer.metadata.popupHtml){
					map.on('click', layerId, function (e) {
						var coordinates = e.features[0].geometry.coordinates.slice();
						if (!coordinates || coordinates.length != 2 || coordinates[0].length || coordinates[1].length){
							coordinates = e.lngLat;
						}
						var layer = layerS._map.getLayer(layerId);
						var popupData = layerPopupService.getLayerPopup(layerId, JSON.parse(e.features[0].properties.popupData));
						var popupId = 'map-box-popupId';
						var popupHtml = '<div id="' + popupId + '">' + layer.metadata.popupHtml + '</div>';
						
						while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
							coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
						}
						
						if($('#' + popupId)[0]){
							return;
						}
						
						new mapboxgl.Popup()
							.setLngLat(coordinates)
							.setHTML(popupHtml)
							.addTo(map);
						
						popupData.initialize(function (){
							ko.applyBindings(popupData, $('#' + popupId)[0])
						});
					});
					layerS._map.on('mouseenter', layerId, function () {
						map.getCanvas().style.cursor = 'pointer';
					});

					layerS._map.on('mouseleave', layerId, function () {
						map.getCanvas().style.cursor = '';
					});
				}
			}
			
			function updateLayersPosition(layersJson){
				var roots = findRoots(layersJson);
				
				for (var i = 0; i < roots.length; i++){
					var order = layerS.getLayersOrder(roots[i]);
					if(order && order.length){
						layerS._map.moveLayer(order[order.length - 1]);
						for(var j = order.length - 2; j >= 0; j--){
							layerS._map.moveLayer(order[j], order[j + 1])
						}
					}
				}
			}
			
			function findRoots(layersJson){
				var roots = [];
				
				for (var i = 0; i < layersJson.length; i++){
					if (!layersJson[i].metadata.parentLayers || !layersJson[i].metadata.parentLayers.length){
						roots.push(layersJson[i].id);
					}
				}
				
				return roots;
			}
			
			layerS.getLayersOrder = function(rootId){
				var result = [];
				var lastLayerId;
				var obj = layerS.getLayerObject(rootId);
				
				if (obj){	
					result.push(rootId);
					obj.childLayers.sort(function(a, b){
						var aObj = layerS.getLayerObject(a);
						var bObj = layerS.getLayerObject(b);
						aObj = aObj && aObj.level ? aObj.level : undefined;
						bObj = bObj && bObj.level ? bObj.level : undefined;
						
						if (aObj && !bObj){
							return 1;
						}
						
						if (!aObj && bObj){
							return -1;
						}
						
						if (!aObj && !bObj){
							return 0;
						}
						
						if (aObj.order){
							if(bObj.order){
								if (aObj.order > bObj.order){
									return 1;
								}
								if (aObj.order < bObj.order){
									return -1;
								}
								return 0;
							}
							
							return 1;
						}
						
						if (bObj.order){
							return -1;
						}
						
						return 0;
					});
					
					for (var i = 0; i < obj.childLayers.length; i++){
						result = result.concat(layerS.getLayersOrder(obj.childLayers[i]));
					}
				}
				
				return result;
			}
			
			layerS.getLayerObjectTree = function(rootLayerId){
				var result = layerS.getLayerObject(rootLayerId);
				if(result){	
					result.childLayerObjects = [];
					$.each(result.childLayers, function (index, layerId){
						var obj = layerS.getLayerObjectTree(layerId);
						if(obj){
							result.childLayerObjects.push(obj);
						}
					});
					
					return result;
				}
				
				return undefined;
			};
			
			layerS.getLayerObject = function(layerId){
				var layer = layerS._map.getLayer(layerId);
				
				if(layer && layer.metadata){
					layer.metadata.layerId = layerId;
					return layer.metadata;
				}
				
				return undefined;
			};
			
			layerS.getLayer = function(layerId){
				var layer = layerS._map.getLayer(layerId);
				
				if(layer){
					return layer;
				}
				
				return undefined;
			};
			
			layerS.updateTreeVisiblity = function(layerId, layersInfo){
				if (!layersInfo[layerId]){
					return;
				}
				var obj = layerS.getLayerObject(layerId);
				
				if(obj){
					if(layersInfo[obj.layerId] && layersInfo[obj.layerId].IsLayerShown()){
						showLayer(obj.layerId);
					}else{
						layerS.hideLayerTree(obj.layerId);
						return;
					}
					
					for (var i = 0; i < obj.childLayers.length; i++){
						layerS.updateTreeVisiblity(obj.childLayers[i], layersInfo);
					}
				}
			};
			
			layerS.hideLayerTree = function(layerId, only){
				var obj = layerS.getLayerObject(layerId);
				if(obj){
					hideLayer(obj.layerId);
					if (!only){
						for (var i = 0; i < obj.childLayers.length; i++){
							layerS.hideLayerTree(obj.childLayers[i], false);
						}
					}

				}
				
			}
			
			layerS.showLayerTree = function(layerId, only){
				var obj = layerS.getLayerObject(layerId);
				if(obj){
					showLayer(obj.layerId);
					if (!only){
						for (var i = 0; i < obj.childLayers.length; i++){
							layerS.showLayerTree(obj.childLayers[i], false);
						}
					}
				}
			};
			
			layerS.isLayerVisible = function(layerId){
				var visibility = layerS._map.getLayoutProperty(layerId, 'visibility');
				return visibility === 'visible';
			};
			
			function hideLayer(layerId){
				layerS._map.setLayoutProperty(layerId, 'visibility', 'none');
			}
			
			function showLayer(layerId){
				layerS._map.setLayoutProperty(layerId, 'visibility', 'visible');
			}
			
			layerS.addFilter = function(layerId, filter){
				var obj = layerS.getLayerObject(layerId);
				
				if (obj){
					var oldFilter = layerS._map.getFilter(layerId);
					var uniteFilter;
					
					if (!oldFilter){
						uniteFilter = filterService.getUniteFilter("all", []);
					}
					else {
						uniteFilter = filterService.getUniteFilter(oldFilter[0], oldFilter.slice(1));
					}
					
					uniteFilter.addFilter(filter);
					
					layerS._map.setFilter(layerId, uniteFilter.get());
					
					for (var j = 0; j < obj.childLayers.length; j++){
						layerS.addFilter(obj.childLayers[j], filter);
					}
				}
			};
			
			layerS.removeFilter = function(layerId, filter){
				var obj = layerS.getLayerObject(layerId);
				
				if(obj){
					var oldFilter = layerS._map.getFilter(layerId);
					
					if (!oldFilter){
						return;
					}
					
					uniteFilter = filterService.getUniteFilter(oldFilter[0], oldFilter.slice(1))
					uniteFilter.removeFilter(filter);
					layerS._map.setFilter(layerId, uniteFilter.get());
					
					for (var j = 0; j < obj.childLayers.length; j++){
						layerS.removeFilter(obj.childLayers[j], filter);
					}
				}
			};
		},
		
		layerPopupService: function LayerPopupService(imagesService){
			var layerPS = this;
			var layerPopups = {};
			var imagesService = imagesService;
			
			layerPS.getLayerPopup = function(layerId, popupData){
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
				
				this.icon = imagesService.getImage({ url: "content/images/mcd-stations-icon.png" });//заменить на запрос иконки из метаданных слоя
				this.images = getImages(data.images);
				this.title = data.name;
				this.timeTable = getTimeTable(data.timeTable);
				this.info = data.text;
				this.initialize = function(add){
					add();
					if (this.images && this.images().length > 1){
						$('#' + layerId + '-carousel').owlCarousel({
							autoplay: true,
							autoplayTimeout: 2000,
							loop: true,
							margin: 0,
							nav: false,
							items: 1,
							dots: false
						});
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
		},
		
		controlPanelService: function ControlPanelService(map, info, controlService){
			var controlPS = this;
			controlPS._map = map;
			controlPS.info = info;
			controlPS.controlPanels = {};
			controlPS.controlService = controlService;
			
			controlPS.addControlPanelsAtMap = function(){
				initControlPanels();
				$.each(controlPS.controlPanels, function(index, controlPanel){
					controlPS._map.addControl(controlPanel, controlPanel.position);		
					controlPanel.applyPanelBindings();
				});
			}
			
			function initControlPanels(){
				$.each(controlPS.info.controlPanels, function(index, controlPanel){
					if (!controlPS.controlPanels[controlPanel.position]){
						controlPS.controlPanels[controlPanel.position] = new ControlPanel(controlPanel);
						$.each(controlPanel.controls, function (index, controlInfo){
							controlPS.controlPanels[controlPanel.position].addControl(controlInfo);
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
					var control = controlPS.controlService.get(controlInfo)
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
		},
		
		controlService: function ControlService(map, layerSrvice, filterService){
			var controlS = this;
			controlS._map = map;
			controlS.layerService = layerSrvice;
			controlS.filterService = filterService;
			var controlFunctionalityObjects = {};
			
			controlS.get = function(controlInfo){
				var defaultControl = new Control(controlInfo);
				var functionalityObject = getControlFunctionalityObject(controlInfo);
				if (functionalityObject){
					var control = $.extend(true, {}, defaultControl, functionalityObject)
					return control;
				}
				
				return defaultControl;
			}
			
			function Control(controlInfo)
			{
				this.flag = ko.observable(0);
				this.controlName = controlInfo.controlName;
				this._map = controlS._map;
				this.controlId = ko.observable(controlInfo.controlId);
				this.controlHtml = controlInfo.controlHtml;
				this.layerId = ko.observable(controlInfo.controlId);	
			}
			
			function getControlFunctionalityObject(controlInfo){
				if (controlFunctionalityObjects[controlInfo.controlId]){
					var obj  = new controlFunctionalityObjects[controlInfo.controlId](controlInfo);
					return obj;
				}
				
				return undefined;
			}
			
			controlFunctionalityObjects["main-control"] = function(controlInfo){
				this.mainLayer = controlS.layerService.getLayerObjectTree(controlInfo.controlData.layerId);
				this.layers = {};
				getLayersDictionary(this.mainLayer, this.layers);
				
				this.toggleElementFilter = function(control, elementId, layerId){
					var layer = control.layers[layerId];
					var element = layer.elements[elementId];
					var filters = getFilters(control, layerId ,elementId);
					
					if (element.IsElementShown()){
						for (var i = 0; i < filters.length; i++){
							controlS.layerService.addFilter(layerId, filters[i]);
						}
						
						element.IsElementShown(false);
					}
					else{
						for (var i = 0; i < filters.length; i++){
							controlS.layerService.removeFilter(layerId, filters[i]);
						}
						element.IsElementShown(true);
					}	
				}
				
				function getFilters(control, layerId, elementId){
					var result = [];
					var layer = control.layers[layerId];
					var elements = layer.elements;
					var ownerFilter = controlS.filterService.getFilter("!=", "ownerLayer", layerId);
					var elementFilters = [controlS.filterService.getFilter("!=", "ownerElement", elementId)];
					
					for (var key in elements){
						if (key != elementId && !elements[key].IsElementShown()){
							var el = elementId < elements[key].elementId ? elementId + ";" + key : key + ";" + elementId;
							elementFilters.push(controlS.filterService.getFilter("!=", "ownerElement", el));
						}
					}
					
					for (var i = 0; i < elementFilters.length; i++){
						result.push(controlS.filterService.getUniteFilter("any", [ownerFilter, elementFilters[i]]));
					}
					
					return result;
				}
				
				this.showHideLayer = function(control, layerId){
					 if (controlS.layerService.isLayerVisible(layerId)) {
						controlS.layerService.hideLayerTree(layerId, false);
						control.layers[layerId].IsLayerShown(false);
					 }
					 else{
						control.layers[layerId].IsLayerShown(true);
						controlS.layerService.updateTreeVisiblity(layerId, control.layers);
					 }
				
				
				};
				this.showHideLayerMenu = function(control, layerId){
					var layerInfo = control.layers[layerId];
					if (layerInfo && layerInfo.IsLayerShown()){
						layerInfo.IsLayerMenuShown(!layerInfo.IsLayerMenuShown());
					}
				};
				
				function getLayersDictionary(tree, result){
					result[tree.layerId] = new Layer(tree.layerId, tree.elements);
					
					for(var i = 0; i < tree.childLayerObjects.length; i++){
						getLayersDictionary(tree.childLayerObjects[i], result);
					}
				}
				
				function Layer(layerId, elements){
					var layer = this;
					layer.layerId = layerId;
					layer.IsLayerShown = ko.observable(controlS.layerService.isLayerVisible(layerId)),
					layer.IsLayerMenuShown = ko.observable(true);
					
					layer.isLayerActive = ko.computed(function(){
						var obj = controlS.layerService.getLayerObject(layer.layerId);
						return layer.IsLayerShown() && obj && (obj.elements && obj.elements.length || obj.childLayers && obj.childLayerObjects.length); //стоит убрать проверку на элементы или добавить эту функциональность дальше по уровням
						
					});
					
					layer.elements = getElementsDictionary(elements);
				}
				
				function getElementsDictionary(elements){
					var result = {};
					
					for(var i = 0; i < elements.length; i++){
						result[elements[i].elementId] = {
							IsElementShown: ko.observable(true),
						}
					}
					
					return result;
				}
			};
			
			controlFunctionalityObjects["time-line-control"] = function(controlInfo){
				this.measure = "px";
				this.oneYearHeight = 30;
				
				this.layerId = controlInfo.controlData.layerId;
				this.years = ko.observableArray(getYearsArray(controlInfo.controlData.years.sort().reverse()));
				this.controlHeight = ko.observable((this.years().length) * this.oneYearHeight + this.measure);
				this.currentStep = ko.observable(0);
				this.changeYear = function(){
					var years = this.years();
					if (years){
						removeFilters.call(this, years)
						selectYear.call(this, years);
						addFilters.call(this, years);
					}
				}
				
				function getYearsArray(years){
					var result = [];
					
					for(var i = 0; i < years.length; i++){
						result.push(new Year(years[i]))
					}
					
					return result;
				}
				
				function Year(year){
					this.value = ko.observable(year);
					this.IsSelected = ko.observable(false);
				}
				
				function selectYear(years){
					var step = Math.round(this.currentStep());

					if (!years[step].IsSelected()){
						for(var i = 0; i < years.length; i++){
							years[i].IsSelected(false);
						}
						
						years[step].IsSelected(true);
					}
				}
				
				function removeFilters(years){
					var filters = getFilters(years);
					
					for (var i = 0; i < filters.length; i++){
						controlS.layerService.removeFilter(this.layerId, filters[i]);
					}
				}
				
				function addFilters(years){
					var filters = getFilters(years);
					
					for (var i = 0; i < filters.length; i++){
						controlS.layerService.addFilter(this.layerId, filters[i]);
					}
				}
				function getFilters(years){
					var result = [];
					
					for (var i = 0; i < years.length; i++){
						if(years[i].IsSelected()){
							var filters = [];
							filters.push(controlS.filterService.getFilter("!has", "year"));
							filters.push(controlS.filterService.getFilter("<=", "year", years[i].value()));
							result.push(controlS.filterService.getUniteFilter("any", filters));
						}
					}
					
					return result;
				}
				
				this.changeYear();
			}
		},
		
		filterService: function FilterService(){
			var filterS = this;
			
			filterS.getFilter = function(action, property, value){
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
			
			filterS.getUniteFilter = function(action, filters){
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
	}
}
