"use client"

import React, { createContext, useContext, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertCircle } from "lucide-react"

interface ModalContextType {
  showSuccess: (title: string, message: string) => void
  showError: (title: string, message: string) => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function GlobalModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<"success" | "error">("success")
  const [content, setContent] = useState({ title: "", message: "" })

  const showSuccess = (title: string, message: string) => {
    setType("success")
    setContent({ title, message })
    setOpen(true)
  }

  const showError = (title: string, message: string) => {
    setType("error")
    setContent({ title, message })
    setOpen(true)
  }

  return (
    <ModalContext.Provider value={{ showSuccess, showError }}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm text-center">
          <DialogHeader>
            <div className="mx-auto mb-4 bg-muted p-3 rounded-full w-fit">
              {type === "success" ? (
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              ) : (
                <AlertCircle className="w-8 h-8 text-red-600" />
              )}
            </div>
            <DialogTitle className="text-center text-xl">{content.title}</DialogTitle>
            <DialogDescription className="text-center pt-2">
              {content.message}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center mt-4">
            <Button onClick={() => setOpen(false)} className="w-full sm:w-auto min-w-[100px]">
              Okay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ModalContext.Provider>
  )
}

export const useGlobalModal = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error("useGlobalModal must be used within a GlobalModalProvider")
  }
  return context
}