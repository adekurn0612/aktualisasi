// Mengganti 'import { Router } from "express";'
const { Router } = require("express");

// Mengganti 'import controller from "../controllers/index.js";'
// Pastikan file index.js di folder controllers juga sudah diekspor menggunakan module.exports
const controller = require("../controllers/index");

const router = Router();

router.get("/get-data", controller.get);
router.get("/test", controller.test);

// Mengganti 'export default router;'
module.exports = router;