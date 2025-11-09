import { Router } from "express";
import controller from "../controllers/index.js";

const router = Router();

router.get("/get-data", controller.get);
router.get("/test", controller.test);

export default router;