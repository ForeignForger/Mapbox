using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace WebService.Models
{
    public class ElementModel
    {
        [JsonProperty(PropertyName = "elementId")]
        public string Id { get; set; }

        [JsonProperty(PropertyName = "elementName")]
        public string Name { get; set; }

        public static explicit operator ElementModel(MapDAL.Entities.Element element)
        {
            var model = new ElementModel()
            {
                Id = element.Id,
                Name = element.Name
            };

            return model;
        }
    }
}