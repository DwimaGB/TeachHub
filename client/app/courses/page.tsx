"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import Link from "next/link"

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([])

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await api.get("/courses")
      setCourses(res.data)
    }

    fetchCourses()
  }, [])

  return (
    <div>
      <h1>Courses</h1>

      {courses.map((course) => (
        <div key={course._id}>
          <img src={course.thumbnail} width={200} />
          <h3>{course.title}</h3>

          <Link href={`/courses/${course._id}`}>
            View Course
          </Link>
        </div>
      ))}
    </div>
  )
}