"use client"

import { useEffect, useState } from "react"
import type { AxiosError } from "axios"
import { api } from "@/lib/api"

interface Course {
  _id: string
  title: string
  description: string
  price?: number
}

interface User {
  _id: string
  name: string
  email: string
  role: "student" | "admin"
}

interface Lesson {
  _id: string
  title: string
  videoUrl: string
}

export default function DashboardCoursesPage() {
  const [user, setUser] = useState<User | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loadingLessonsFor, setLoadingLessonsFor] = useState<string | null>(null)
  const [creatingLessonFor, setCreatingLessonFor] = useState<string | null>(null)
  const [lessonTitle, setLessonTitle] = useState("")
  const [lessonVideoUrl, setLessonVideoUrl] = useState("")
  const [enrollMessage, setEnrollMessage] = useState<string | null>(null)
  const [lessonMessage, setLessonMessage] = useState<string | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser) as User)
    }

    const fetchCourses = async () => {
      try {
        const res = await api.get<Course[]>("/courses")
        setCourses(res.data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchCourses()
  }, [])

  const handleViewLessons = async (courseId: string) => {
    setSelectedCourseId(courseId)
    setLoadingLessonsFor(courseId)
    try {
      const res = await api.get<Lesson[]>(`/lessons/${courseId}`)
      setLessons(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingLessonsFor(null)
    }
  }

  const handleEnroll = async (courseId: string) => {
    try {
      setEnrollMessage(null)
      await api.post(`/enrollment/${courseId}`)
      setEnrollMessage("Enrolled successfully. Check your dashboard for My Courses.")
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string }> | undefined
      const message =
        axiosErr?.response?.data?.message ||
        "Could not enroll in this course. Please try again."
      setEnrollMessage(message)
    }
  }

  const handleCreateLesson = async (courseId: string) => {
    try {
      setLessonMessage(null)
      await api.post("/lessons", {
        title: lessonTitle,
        videoUrl: lessonVideoUrl,
        course: courseId,
      })
      setLessonTitle("")
      setLessonVideoUrl("")
      setCreatingLessonFor(null)
      // Refresh lessons list if we are viewing this course
      if (selectedCourseId === courseId) {
        await handleViewLessons(courseId)
      }
      setLessonMessage("Lesson created.")
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string }> | undefined
      const message =
        axiosErr?.response?.data?.message ||
        "Failed to create lesson. Make sure you are signed in as a teacher."
      setLessonMessage(message)
    }
  }

  const isAdmin = user?.role === "admin"

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">All Courses</h1>

      {enrollMessage && (
        <p className="rounded border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-800">
          {enrollMessage}
        </p>
      )}

      {lessonMessage && (
        <p className="rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          {lessonMessage}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {courses.map((course) => (
          <div
            key={course._id}
            className="rounded border bg-white p-4 shadow-sm space-y-3"
          >
            <div>
              <h2 className="text-lg font-semibold">{course.title}</h2>
              <p className="text-sm text-gray-700">{course.description}</p>
              {typeof course.price === "number" && (
                <p className="mt-1 text-sm text-gray-600">
                  Price: ₹{course.price?.toFixed(2)}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleViewLessons(course._id)}
                className="rounded bg-blue-600 px-3 py-1 text-sm text-white"
              >
                {loadingLessonsFor === course._id
                  ? "Loading lessons..."
                  : "View Lessons"}
              </button>

              {!isAdmin && (
                <button
                  onClick={() => handleEnroll(course._id)}
                  className="rounded bg-green-600 px-3 py-1 text-sm text-white"
                >
                  Enroll
                </button>
              )}

              {isAdmin && (
                <button
                  onClick={() =>
                    setCreatingLessonFor(
                      creatingLessonFor === course._id ? null : course._id,
                    )
                  }
                  className="rounded bg-gray-800 px-3 py-1 text-sm text-white"
                >
                  {creatingLessonFor === course._id
                    ? "Cancel Lesson"
                    : "Add Lesson"}
                </button>
              )}
            </div>

            {creatingLessonFor === course._id && (
              <div className="mt-3 space-y-2 border-t pt-3">
                <h3 className="font-medium text-sm">Create Lesson</h3>
                <input
                  className="w-full rounded border px-2 py-1 text-sm"
                  placeholder="Lesson title"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                />
                <input
                  className="w-full rounded border px-2 py-1 text-sm"
                  placeholder="Video URL"
                  value={lessonVideoUrl}
                  onChange={(e) => setLessonVideoUrl(e.target.value)}
                />
                <button
                  onClick={() => handleCreateLesson(course._id)}
                  className="rounded bg-black px-3 py-1 text-sm text-white"
                >
                  Save Lesson
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedCourseId && lessons.length > 0 && (
        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-3">Lessons</h2>
          <ul className="space-y-2">
            {lessons.map((lesson) => (
              <li
                key={lesson._id}
                className="rounded border bg-white p-3 text-sm shadow-sm"
              >
                <p className="font-medium">{lesson.title}</p>
                <p className="text-gray-700 break-all">{lesson.videoUrl}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

