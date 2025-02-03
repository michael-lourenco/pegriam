"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserData } from "@/application/entities/User";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { MultiSelect } from "@/components/ui/multi-select"
import {
    fetchUserData,
    initUserFirebase,
    dbFirestore,
    authFirestore,
    saveTemplate
  } from "@/services/firebase/FirebaseService";


interface UserInfoProps {
    user: UserData | null;
}

type TemplateData = {
  name: string
  storyLength: "curta" | "média" | "longa"
  themes: string[]
  age: number
}

const themes = ["Aventura", "Amizade", "Família", "Natureza", "Animais", "Fantasia", "Superherói", "Escola"]

export const StoryGeneratorModal: React.FC<UserInfoProps> = ({
  user,
}) => {
const localStorageUser =
    typeof window !== "undefined" && localStorage.getItem("user") !== null
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : null;
  const [isOpen, setIsOpen] = useState(false)
  const { register, handleSubmit, control, reset } = useForm<TemplateData>()

  const onSubmit = async (data: TemplateData) => {
    try {
      console.log("TEM EMAIL?", user?.email)
      if (user && user.email){
        await saveTemplate(user.email, data, dbFirestore)
      }

      reset()
      setIsOpen(false)
      // Adicione aqui uma notificação de sucesso
    } catch (error) {
      console.error("Erro ao salvar o template:", error)
      // Adicione aqui uma notificação de erro
    }
  }

  return (
    <>
    {user || (localStorageUser && localStorage.getItem("user") != null)  ? (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Criar Template de História</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Criar Template de História Infantil</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Template</Label>
                <Input id="name" {...register("name", { required: true })} />
              </div>
              <div>
                <Label>Tamanho da História</Label>
                <Controller
                  name="storyLength"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="curta" id="curta" />
                        <Label htmlFor="curta">Curta</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="média" id="média" />
                        <Label htmlFor="média">Média</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="longa" id="longa" />
                        <Label htmlFor="longa">Longa</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
              </div>
              <div>
                <Label>Temas</Label>
                <Controller
                  name="themes"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <MultiSelect
                      options={themes.map((theme) => ({ label: theme, value: theme }))}
                      selected={field.value || []}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              <div>
                <Label htmlFor="age">Idade Recomendada</Label>
                <Input type="number" id="age" {...register("age", { required: true, min: 1, max: 12 })} />
              </div>
              <Button type="submit">Salvar Template</Button>
            </form>
          </DialogContent>
        </Dialog>): (<></>)}
    </>
  )
}

