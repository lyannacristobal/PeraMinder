using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using PeraMinder.Models;

namespace PeraMinder
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            // Register areas, filters, routes, and bundles
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

        }
    }
}
