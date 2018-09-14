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
        public const string prefix = "layer";

        public int Id { get; set; }

        public string StringId { get; set; }

        public bool MetadataOnly { get; set; }

        public string Type { get; set; }

        public string Source { get; set; }

        public string PopupTemplate { get; set; }

        public string LayerName { get; set; }

        public int Order { get; set; }

        public List<Layer> ChildLayers { get; set; }

        public List<Element> Elements { get; set; }

        public override bool IsEqualId(DbDataReader reader, string prefix)
        {
            var objId = ReadField<int>(reader, "Id", prefix);
            return this.Id == objId;
        }

        protected override void FillFields(DbDataReader reader, string prefix = "")
        {
            this.Id = ReadField<int>(reader, "Id", prefix);
            this.StringId = ReadField<string>(reader, "StringId", prefix);
            this.MetadataOnly = ReadField<bool>(reader, "MetadataOnly", prefix);
            this.Source = ReadNullbaleString(reader, "Source", prefix);
            this.PopupTemplate = ReadNullbaleString(reader, "PopupTemplate", prefix);
            this.LayerName = ReadField<string>(reader, "LayerName", prefix);
            this.Order = ReadField<int>(reader, "Order", prefix);
        }
    }
}
