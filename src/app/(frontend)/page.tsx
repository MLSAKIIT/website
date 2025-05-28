import { headers as getHeaders } from "next/headers.js"
import Image from "next/image"
import { getPayload } from "payload"
import React from "react"
import { fileURLToPath } from "url"
import config from "@/payload.config"

export default async function HomePage() {
  return (
    <div className="container">
      <h1 className="text-4xl font-bold">Hello, Next.js 15!</h1>
    </div>
  )
}
