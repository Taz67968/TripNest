'use client'
import React, { useState } from 'react'
import {Search} from 'lucide-react'
import { useRouter } from 'next/navigation';


export default function SearchBar() {
  const [query, setQuery] = useState('')
  const router = useRouter();
  const handleSubmit = ()=>{
    if(!query) return;
    localStorage.setItem('search', query);
    router.push("/results")
    setQuery('')

  }
  return (
    <div className='mt-10'>
        <input type="text" placeholder="Enter A country or Town" value={query} onChange={(e) =>setQuery(e.target.value) } className='border-2 border-white rounded-xl p-2 pt-3 w-1xl md:w-2xl text-white'/>
        <button onClick={handleSubmit} className='-ml-9 p-2 bg-black rounded-xl text-white hover:bg-blue-600'><Search size={16}/></button>
    </div>
  )
}
