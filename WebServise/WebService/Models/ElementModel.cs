using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MapDAL.Entities;

namespace WebService.Models
{
    public class ElementModel
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public static explicit operator ElementModel(Element element)
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