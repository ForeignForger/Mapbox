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
using WebService.Repositories;
using WebService.Models;
using System.Web.Http.Cors;

namespace WebService.Controllers
{
    [EnableCors(origins: "*", headers: "GET", methods: "*")]
    public class InfoController : ApiController
    {
        private MapRepository mapRepository;

        public InfoController()
        {
            mapRepository = new MapRepository();
        }

        public HttpResponseMessage Get()
        {
            var layers = mapRepository.GetLayers();
            var panels = mapRepository.GetControlPanels();
            var info = new InfoModel(layers, panels);
            var json = JsonConvert.SerializeObject(info);
            return Request.CreateResponse(HttpStatusCode.OK, json, new MediaTypeHeaderValue("application/json"));
        }
    }
}
