using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;
using System.Reflection;

namespace MapDAL
{
    public class MapDALFactory
    {
        private MapDALConfig config;

        public MapDALFactory()
        {
            this.config = GetConfig();
        }

        public IMapDAL Create()
        {
            var settings = ConfigurationManager.ConnectionStrings[config.ConnectionName];
            var dal = CreateInstance(settings.ConnectionString, settings.ProviderName);
            return dal;
        }

        private MapDALConfig GetConfig()
        {
            var config = (MapDALConfig)ConfigurationManager.GetSection(MapDALConfig.SectionName);
            return config;
        }
        private IMapDAL CreateInstance(string connectionName, string providerName)
        {
            var provider = config.Providers[providerName];
            var helper = new MapDALHelper(connectionName, provider.Name);
            var constructor = GetConstructor(Type.GetType(provider.Type));
            var instance = constructor.Invoke(new[] { helper });
            return (IMapDAL)instance;
        }

        private ConstructorInfo GetConstructor(Type type)
        {
            var constructor = type.GetConstructors().Where((c) =>
            {
                var parameters = c.GetParameters();
                return parameters.Count() == 1 && parameters.First().ParameterType == typeof(MapDALHelper);
            }).First();

            return constructor;
        }
    }
}
