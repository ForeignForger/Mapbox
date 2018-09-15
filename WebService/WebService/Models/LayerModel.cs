using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace WebService.Models
{
    public class LayerModel
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("metadataOnly")]
        public bool MetadataOnly { get; set; }

        [JsonProperty("type")]
        public string Type { get; set; }

        [JsonProperty(PropertyName = "source")]
        [JsonConverter(typeof(RawJsonConverter))]
        public string Source { get; set; }

        [JsonProperty(PropertyName = "metadata")]
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