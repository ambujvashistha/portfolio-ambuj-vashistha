import { createContext, useContext } from 'react'

// { mode: 'dev' | 'editor', go: (mode) => void, flipping: boolean }
export const NavContext = createContext({ mode: 'dev', go: () => {}, flipping: false })

export const useNav = () => useContext(NavContext)
