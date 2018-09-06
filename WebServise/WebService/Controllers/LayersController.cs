using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using MapDAL;

namespace WebService.Controllers
{
    public class LayersController : ApiController
    {
        // GET: api/Layers
        public IEnumerable<string> Get()
        {
            var factory = new MapDALFactory();
            var dal = factory.Create();
            var str = dal.Test();
            return new string[] { "value1", "value2", str };
        }

        // GET: api/Layers/5
        public string Get(string layerId)
        {
            return "value";
        }
    }
}
