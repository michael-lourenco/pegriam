"use client"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/icons"
import { useAuth } from "@/hooks/useAuth"

export default function LoginComponent() {

  const { user, loading: authLoading, status, handleLogin, handleLogout } = useAuth()
 
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
      <div className="max-w-md w-full space-y-8">
        <div className="space-y-4">
          <Icon name="LuScroll" className="mx-auto h-16 w-16 text-primary" />
          <h2 className="text-2xl font-bold text-primary">Mensagem de Login</h2>
          <p className="text-muted-foreground">
            Ah, viajante! Para que eu possa lembrar das histórias que você já ouviu e encontrar contos ainda mais
            incríveis para você, preciso saber quem é você. Não se preocupe, seu nome ficará seguro nos pergaminhos do
            tempo!
          </p>
        </div>

        <Button
          onClick={handleLogin}
          variant="default"
          size="lg"
          className="w-full text-lg py-6 bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <Icon name="LuLogIn" className="mr-2 h-5 w-5" />
          Continuar com Google
        </Button>

        <p className="text-sm text-muted-foreground">
          Seu progresso será salvo e você poderá revisitar suas histórias sempre que quiser!
        </p>
      </div>
    </div>
  )
}

