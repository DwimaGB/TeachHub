import express from "express"
import {
  createCourse,
  getCourses,
  getCourseById,
} from "../controllers/course.controller.js"
import { protect } from "../middleware/auth.middleware.js"
import { authorizeRoles } from "../middleware/role.middleware.js"

const router = express.Router()

router.get("/", getCourses)
router.get("/:id", getCourseById)

// Only admin (single teacher) can create courses
router.post("/", protect, authorizeRoles("admin"), createCourse)

export default router