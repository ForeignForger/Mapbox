using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Data.Common;

namespace MapDAL.Entities
{
    public class Element: MapDALEntity
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public override void MapData (DbDataReader reader)
        {
            this.Id = ConvertToString(reader["id"]);
            this.Name = ConvertToString(reader["Name"]);
        }
    }
}