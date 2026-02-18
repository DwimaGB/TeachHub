"use client"

import { useState } from "react"
import { api } from "@/lib/api"
import { useParams } from "next/navigation"

export default function AddLesson() {
  const { courseId } = useParams()

  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    const data = new FormData()

    data.append("title", title)
    data.append("description", description)
    data.append("courseId", courseId as string)

    if (videoFile) {
      data.append("video", videoFile)  // MUST match backend
    }

    await api.post("/lessons", data)

    alert("Lesson uploaded")
  }

  return (
    <form onSubmit={handleUpload}>
      <input
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="Description"
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="file"
        onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
      />

      <button>Upload Lesson</button>
    </form>
  )
}