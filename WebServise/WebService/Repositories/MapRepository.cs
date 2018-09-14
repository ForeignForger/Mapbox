using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MapDAL;
using WebService.Models;

namespace WebService.Repositories
{
    public class MapRepository
    {
        private IMapDAL dal;

        public MapRepository()
        {
            var factory = new MapDALFactory();
            dal = factory.Create();
        }

        public List<LayerModel> GetLayers()
        {
            var layers = dal.GetLayers().Select(l => (LayerModel)l).ToList();
            return layers;
        }

        public List<ControlPanelModel> GetControlPanels()
        {
            var panels = dal.GetControlPanels().Select(cp => (ControlPanelModel)cp).ToList();
            return panels;
        }
    }
}