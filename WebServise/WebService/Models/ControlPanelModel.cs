using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MapDAL.Entities;

namespace WebService.Models
{
    public class ControlPanelModel
    {
        public string Position { get; set; }

        public string PanelTemplate { get; set; }

        public List<ControlModel> Controls { get; set; }

        public static explicit operator ControlPanelModel(ControlPanel panel)
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