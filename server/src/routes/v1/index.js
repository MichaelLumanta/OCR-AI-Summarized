const express = require("express");
const SkillSyncRoute = require("./SkillSync/skill_sync.route");
const SimpleOCR = require("./simple_ocr/ocr.route");
const config = require("../../config/config");

const router = express.Router();

const defaultRoutes = [
  {
    path: '/skill_sync',
    route: SkillSyncRoute,
  },
  {
    path: '/simple_ocr',
    route: SimpleOCR,
  },
];

const devRoutes = [
  // routes available only in development mode
  //   {
  //     path: '/docs',
  //     route: docsRoute,
  //   },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === "development") {
  console.log(`include dev routes`);
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
