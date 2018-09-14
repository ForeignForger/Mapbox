using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

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

        public List<LayerModel> Layers { get; set; }

        public List<ControlPanelModel> ControlPanels { get; set; }
    }
}