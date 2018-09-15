using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;

namespace MapDAL
{
    public class MapDALProvider: ConfigurationElement
    {
        private const string providerName ="name";
        private const string type = "type";

        [ConfigurationProperty(providerName, IsRequired = true)]
        public string Name
        {
            get
            {
                return (string)base[providerName];
            }
        }

        [ConfigurationProperty(type, IsRequired = true)]
        public string Type
        {
            get
            {
                return (string)base[type];
            }
        }
    }

    public class MapDALProviders: ConfigurationElementCollection
    {
        internal const string PropertyName = "provider";

        public override ConfigurationElementCollectionType CollectionType
        {
            get
            {
                return ConfigurationElementCollectionType.BasicMapAlternate;
            }
        }

        protected override string ElementName
        {
            get
            {
                return PropertyName;
            }
        }

        protected override ConfigurationElement CreateNewElement()
        {
            return new MapDALProvider();
        }

        protected override object GetElementKey(ConfigurationElement element)
        {
            return ((MapDALProvider)element).Name;
        }

        public MapDALProvider this[string name]
        {
            get
            {
                return (MapDALProvider)BaseGet(name);
            }
        }
    }

    public class MapDALConfig : ConfigurationSection
    {
        internal const string SectionName = "mapDALConfig";
        private const string connectionNameField = "connectionName";
        private const string providerColection = "providers";

        public MapDALConfig()
        {

        }

        [ConfigurationProperty(connectionNameField, IsRequired = true)]
        public string ConnectionName
        {
            get
            {
                return (string)this[connectionNameField];
            }
            set
            {
                this[connectionNameField] = value;
            }
        }

        [ConfigurationProperty(providerColection, IsRequired = true)]
        public MapDALProviders Providers
        {
            get
            {
                return (MapDALProviders)base[providerColection];
            }
            set
            {
                base[providerColection] = value;
            }
        }
    }
}
