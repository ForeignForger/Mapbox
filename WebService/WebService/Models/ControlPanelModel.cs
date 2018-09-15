using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace WebService.Models
{
    public class ControlPanelModel
    {
        [JsonProperty(PropertyName = "position")]
        public string Position { get; set; }

        [JsonProperty(PropertyName = "panelHtml")]
        public string PanelTemplate { get; set; }

        [JsonProperty(PropertyName = "controls")]
        public List<ControlModel> Controls { get; set; }

        public static explicit operator ControlPanelModel(MapDAL.Entities.ControlPanel panel)
        {
            var model = new ControlPanelModel()
            {
               Position = panel.Position,
               PanelTemplate = panel.PanelTemplate,
               Controls = panel.Controls.Select(c => (ControlModel)c).ToList()
            };

            return model;
        }
    }
}