"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { AxiosError } from "axios"
import { api } from "@/lib/api"

export default function CreateCourse() {
  const router = useRouter()

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: 0,
    thumbnail: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      await api.post("/courses", form)
      alert("Course created")
    } catch (err: unknown) {
      const axiosErr = err as AxiosError | undefined
      const status = axiosErr?.response?.status

      if (status === 401) {
        setError("You must be signed in to create a course.")
        router.push("/login")
      } else if (status === 403) {
        setError("Only teacher accounts can create courses.")
      } else {
        setError("Error creating course. Please try again.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-10 max-w-md space-y-4 rounded border bg-white p-6 shadow-sm"
    >
      <h1 className="text-xl font-semibold">Create Course</h1>
      <p className="text-sm text-gray-600">
        You need to be signed in as a teacher to publish courses.
      </p>

      {error && (
        <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <input
        className="w-full rounded border px-3 py-2"
        placeholder="Title"
        required
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <textarea
        className="w-full rounded border px-3 py-2"
        placeholder="Description"
        required
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <input
        className="w-full rounded border px-3 py-2"
        placeholder="Thumbnail URL"
        onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
      />

      <input
        className="w-full rounded border px-3 py-2"
        type="number"
        placeholder="Price"
        min={0}
        step={0.01}
        onChange={(e) =>
          setForm({ ...form, price: Number(e.target.value) })
        }
      />

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded bg-black px-3 py-2 text-sm font-medium text-white hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? "Creating..." : "Create"}
      </button>
    </form>
  )
}