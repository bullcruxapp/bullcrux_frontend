'use client'

import { usePathname } from 'next/navigation'
import NavbarComponent from './NavbarComponent'

const RUTAS_SIN_NAVBAR = ['/login', '/registro']

export default function NavbarWrapper() {
  const pathname = usePathname()
  const mostrarNavbar = pathname && !RUTAS_SIN_NAVBAR.includes(pathname)

  if (!mostrarNavbar) return null
  return <NavbarComponent />
}
