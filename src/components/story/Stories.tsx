"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Icon, type IconName } from "../icons"
import { cn } from "@/lib/utils"

export interface StoryData {
  id: number
  date: string
  title: string
  prompt: string
  story: string
}

const formatDate = (date: string): string => {
  const parsedDate = new Date(date)
  return parsedDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

const headerItems = [
  { icon: "LuCalendar" as IconName, label: "Data" },
  { icon: "LuBook" as IconName, label: "História" },
]

interface StoriesProps {
  storiesData: StoryData[] | null
  onRowClick: (story: StoryData) => void
}

export const Stories: React.FC<StoriesProps> = ({ storiesData, onRowClick }) => {
  const [selectedStory, setSelectedStory] = useState<number | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  if (!storiesData) return null

  const handleRowClick = (story: StoryData) => {
    setSelectedStory(story.id)
    onRowClick(story)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Icon name="LuLibrary" className="mr-2 h-4 w-4" />
          Abrir Biblioteca
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Biblioteca</DialogTitle>
        </DialogHeader>
        <Card className="bg-background">
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {headerItems.map((item, index) => (
                      <TableHead key={index} className="text-left p-2 md:p-4">
                        <div className="flex items-center gap-2">
                          <Icon name={item.icon} size={16} className="text-primary" />
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {storiesData.map((story) => (
                    <TableRow
                      key={story.id}
                      className={cn(
                        "border-b border-border transition-colors cursor-pointer",
                        selectedStory === story.id ? "bg-primary/10" : "hover:bg-muted/50",
                      )}
                      onClick={() => handleRowClick(story)}
                    >
                      <TableCell className="p-2 md:p-4">
                        <span className="text-sm">{formatDate(story.date)}</span>
                      </TableCell>
                      <TableCell className="p-2 md:p-4">
                        <span className="text-sm font-medium line-clamp-2">{story.title}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}

