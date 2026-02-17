"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"

interface Course {
  _id: string
  title: string
  description: string
}

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get<Course[]>("/courses")
        setCourses(res.data.slice(0, 3))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-5xl flex-col gap-12 px-4 py-10 md:flex-row md:items-center">
      {/* Hero */}
      <section className="flex-1 space-y-6">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Learn and teach with{" "}
          <span className="text-blue-600">TeachHub</span>
        </h1>
        <p className="max-w-xl text-sm text-gray-700 md:text-base">
          A simple platform where teachers publish courses and students
          enroll, track progress, and watch lessons.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/register"
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Get started as a student
          </Link>
          <Link
            href="/register"
            className="rounded border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100"
          >
            Become a teacher
          </Link>
          <Link
            href="/courses"
            className="text-sm font-medium text-gray-700 underline-offset-4 hover:underline"
          >
            Browse all courses
          </Link>
        </div>

        <div className="grid gap-4 pt-4 text-sm md:grid-cols-3">
          <div className="rounded border bg-white p-4 shadow-sm">
            <h3 className="font-semibold">Students</h3>
            <p className="mt-2 text-gray-700">
              Discover courses, enroll with one click, and see everything
              you&apos;re learning on your dashboard.
            </p>
          </div>
          <div className="rounded border bg-white p-4 shadow-sm">
            <h3 className="font-semibold">Teachers</h3>
            <p className="mt-2 text-gray-700">
              Create courses, add lessons, and manage your content from a
              simple dashboard.
            </p>
          </div>
          <div className="rounded border bg-white p-4 shadow-sm">
            <h3 className="font-semibold">Tech stack</h3>
            <p className="mt-2 text-gray-700">
              Next.js frontend talking to an Express + MongoDB backend
              with JWT auth and role-based access.
            </p>
          </div>
        </div>
      </section>

      {/* Featured courses */}
      <section className="flex-1 space-y-4">
        <h2 className="text-lg font-semibold">Featured courses</h2>
        <p className="text-sm text-gray-700">
          These are fetched live from your backend
          <span className="hidden md:inline"> using the /courses API</span>.
        </p>

        <div className="mt-2 space-y-3">
          {loading ? (
            <p className="text-sm text-gray-500">Loading courses...</p>
          ) : courses.length === 0 ? (
            <p className="text-sm text-gray-500">
              No courses yet.{" "}
              <Link
                href="/create-course"
                className="font-medium text-blue-600 underline-offset-4 hover:underline"
              >
                Create the first one
              </Link>
              .
            </p>
          ) : (
            courses.map((course) => (
              <div
                key={course._id}
                className="rounded border bg-white p-4 text-sm shadow-sm"
              >
                <h3 className="font-semibold">{course.title}</h3>
                <p className="mt-1 line-clamp-3 text-gray-700">
                  {course.description}
                </p>
              </div>
            ))
          )}
        </div>

        <Link
          href="/courses"
          className="inline-block text-sm font-medium text-blue-600 underline-offset-4 hover:underline"
        >
          View all courses
        </Link>
      </section>
    </div>
  )
}