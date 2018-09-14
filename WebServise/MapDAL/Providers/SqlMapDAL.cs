using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MapDAL.Entities;
using System.Data;
using System.Data.SqlClient;

namespace MapDAL.Providers
{
    public sealed class SqlMapDAL: IMapDAL
    {
        private MapDALHelper helper;

        public SqlMapDAL(MapDALHelper helper)
        {
            this.helper = helper;
        }

        public List<Layer> GetLayers()
        {
            string query = string.Format(@"SELECT Id, StringId, MetadataOnly, [Type], Source, PopupTemplate, LayerName, [Order] 
                            FROM map.Layers");

            using (var connection = helper.CreateConnection() as SqlConnection)
            {
                var list = new List<Layer>();
                var command = connection.CreateCommand();
                command.CommandType = CommandType.Text;
                command.CommandText = query;
                connection.Open();
                var reader = command.ExecuteReader();
                //connection.Close();
                while (reader.Read())
                {
                    var layer = new Layer();
                    if (layer.MapData(reader))
                    {
                        layer.Elements = GetLayerElements(layer.Id);
                        layer.ChildLayers = GetChildLayers(layer.Id);
                        list.Add(layer);
                    }                 
                }

                return list;
            }          
        }

        public List<ControlPanel> GetControlPanels()
        {
            string query = @"SELECT cp.Id [Id], cp.Position [Position], cp.PanelTemplate [PanelTemplate]
                            FROM map.ControlPanels cp";

            using (var connection = helper.CreateConnection() as SqlConnection)
            {
                var list = new List<ControlPanel>();
                var command = connection.CreateCommand();
                command.CommandType = CommandType.Text;
                command.CommandText = query;
                connection.Open();
                var reader = command.ExecuteReader();
                while (reader.Read())
                {
                    var controlPanel = new ControlPanel();
                    if (controlPanel.MapData(reader))
                    {
                        controlPanel.Controls = GetControlPanelControls(controlPanel.Id);
                        list.Add(controlPanel);
                    }
                }

                return list;
            }
        }

        public List<Element> GetLayerElements(int layerId)
        {
            string query = string.Format(@"SELECT e.Id [Id], e.Name [Name]
                            FROM map.Layers l
                            JOIN map.LayerElements le ON l.Id = le.LayerId AND l.Id = @LayerId
                            JOIN map.Elements e ON e.Id = le.ElementId");

            using (var connection = helper.CreateConnection() as SqlConnection)
            {
                var list = new List<Element>();
                var command = connection.CreateCommand();
                command.CommandType = CommandType.Text;
                AddParameter(command, "@LayerId", layerId);
                command.CommandText = query;
                connection.Open();
                var reader = command.ExecuteReader();

                while (reader.Read())
                {
                    var element = new Element();
                    if (element.MapData(reader))
                    {
                        list.Add(element);
                    }
                }

                return list;
            }
        }

        public List<Layer> GetChildLayers(int layerId, bool isRecursion = false)
        {
            string query = string.Format(@"SELECT l.Id [Id], l.StringId [StringId], l.MetadataOnly [MetadataOnly], l.[Type] [Type], l.Source [Source], l.PopupTemplate [PopupTemplate], l.LayerName [LayerName], l.[Order] [Order]
                            FROM map.Layers l
                            JOIN map.LayerChildLayers lcl ON l.Id = lcl.ChildLayerId AND lcl.LayerId = @LayerId");

            using (var connection = helper.CreateConnection() as SqlConnection)
            {
                var list = new List<Layer>();
                var command = connection.CreateCommand();
                command.CommandType = CommandType.Text;
                AddParameter(command, "@LayerId", layerId);
                command.CommandText = query;
                connection.Open();
                var reader = command.ExecuteReader();

                while (reader.Read())
                {
                    var layer = new Layer();
                    if (layer.MapData(reader))
                    {
                        if (isRecursion)
                        {
                            layer.Elements = GetLayerElements(layer.Id);
                            layer.ChildLayers = GetChildLayers(layer.Id);
                        }

                        list.Add(layer);
                    }
                }

                return list;
            }
        }

        public List<Control> GetControlPanelControls(int controlPanelId)
        {
            string query = string.Format(@"SELECT c.Id [Id], c.StringId [StringId], c.ControlTemplate [ControlTemplate], c.ControlName [ControlName], c.ControlData [ControlData]
                            FROM map.ControlPanels cp
                            JOIN map.ControlPanelControls cpc ON cp.Id = cpc.ControlPanelId AND cp.Id = @ControlPanelId
                            JOIN map.Controls c ON c.Id = cpc.ControlId");

            using (var connection = helper.CreateConnection() as SqlConnection)
            {
                var list = new List<Control>();
                var command = connection.CreateCommand();
                command.CommandType = CommandType.Text;
                AddParameter(command, "@ControlPanelId", controlPanelId);
                command.CommandText = query;
                connection.Open();
                var reader = command.ExecuteReader();

                while (reader.Read())
                {
                    var control = new Control();
                    if (control.MapData(reader))
                    {
                        list.Add(control);
                    }
                }

                return list;
            }
        }

        private void AddParameter(SqlCommand command, string name, object value)
        {
            var parameter = command.CreateParameter();
            parameter.ParameterName = name;
            parameter.Value = value ?? DBNull.Value;
            command.Parameters.Add(parameter);
        }
    }
}
