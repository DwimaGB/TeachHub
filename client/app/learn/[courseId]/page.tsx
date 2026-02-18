"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { api } from "@/lib/api"

export default function LearnPage() {
  const { courseId } = useParams()

  const [lessons, setLessons] = useState<any[]>([])
  const [current, setCurrent] = useState<any>(null)

  useEffect(() => {
    const fetchLessons = async () => {
      const res = await api.get(`/lessons/${courseId}`)
      setLessons(res.data)
      setCurrent(res.data[0])
    }

    fetchLessons()
  }, [courseId])

  return (
    <div style={{ display: "flex" }}>
      {/* Video */}
      <div>
        {current && (
          <video controls width="600">
            <source src={current.videoUrl} />
          </video>
        )}
      </div>

      {/* Sidebar */}
      <div>
        {lessons.map((lesson) => (
          <div
            key={lesson._id}
            onClick={() => setCurrent(lesson)}
          >
            {lesson.title}
          </div>
        ))}
      </div>
    </div>
  )
}