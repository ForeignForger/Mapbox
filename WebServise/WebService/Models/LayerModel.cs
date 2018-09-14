using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebService.Models
{
    public class LayerModel
    {
        public string Id { get; set; }

        public bool MetadataOnly { get; set; }

        public string Type { get; set; }

        public string Source { get; set; }

        public LayerMetadataModel Metadata { get; set; }

        public static explicit operator LayerModel(MapDAL.Entities.Layer layer)
        {
            var model = new LayerModel()
            {
                Id = layer.StringId,
                MetadataOnly = layer.MetadataOnly,
                Type = layer.Type,
                Source = layer.Source,
                Metadata = (LayerMetadataModel)layer
            };

            return model;
        }
    }
}