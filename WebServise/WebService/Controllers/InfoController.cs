using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;
using MapDAL;
using Newtonsoft.Json;
using System.Net.Http.Formatting;

namespace WebService.Controllers
{
    public class InfoController : ApiController
    {
        public HttpResponseMessage Get()
        {        
            var factory = new MapDALFactory();
            var dal = factory.Create();
            var layers = dal.GetLayers();
            var controlPanels = dal.GetControlPanels();
            var json = JsonConvert.SerializeObject(layers);
            return Request.CreateResponse(HttpStatusCode.OK, "{ app: \"Everything works as expected\"}", new MediaTypeHeaderValue("application/json"));
        }
    }
}
