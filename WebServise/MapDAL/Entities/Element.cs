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

        public override bool IsEqualId(DbDataReader reader, string prefix)
        {
            var objId = ReadField<string>(reader, "Id", prefix);
            return this.Id == objId;
        }

        protected override void FillFields (DbDataReader reader, string prefix = "")
        {
            this.Id = ReadField<string>(reader, "Id", prefix);
            this.Name = ReadField<string>(reader, "Name", prefix);
        }
    }
}