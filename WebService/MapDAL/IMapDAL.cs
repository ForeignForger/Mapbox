using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MapDAL.Entities;

namespace MapDAL
{
    public interface IMapDAL
    {
        List<Layer> GetLayers();

        List<ControlPanel> GetControlPanels();
    }
}
