using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MapDAL.Entities
{
    public class ControlPanel: MapDALEntity
    {
        public int Id { get; set; }

        public string Position { get; set; }

        public string PanelTemplate { get; set; }

        public List<Control> Controls { get; set; }

        public override bool IsEqualId(DbDataReader reader, string prefix)
        {
            var objId = ReadField<int>(reader, "Id", prefix);
            return this.Id == objId;
        }

        protected override void FillFields(DbDataReader reader, string prefix)
        {
            this.Id = ReadField<int>(reader, "Id", prefix);
            this.Position = ReadField<string>(reader, "Position", prefix);
            this.PanelTemplate = ReadField<string>(reader, "PanelTemplate", prefix);
        }
    }
}
