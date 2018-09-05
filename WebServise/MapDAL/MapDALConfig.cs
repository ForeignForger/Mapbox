using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;

namespace MapDAL
{
    public class MapDALConfig: ConfigurationSection
    {
        public const string SectionName = "MapDALConfig";

        private const string ConnectionNameField = "MapDALConnectionName";

        public MapDALConfig()
        {

        }

        [ConfigurationProperty(ConnectionNameField, IsRequired = true)]
        public string ConnectionName
        {
            get
            {
                return (string)this[ConnectionNameField];
            }
            set
            {
                this[ConnectionNameField] = value;
            }
        }
    }
}
