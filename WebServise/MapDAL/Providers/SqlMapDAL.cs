using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MapDAL.Providers
{
    public class SqlMapDAL: IMapDAL
    {
        private MapDALHelper helper;

        public SqlMapDAL(MapDALHelper helper)
        {
            this.helper = helper;
        }
    }
}
