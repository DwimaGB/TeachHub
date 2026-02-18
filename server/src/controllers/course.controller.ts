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
  const courses = await Course.find().populate("instructor", "name")
  res.json(courses)
}

export const getCourseById = async (req: AuthRequest, res: Response) => {
  const course = await Course.findById(req.params.id)
  res.json(course)
}