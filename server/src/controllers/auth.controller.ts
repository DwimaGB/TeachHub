import type { Request, Response } from "express"
import User from "../models/user.model.js"
import { generateToken } from "../utils/generateToken.js"

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    const user = await User.create({
      name,
      email,
      password,
    })

    const token = generateToken(user._id.toString())

    res.status(201).json({
      success: true,
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Registration failed" })
  }
}

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select("+password")

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const token = generateToken(user._id.toString())

    res.json({
      success: true,
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Login failed" })
  }
}

export const getMe = async (req: any, res: Response) => {
  const user = await User.findById(req.user.id)

  res.json({
    success: true,
    data: user,
  })
}