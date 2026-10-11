'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'

type Edition = 'Nigeria' | 'Australia'
interface EditionContextValue {
  edition: Edition
  setEdition: (edition: Edition) => void
}

const EditionContext = createContext<EditionContextValue | null>(null)

export function EditionProvider({ children }: { children: React.ReactNode }) {
  const [edition, setEditionState] = useState<Edition>('Nigeria')
  
  useEffect(() => {
    const saved = localStorage.getItem('tb-edition') as Edition | null
    if (saved === 'Nigeria' || saved === 'Australia') setEditionState(saved)
  }, [])
  
  const setEdition = (e: Edition) => {
    setEditionState(e)
    localStorage.setItem('tb-edition', e)
  }
  
  return (
    <EditionContext.Provider value={{ edition, setEdition }}>
      {children}
    </EditionContext.Provider>
  )
}

export function useEdition() {
  const ctx = useContext(EditionContext)
  if (!ctx) throw new Error('useEdition must be used within EditionProvider')
  return ctx
}
