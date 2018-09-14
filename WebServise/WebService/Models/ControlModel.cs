using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MapDAL.Entities;


namespace WebService.Models
{
    public class ControlModel
    {
        public string ControlId { get; set; }

        public string ControlTemplate { get; set; }

        public string ControlName { get; set; }

        public string ControlData { get; set; }

        public static explicit operator ControlModel(Control control)
        {
            var model = new ControlModel() {
                ControlId = control.StringId,
                ControlTemplate = control.ControlTemplate,
                ControlName = control.ControlName,
                ControlData = control.ControlData
            };

            return model;
        }
    }
}