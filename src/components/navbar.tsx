"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LogoWithText } from "@/components/Logo"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setIsLoggedIn(true)
      // Fetch user data
      fetch("/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setUserName(data.name || "Usuario")
        })
        .catch(() => {
          setIsLoggedIn(false)
          localStorage.removeItem("token")
        })
    }
  }, [])

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    setIsLoggedIn(false)
    setShowLogoutConfirm(false)
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label="Domesta inicio">
          <LogoWithText />
        </Link>

        <nav className="hidden items-center gap-3 md:flex">
          {isLoggedIn ? (
            <>
              <span className="text-sm text-foreground">¡Hola, {userName}!</span>
              <Link href="/dashboard">
                <Button variant="ghost" className="text-foreground hover:bg-secondary">
                  Dashboard
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" className="text-foreground hover:bg-secondary">
                  Mi Perfil
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="text-foreground hover:bg-secondary"
                onClick={handleLogoutClick}
              >
                Salir
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/register?role=domestic">
                <Button variant="ghost" className="text-foreground hover:bg-secondary">
                  Soy personal doméstico
                </Button>
              </Link>
              <Link href="/auth/register?role=client">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Buscar personal
                </Button>
              </Link>
            </>
          )}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground hover:bg-secondary md:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {isLoggedIn ? (
              <>
                <div className="px-3 py-2 text-sm text-foreground">¡Hola, {userName}!</div>
                <Link href="/dashboard" className="w-full">
                  <Button variant="ghost" className="justify-start w-full text-foreground hover:bg-secondary">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/profile" className="w-full">
                  <Button variant="ghost" className="justify-start w-full text-foreground hover:bg-secondary">
                    Mi Perfil
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="justify-start w-full text-foreground hover:bg-secondary"
                  onClick={handleLogoutClick}
                >
                  Salir
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/register?role=domestic" className="w-full">
                  <Button variant="ghost" className="justify-start w-full text-foreground hover:bg-secondary">
                    Soy personal doméstico
                  </Button>
                </Link>
                <Link href="/auth/register?role=client" className="w-full">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    Buscar personal
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border border-border rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-bold text-foreground mb-2">¿Cerrar sesión?</h3>
            <p className="text-foreground/70 mb-6">¿Estás seguro de que quieres salir?</p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="ghost"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancelar
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleLogout}
              >
                Salir
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
