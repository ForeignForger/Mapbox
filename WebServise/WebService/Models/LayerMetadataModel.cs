using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace WebService.Models
{
    public class LayerMetadataModel
    {
        [JsonProperty("elements")]
        public List<ElementModel> Elements { get; set; }

        [JsonProperty(PropertyName = "popupHtml")]
        public string PopupTemplate { get; set; }

        [JsonProperty(PropertyName = "layerName")]
        public string LayerName { get; set; }

        [JsonProperty(PropertyName = "layerOrder")]
        public int LayerOrder { get; set; }

        [JsonProperty(PropertyName = "childLayers")]
        public List<string> ChildLayers { get; set; }

        public static explicit operator LayerMetadataModel(MapDAL.Entities.Layer layer)
        {
            var model = new LayerMetadataModel()
            {
                Elements = layer.Elements.Select(e => (ElementModel)e).ToList(),
                PopupTemplate = layer.PopupTemplate,
                LayerName = layer.LayerName,
                LayerOrder = layer.Order,
                ChildLayers = layer.ChildLayers.Select(l => l.StringId).ToList()
            };

            return model;
        }
    }
}