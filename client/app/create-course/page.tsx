"use client"

import { useState } from "react"
import { api } from "@/lib/api"

export default function CreateCourse() {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const data = new FormData()

    data.append("title", title)
    data.append("description", description)
    data.append("price", String(price))

    if (file) {
      data.append("thumbnail", file)   // MUST match backend
    }

    await api.post("/courses", data)

    alert("Course created")
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="Description"
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="number"
        onChange={(e) => setPrice(Number(e.target.value))}
      />

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button>Create Course</button>
    </form>
  )
}