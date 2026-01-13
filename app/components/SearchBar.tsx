'use client'
import React, { useState } from 'react'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!query) return
    localStorage.setItem('search', query)
    router.push('/result')
    setQuery('')
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 flex items-center justify-center">
      <input
        type="text"
        placeholder="Enter a country or town"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="input w-full md:w-96"
        aria-label="Search"
      />
      <button
        type="submit"
        aria-label="Search"
        className="-ml-10 p-2 btn-primary rounded-xl text-white hover:brightness-95"
      >
        <Search size={16} />
      </button>
    </form>
  )
}