import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

interface JwtPayload {
  id: string
}

export const protect = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1]
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized" })
    return
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload

    req.user = await User.findById(decoded.id)
    next()
  } catch (error) {
    res.status(401).json({ message: "Token invalid" })
  }
}

// Role-based middleware
export const authorize = (roles: string[]) => {
  return (req: any, res: Response, next: NextFunction): void => {
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: "Forbidden" })
      return
    }
    next()
  }
}