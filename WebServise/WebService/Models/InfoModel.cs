using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace WebService.Models
{
    public class InfoModel
    {
        public InfoModel()
        {

        }

        public InfoModel(List<LayerModel> layers, List<ControlPanelModel> panels)
        {
            this.Layers = layers;
            this.ControlPanels = panels;
        }

        [JsonProperty(PropertyName = "layers")]
        public List<LayerModel> Layers { get; set; }

        [JsonProperty(PropertyName = "controlPanels")]
        public List<ControlPanelModel> ControlPanels { get; set; }
    }
}