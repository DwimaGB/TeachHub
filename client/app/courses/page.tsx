"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"

interface Course {
  _id: string
  title: string
  description: string
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await api.get<Course[]>("/courses")
      setCourses(res.data)
    }

    fetchCourses()
  }, [])

  return (
    <div className="mx-auto mt-10 max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold">Courses</h1>

      {courses.map((course) => (
        <div
          key={course._id}
          className="rounded border bg-white p-4 shadow-sm"
        >
          <h3 className="text-lg font-semibold">{course.title}</h3>
          <p className="text-sm text-gray-700">{course.description}</p>
        </div>
      ))}
    </div>
  )
}