using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Common;

namespace MapDAL.Entities
{
    public abstract class MapDALEntity
    {
        public  bool MapData(DbDataReader reader, string prefix = "")
        {
            try
            {
                FillFields(reader, prefix);
            }
            catch
            {
                return false;
            }

            return true;
        }

        public abstract bool IsEqualId(DbDataReader reader, string prefix);

        protected abstract void FillFields(DbDataReader reader, string prefix);

        protected T ReadField<T>(DbDataReader reader, string name, string prefix = "")
        {
            prefix = prefix ?? "";
            var value = (T)reader[prefix + name];
            return value;
        }

        protected Nullable<T> ReadNullableField<T>(DbDataReader reader, string name, string prefix = "") where T : struct
        {
            prefix = prefix ?? "";
            var value = reader[prefix + name] is DBNull ? null : reader[prefix + name] as Nullable<T>;
            return value;
        }

        protected string ReadNullbaleString(DbDataReader reader, string name, string prefix = "")
        {
            prefix = prefix ?? "";
            return reader[prefix + name] is DBNull ? null : reader[prefix + name] as string;
        }
    }
}
