--here will be inserted all data
USE MapboxDb;
GO
--layers
INSERT INTO map.Layers (StringId, MetadataOnly, [Type], Source, popUpTemplate, LayerName, [Order])
VALUES ('mcd-stations', 1, NULL, NULL, '<div class=''popup station-popup''><div class=''popup-header''><div class=''popup-icon''><img data-bind=''attr: {src: icon.url}''></img></div><div class=''popup-title'' data-bind=''text: title''></div></div><div class=''popup-body''><div id=''mcd-stations-carousel'' class=''owl-carousel images'' data-bind=''foreach: images''><div class= ''image''><img data-bind=''attr: { src: url}''></img></div></div><div class=''time-table''><div class=''time-table-header''><div class=''column column-title''>Маршрут</div><div class=''column column-title''>Промежутки</div></div><div class=''list'' data-bind=''foreach: timeTable.list''><div class=''row''><div class=''column column-value'' data-bind=''text: train''></div><div class=''column column-value'' data-bind=''text: timeSpan + measure ''></div></div></div></div><div class=''info'' data-bind=''text: info''></div></div></div>',
	  'Станции', 3),
	  ('mcd-station-names', 1, NULL, NULL, NULL, 'Название станции', 2),
	  ('mcd-station-platforms', 1, NULL, NULL, NULL, 'Платформы', 1),
	  ('mcd-station-infrastructures', 1, 'symbol', '{"type": "geojson","data": {"type": "FeatureCollection","features": []}}', NULL, 'Инфраструктура', 1),
	  ('mcd-roads', 1, NULL, NULL, NULL, 'Дороги', 2),
	  ('moscow', 1, NULL, NULL, NULL, 'Административные округа', 0),
	  ('mcd', 1, 'symbol', '{"type": "geojson","data": {"type": "FeatureCollection","features": []}}', NULL, 'Схема Московских МЦД', 0);

--childLayers
       
--controlPanels

--controls