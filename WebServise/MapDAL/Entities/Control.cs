using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MapDAL.Entities
{
    public class Control : MapDALEntity
    {
        public int Id { get; set; }

        public string StringId { get; set; }

        public string ControlTemplate { get; set; }

        public string ControlName { get; set; }

        public string ControlData { get; set; }
        
        public override bool IsEqualId(DbDataReader reader, string prefix)
        {
            var objId = ReadField<int>(reader, "Id", prefix);
            return this.Id == objId;
        }

        protected override void FillFields(DbDataReader reader, string prefix)
        {
            this.Id = ReadField<int>(reader, "Id", prefix);
            this.StringId = ReadField<string>(reader, "StringId", prefix);
            this.ControlTemplate = ReadField<string>(reader, "ControlTemplate", prefix);
            this.ControlName = ReadField<string>(reader, "ControlName", prefix);
            this.ControlData = ReadNullbaleString(reader, "Controldata", prefix);
        }
    }
}
