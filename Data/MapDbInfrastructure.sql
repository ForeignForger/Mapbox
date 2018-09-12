USE master;
GO
CREATE DATABASE MapboxDb;
GO
USE MapboxDb;
GO
CREATE SCHEMA map;  
GO
BEGIN TRANSACTION T
--Tables with Layer info
CREATE TABLE map.Layers(Id INT NOT NULL IDENTITY(1,1), StringId VARCHAR(40) NOT NULL UNIQUE, MetadataOnly BIT NOT NULL, [Type] VARCHAR(20) NULL, Source NVARCHAR(MAX) NULL, PopupTemplate NVARCHAR(MAX) NULL, LayerName NVARCHAR(50) NOT NULL, [Order] INT NOT NULL,
	PRIMARY KEY(Id));

CREATE TABLE map.[Elements](Id VARCHAR(10) NOT NULL, Name NVARCHAR(50) NOT NULL, 
	PRIMARY KEY(Id));

CREATE TABLE map.LayerElements(LayerId INT NOT NULL, ElementId VARCHAR(10) NOT NULL, 
	PRIMARY KEY(LayerId, ElementId), 
	FOREIGN KEY(LayerId) REFERENCES map.Layers(Id));

CREATE TABLE map.LayerChildLayers(LayerId INT NOT NULL, ChildLayerStringId VARCHAR(40) NOT NULL,
	PRIMARY KEY(LayerId, ChildLayerStringId),
	FOREIGN KEY(LayerId) REFERENCES map.Layers(Id));

--Tables with ControlPanel Info

CREATE TABLE map.ControlPanels(Id INT NOT NULL IDENTITY(1,1), Position VARCHAR(15) NOT NULL, PanelTemplate NVARCHAR(MAX) NOT NULL, 
	PRIMARY KEY(Id));

CREATE TABLE map.Controls(Id INT NOT NULL IDENTITY(1,1), StringId VARCHAR(30) UNIQUE, ControlTemplate NVARCHAR(MAX) NOT NULL, ControlName NVARCHAR(50), ControlData NVARCHAR(MAX) NULL,
	PRIMARY KEY(Id));

CREATE TABLE map.ControlPanelControls(ControlPanelId INT NOT NULL, ControlId INT NOT NULL,
	PRIMARY KEY(ControlPanelId, ControlId),
	FOREIGN KEY(ControlPanelId) REFERENCES map.ControlPanels(Id),
	FOREIGN KEY(ControlId) REFERENCES map.Controls(Id))

COMMIT TRANSACTION T
