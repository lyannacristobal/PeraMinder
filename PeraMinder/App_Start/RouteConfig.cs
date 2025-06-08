using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace PeraMinder
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );

            routes.MapRoute(
    name: "DeleteTransaction",
    url: "Home/DeleteTransaction",
    defaults: new { controller = "Home", action = "DeleteTransaction" }
);

            routes.MapRoute(
  name: "GetIncomeExpenseData",
  url: "Home/GetIncomeExpenseData",
  defaults: new { controller = "Home", action = "GetIncomeExpenseData" }
);


            routes.MapRoute(
  name: "GetFeedbackGrowth",
  url: "Home/GetFeedbackGrowth",
  defaults: new { controller = "Home", action = "GetFeedbackGrowth" }
);

        }
    }
}
