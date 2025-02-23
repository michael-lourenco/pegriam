"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserData } from "@/application/entities/User";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { MultiSelect } from "@/components/ui/multi-select"
import { Icon } from "@/components/icons"
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
            <Button variant="default" className="hover:scale-110 hover:animate-pulse  active:scale-95">
                  {/* <Icon name="LuPlus" className="h-5 w-5" /> */}
                <Image
                  src="/images/buttons/btn_plus.png"
                  alt="Gems"
                  width={40}
                  height={40}
                  className="flex-shrink-0 w-auto h-auto"
                />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>NOVO MODELO DE HISTÓRIA</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">NOME</Label>
                <Input id="name" {...register("name", { required: true })} />
              </div>
              <div>
                <Label>TAMANHO</Label>
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
                <Label>TEMAS</Label>
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
                <Label htmlFor="age">IDADE (1 a 12 anos)</Label>
                <Input type="number" id="age" {...register("age", { required: true, min: 1, max: 12 })} />
              </div>
              <Button type="submit" variant="default">
                  {/* <Icon name="LuPlus" className="h-5 w-5" /> */}
                <Image
                  src="/images/buttons/btn_save.png"
                  alt="Gems"
                  width={150}
                  height={87}
                  className="mx-0"
                />
            </Button>
            </form>
          </DialogContent>
        </Dialog>): (<></>)}
    </>
  )
}

