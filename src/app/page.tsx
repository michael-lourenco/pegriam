"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserInfo } from "@/components/UserInfo"
import { useNavigation } from "@/hooks/useNavigation"
import { useAuth } from "@/hooks/useAuth"
import { Footer } from "@/components/Footer"
import Image from "next/image"
import { LoadingDefault } from "@/components/LoadingDefault"
import { Icon, type IconName } from "@/components/icons"
import Link from "next/link"

export default function Home() {
  const navigationService = useNavigation()
  const { user, loading: authLoading, status, handleLogin, handleLogout } = useAuth()

  const handleNavigation = (path: string) => () => {
    navigationService.navigateTo(path)
  }

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingDefault />
        <div className="animate-pulse text-primary">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-primary">
      <main className="flex-grow flex flex-col items-center justify-start pt-4">
        <div className="max-w-4xl mx-auto">
          {/* User Info Section */}
          {status !== "loading" && <UserInfo user={user} handleLogin={handleLogin} handleLogout={handleLogout} />}

          {/* Main Game Section */}
          <Card className="bg-background border-none shadow-none max-w-4xl mx-auto">
            <CardHeader className="space-y-2">
              <CardTitle className="text-3xl md:text-4xl font-bold text-center">PEGRIAM</CardTitle>
            </CardHeader>

            <CardContent className="space-y-8">

              {/* Play Button - Featured */}
              <div className="flex flex-col justify-center items-center text-center">
                <p className="text-lg mb-4">Ah, viajante! Tenho histórias épicas de todos os cantos de Kontempler…</p>
                <Image
                  src="/images/pegriam/pegriam-avatar.png"
                  alt="Avatar Pegriam"
                  width={200}
                  height={200}
                  className="mt-4"
                />

                <div className="flex flex-col md:flex-row gap-4 mt-6">
                  <Link href="/stories">
                    <Button
                      className="hover:text-primary font-bold transform transition-all duration-300 animate-pulse hover:scale-105 hover:shadow-xl hover:shadow-chart-4/50"
                      size="lg"
                    >
                      Explorar Histórias
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Quick Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <Link href="/stories">
                  <Card className="hover:bg-accent transition-colors cursor-pointer">
                    <CardContent className="py-4 text-center">
                      <h3 className="font-semibold text-primary mb-2">A Lenda de Nix</h3>
                      <p className="text-sm text-muted-foreground">
                        A épica jornada de Nix Volstein
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Card className="opacity-50">
                  <CardContent className="py-4 text-center">
                    <h3 className="font-semibold text-muted-foreground mb-2">Em breve...</h3>
                    <p className="text-sm text-muted-foreground">
                      Mais histórias estão chegando
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
