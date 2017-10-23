 const DEFAULT_APPLICATION_CONFIG = {
   port: process.env.PORT || 3000,
   basePath: process.env.BASE_PATH || '/api/v1',
   bodyLimit: '10mb',
   apiKey: 'MN36nyh64z4d5SC70jv-YJV:c0XzN8be}_I24j0qYjs*%zCb01CaHCm6U_S=.E{r89<(gL2d?44{g$?-6OF;IeEIx9',
   workers: 2,
   cors: {
     optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
   },
   limiter: {
     trustProxy: true,
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100,
     delayMs: 0, // disabled
   },
 };
 export default DEFAULT_APPLICATION_CONFIG;
