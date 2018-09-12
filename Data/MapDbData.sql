--!!!Warning!!!
--EXISTING DATA IN DATABASE WILL BE DELETED AND REPLACED BY THIS SCRIPT

USE MapboxDb;
GO 
BEGIN TRANSACTION T
DELETE FROM map.LayerElements;

DELETE FROM map.[Elements]

DELETE FROM map.LayerChildLayers;

DELETE FROM map.Layers;
DBCC CHECKIDENT ('map.Layers', RESEED, 0); 

DELETE FROM map.ControlPanelControls

DELETE FROM map.Controls;
DBCC CHECKIDENT ('map.Controls', RESEED, 0); 

DELETE FROM map.ControlPanels;
DBCC CHECKIDENT ('map.ControlPanels', RESEED, 0); 

--layers
INSERT INTO map.Layers (StringId, MetadataOnly, [Type], Source, PopupTemplate, LayerName, [Order])
VALUES ('mcd-stations', 1, NULL, NULL, N'<div class=''popup station-popup''><div class=''popup-header''><div class=''popup-icon''><img data-bind=''attr: {src: icon.url}''></img></div><div class=''popup-title'' data-bind=''text: title''></div></div><div class=''popup-body''><div id=''mcd-stations-carousel'' class=''owl-carousel images'' data-bind=''foreach: images''><div class= ''image''><img data-bind=''attr: { src: url}''></img></div></div><div class=''time-table''><div class=''time-table-header''><div class=''column column-title''>Маршрут</div><div class=''column column-title''>Промежутки</div></div><div class=''list'' data-bind=''foreach: timeTable.list''><div class=''row''><div class=''column column-value'' data-bind=''text: train''></div><div class=''column column-value'' data-bind=''text: timeSpan + measure ''></div></div></div></div><div class=''info'' data-bind=''text: info''></div></div></div>',
	  'Станции', 3),
	  ('mcd-station-names', 1, NULL, NULL, NULL, N'Название станции', 2),
	  ('mcd-station-platforms', 1, NULL, NULL, NULL, N'Платформы', 1),
	  ('mcd-station-infrastructures', 1, 'symbol', N'{"type": "geojson","data": {"type": "FeatureCollection","features": []}}', NULL, N'Инфраструктура', 1),
	  ('mcd-roads', 1, NULL, NULL, NULL, N'Дороги', 2),
	  ('moscow', 1, NULL, NULL, NULL, N'Административные округа', 0),
	  ('mcd', 1, 'symbol', N'{"type": "geojson","data": {"type": "FeatureCollection","features": []}}', NULL, N'Схема Московских МЦД', 0);

--childLayers
INSERT INTO map.LayerChildLayers (LayerId, ChildLayerStringId)
VALUES (7, 'mcd-roads'), (7, 'mcd-moscow'), (7, 'mcd-station'),
	(1, 'mcd-station-names'), (1, 'mcd-station-infrastructures'),
	(4, 'mcd-station-platforms');

--Elements
INSERT INTO map.[Elements] (Id, Name)
VALUES ('mcd1', N'МЦД1, Одинцово — Лобня'),
	('mcd2', N'МЦД2, Нахабино — Подольск');


--layer elements
INSERT INTO map.LayerElements (LayerId, ElementId)
VALUES (7, 'mcd1'), (7, 'mcd2');

--controlPanels
INSERT INTO map.ControlPanels (Position, PanelTemplate)
VALUES ('top-right', N'<div class=''control-panel top-right'' onselectstart=''return false''><div class=''toggle control-panel-toggle'' data-bind=''click: toggleControlPanel, css: { open: IsOpen() }''></div><div class=''control-area''><div class= ''head''><div><div class=''control-name'' data-bind=''click: toggleControlList''><span data-bind=''text:selectedControl().controlName''></span></div><ul class=''control-list'' data-bind=''foreach: controls, css: {open: IsControlListOpen}''><!-- ko if: $parents[0].selectedControl().controlId != controlId--><li class=''control-list-element'' data-bind=''text: controlName, click: $parents[0].selectControl.bind($element[0], controlId)''></option><!-- /ko --></ul></div></div><div class=''body'' data-bind=''with: selectedControl''></div></div></div>');

--controls
INSERT INTO map.Controls (StringId, ControlTemplate, ControlName, ControlData)
VALUES ('main-control', 
	N'<div class=''main-control''><div class=''control-head''><div class=''toggle layer-toggle'' data-bind=''css: { shown: layers[mainLayer.layerId].IsLayerShown()}, click: showHideLayer.bind(null, $data, mainLayer.layerId)''></div><span class=''layer-name'' data-bind=''text: mainLayer.layerName, click: showHideLayerMenu.bind(null, $data, mainLayer.layerId), css: {active: layers[mainLayer.layerId].isLayerActive()}''></span></div><div class=''control-body'' data-bind=''visible: layers[mainLayer.layerId].IsLayerShown() && layers[mainLayer.layerId].IsLayerMenuShown()''><ul class=''element-list'' data-bind=''foreach: mainLayer.elements''><li class=''element''><div class=''toggle element-toggle'' data-bind=''css: { shown:  $parent.layers[$parent.mainLayer.layerId].elements[elementId].IsElementShown() }, click: $parent.toggleElementFilter.bind(null, $parent, elementId, $parent.mainLayer.layerId)''></div><span class=''element-name'' data-bind=''text: elementName''></span></li></ul><div class=''layer-list'' data-bind=''foreach: mainLayer.childLayerObjects''><div class=''layer''><div class=''layer-head''><div class=''toggle layer-toggle'' data-bind=''css: { shown: $parent.layers[layerId].IsLayerShown() }, click: $parent.showHideLayer.bind(null, $parent, layerId)''></div><span class=''layer-name'' data-bind=''text: layerName, click: $parent.showHideLayerMenu.bind(null, $parent, layerId), css: {active:  $parent.layers[layerId].isLayerActive()}''></span></div><div class=''layer-body'' data-bind=''visible: $parent.layers[layerId].IsLayerShown() && $parent.layers[layerId].IsLayerMenuShown()''><ul class=''child-layer-list'' data-bind=''foreach: childLayerObjects''><li class=''child-layer''><div class=''toggle layer-toggle'' data-bind=''css: { shown: $parents[1].layers[layerId].IsLayerShown() }, click: $parents[1].showHideLayer.bind(null, $parents[1], layerId)''></div><span class=''layer-name'' data-bind=''text: layerName''></span></li></ul></div></div></div></div></div>',
	N'Главный котроллер',
	N'{layerId": "mcd"}'),
	('time-line-control', 
	N'<div class=''time-line-control''><div class=''container'' data-bind=''style: {height: controlHeight}''><input class=''time-input'' type=''range'' min=''0'' step=''0.01'' data-bind=''value: currentStep, event: { change: changeYear.bind($data) },attr: {max: years().length - 1}, style: {width: controlHeight}''/><div class=''year-list'' data-bind=''foreach: years, style: {left: -1 * ((years().length - 2) * oneYearHeight)}''><div class=''year'' data-bind=''text: value, css: { active: IsSelected}''></div></div></div></div>',
	N'Фильтрация по времени',
	N'{layerId": "mcd", "years": [2008, 2009, 2010, 2011]}');

--controlPanelControls
INSERT INTO map.ControlPanelControls (ControlPanelId, ControlId)
VALUES (1, 1), (1, 2);

COMMIT TRANSACTION T
