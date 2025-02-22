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
                <p>Ah, viajante! Tenho histórias de todos os cantos do mundo… Mas me diga, que tipo de história você quer ouvir hoje?</p>
                <Image
                  src="/images/pegriam/pegriam-avatar.png"
                  alt="Avatar Pegriam"
                  width={200}
                  height={200}
                  className="mt-4"
                />

                <Button
                  onClick={handleNavigation("/story")}
                  className="hover:text-primary font-bold m-5 transform transition-all duration-300 animate-pulse hover:scale-105 hover:shadow-xl hover:shadow-chart-4/50"
                  
                >
                  <Image
                    src="/images/buttons/iniciar.png"
                    alt="Play"
                    width={188}
                    height={92}
                    className="mt-4"
                  />
                </Button>
              </div>

              {/* Secondary Actions */}
              {/* <div className="space-y-4 mt-12">

                
                <Button
                  onClick={() => window.open("https://buy.stripe.com/00g02GeSnaJC12g5kk", "_blank")}
                  variant="outline"
                  className="w-full border-chart-4/50 text-purple-400 hover:bg-chart-4/10 hover:border-purple-400 group transition-all duration-300"
                >
                  <Icon name="LuHeart" className="w-5 h-5 mr-2 text-chart-4 group-hover:text-purple-400" />                  
                  <span>Apoiar o Projeto</span>
                </Button>
              </div> */}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}

