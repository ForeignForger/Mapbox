using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebService.Models
{
    public class LayerMetadataModel
    {
        public List<ElementModel> Elements { get; set; }

        public string PopupTemplate { get; set; }

        public string LayerName { get; set; }

        public int LayerOrder { get; set; }

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