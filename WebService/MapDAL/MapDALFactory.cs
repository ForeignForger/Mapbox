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
            var constructor = GetConstructor(Type.GetType(provider.Type));
            object[] parameters = null;

            if (constructor.GetParameters().Count() > 0)
            {
                var helper = new MapDALHelper(connectionName, provider.Name);
                parameters = new[] { helper };
            }
            var instance = constructor.Invoke(parameters);
            return (IMapDAL)instance;
        }

        private ConstructorInfo GetConstructor(Type type)
        {
            var constructors = type.GetConstructors().Where((c) =>
            {
                var parameters = c.GetParameters();
                return parameters.Count() == 0 || parameters.Count() == 1 && parameters.First().ParameterType == typeof(MapDALHelper);
            }).OrderBy((c) =>
            {
                var parameters = c.GetParameters();
                return -parameters.Count();
            });

            return constructors.First();
        }
    }
}
