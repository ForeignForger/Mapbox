using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Data.Common;
using System.Configuration;


namespace MapDAL
{
    public class MapDALHelper
    {
        private string connectionString;
        private DbProviderFactory providerFactory;

        public MapDALHelper(string connectionString, string providerName)
        {
            this.connectionString = connectionString;
            this.providerFactory = DbProviderFactories.GetFactory(providerName);
        }

        public DbConnection CreateConnection()
        {
            var dbConnection = providerFactory.CreateConnection();
            dbConnection.ConnectionString = connectionString;
            return dbConnection;
        }
    }
}
