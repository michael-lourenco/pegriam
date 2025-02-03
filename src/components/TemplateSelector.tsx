"use client"

import { useState, useEffect } from "react"
import { UserData } from "@/application/entities/User";
import { getFirestore, doc, getDoc } from "firebase/firestore"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Template } from '@/types/template';


interface UserInfoProps {
    user: UserData | null;
    onTemplateSelect: (template: Template) => void
}

export const TemplateSelector: React.FC<UserInfoProps> = ({
  user,
  onTemplateSelect
}) => {
const localStorageUser =
    typeof window !== "undefined" && localStorage.getItem("user") !== null
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : null;

  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)

  useEffect(() => {
    const fetchTemplates = async () => {
      if (user) {
        const db = getFirestore()
        const userRef = doc(db, process.env.NEXT_PUBLIC_USERS_COLLECTION!, user.email!)
        const userDoc = await getDoc(userRef)
        if (userDoc.exists()) {
          setTemplates(userDoc.data().templates || [])
        }
      }
    }

    fetchTemplates()
  }, [])

  const handleTemplateChange = (templateName: string) => {
    const template = templates.find((t) => t.name === templateName)
    if (template) {
      setSelectedTemplate(template)
      onTemplateSelect(template)
    }
  }

  return (
    <>
    {user || (localStorageUser && localStorage.getItem("user") != null)  ? (
    <div className="space-y-4">
      <Select onValueChange={handleTemplateChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione um template" />
        </SelectTrigger>
        <SelectContent>
          {templates.map((template) => (
            <SelectItem key={template.name} value={template.name}>
              {template.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedTemplate && (
        <div className="p-4 border rounded-md">
          <h3 className="font-bold mb-2">{selectedTemplate.name}</h3>
          <p>Tamanho: {selectedTemplate.storyLength}</p>
          <p>Temas: {selectedTemplate.themes.join(", ")}</p>
          <p>Idade recomendada: {selectedTemplate.age}</p>
        </div>
      )}
    </div>): (<></>)}
    </>
  )
}

