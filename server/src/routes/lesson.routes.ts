import express from "express"
import {
  createLesson,
  getLessons,
} from "../controllers/lesson.controller.js"
import { protect } from "../middleware/auth.middleware.js"
import { authorizeRoles } from "../middleware/role.middleware.js"

const router = express.Router()

// Only admin (single teacher) can create lessons
router.post("/", protect, authorizeRoles("admin"), createLesson)

// Anyone can view lessons for a course
router.get("/:courseId", getLessons)

export default router