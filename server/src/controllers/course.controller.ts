import type { Response } from "express"
import Course from "../models/course.model.js"
import type { AuthRequest } from "../middleware/auth.middleware.js"

export const createCourse = async (req: AuthRequest, res: Response) => {
  try {
    const file = req.file as any   // get uploaded file
    const thumbnail = file?.path   // Cloudinary URL
    const publicId = file?.filename // Cloudinary public id

    const course = await Course.create({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      thumbnail,
      publicId,
      instructor: req.user._id,
    })

    res.json(course)
  } catch (error) {
    res.status(500).json({ message: "Error creating course" })
  }
}

export const getCourses = async (_req: AuthRequest, res: Response) => {
  try {
    const courses = await Course.find().populate("instructor", "name")
    res.json(courses)
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses" })
  }
}

export const getCourseById = async (req: AuthRequest, res: Response) => {
  try {
    const course = await Course.findById(req.params.id)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }
    res.json(course)
  } catch (error) {
    res.status(500).json({ message: "Error fetching course" })
  }
}
