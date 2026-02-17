"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import type { AxiosError } from "axios"

interface Course {
  _id: string
  title: string
  description: string
}

interface Enrollment {
  _id: string
  course: Course
}

interface User {
  _id: string
  name: string
  email: string
  role: "student" | "admin"
}

export default function Dashboard() {
  const router = useRouter()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUser = window.localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser) as User)
      } catch {
        setUser(null)
      }
    }
  }, [])

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const token = window.localStorage.getItem("token")
        if (!token) {
          return
        }

        const res = await api.get<Enrollment[]>("/enrollment/my")
        setEnrollments(res.data)
      } catch (err: unknown) {
        console.error(err)
        const status = (err as AxiosError | undefined)?.response?.status
        if (status === 401) {
          window.localStorage.removeItem("token")
          router.push("/login")
        }
      }
    }

    fetchMyCourses()
  }, [router])

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {user && (
          <p className="mt-2 text-gray-700">
            Signed in as <span className="font-semibold">{user.name}</span>{" "}
            ({user.role})
          </p>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">My Courses</h2>
        {enrollments.length === 0 ? (
          <p className="text-gray-600">
            You are not enrolled in any courses yet.{" "}
            <button
              type="button"
              onClick={() => router.push("/dashboard/courses")}
              className="text-blue-600 underline-offset-4 hover:underline"
            >
              Browse courses
            </button>
            .
          </p>
        ) : (
          <ul className="space-y-3">
            {enrollments.map((enrollment) => (
              <li
                key={enrollment._id}
                className="rounded border bg-white p-4 shadow-sm"
              >
                <h3 className="font-semibold">{enrollment.course.title}</h3>
                <p className="text-sm text-gray-700">
                  {enrollment.course.description}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}