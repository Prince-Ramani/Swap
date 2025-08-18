import { Router } from "express";
import { protectRoute } from "../middlewares/protectRoute";
import {
  deleteProject,
  getProjects,
  uploadProject,
} from "../controllers/projectController";
import { upload } from "../cloudinary";

const router = Router();

router.post("/upload", protectRoute, upload.single("zipFile"), uploadProject);
router.delete("/delete", protectRoute, deleteProject);
router.get("/getProjects", protectRoute, getProjects);

export default router;
