using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace WebService.Models
{
    public class ControlModel
    {
        [JsonProperty(PropertyName = "controlId")]
        public string ControlId { get; set; }

        [JsonProperty(PropertyName = "controlHtml")]
        public string ControlTemplate { get; set; }

        [JsonProperty(PropertyName = "controlName")]
        public string ControlName { get; set; }

        [JsonProperty(PropertyName = "controlData")]
        [JsonConverter(typeof(RawJsonConverter))]
        public string ControlData { get; set; }

        public static explicit operator ControlModel(MapDAL.Entities.Control control)
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