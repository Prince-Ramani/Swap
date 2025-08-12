import { Router } from "express";
import { signup, signin, getMe, logout } from "../controllers/authController";
import { protectRoute } from "../middlewares/protectRoute";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/getMe", protectRoute, getMe);
router.post("/logout", protectRoute, logout);

export default router;
