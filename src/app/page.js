'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const page = () => {
  const router = useRouter()
  useEffect(() => {
    router.push("/auth")
  }, [])

  return (
    <>
    </>
  )
}

export default page