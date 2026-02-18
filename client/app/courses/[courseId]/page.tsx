"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { api } from "@/lib/api"
import Link from "next/link"

export default function CourseDetails() {
  const { courseId } = useParams()

  const [lessons, setLessons] = useState<any[]>([])

  useEffect(() => {
    const fetchLessons = async () => {
      const res = await api.get(`/lessons/${courseId}`)
      setLessons(res.data)
    }

    fetchLessons()
  }, [courseId])

  return (
    <div>
      <h1>Course Lessons</h1>

      {lessons.map((lesson) => (
        <div key={lesson._id}>
          <h3>{lesson.title}</h3>
        </div>
      ))}

      <Link href={`/courses/${courseId}/add-lesson`}>
        Add Lesson
      </Link>
    </div>
  )
}