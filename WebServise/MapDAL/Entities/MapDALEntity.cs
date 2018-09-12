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
        public abstract void MapData(DbDataReader reader);

        protected string ConvertToString(object value)
        {
            return value is DBNull ? null : value as string;
        }

        protected Nullable<T> ConvertToNullable<T>(object value) where T : struct
        {
            return value is DBNull ? null : value as Nullable<T>;
        }
    }
}
