using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Common;

namespace MapDAL.Entities
{
    public class Layer: MapDALEntity
    {
        public int Id { get; set; }

        public string StringId { get; set; }

        public bool MetadataOnly { get; set; }

        public string Type { get; set; }

        public string Source { get; set; }

        public string PopupTemplate { get; set; }

        public string LayerName { get; set; }

        public int Order { get; set; }

        public override void MapData(DbDataReader reader)
        {
            this.Id = (int)reader["Id"];
            this.StringId = (string)reader["StringId"];
            this.MetadataOnly = (bool)reader["MetadataOnly"];//100% wrong maybe need to convert to bit and then to bool, dunno
            this.Type = ConvertToString(reader["Type"]);
            this.Source = ConvertToString(reader["Source"]);
            this.PopupTemplate = ConvertToString(reader["PopupTemplate"]);
            this.LayerName = (string)reader["LayerName"];
            this.Order = (int)reader["Order"];
        }
    }
}
