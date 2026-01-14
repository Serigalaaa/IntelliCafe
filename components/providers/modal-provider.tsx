"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react"

// 1. Add "confirm" to the modal types
type ModalType = "success" | "error" | "confirm" | null

interface ModalContextType {
  showSuccess: (title: string, message: string) => void
  showError: (title: string, message: string) => void
  // 2. Add the showConfirm signature
  showConfirm: (title: string, message: string, onConfirm: () => void) => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function GlobalModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [type, setType] = useState<ModalType>(null)
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  
  // 3. State to hold the function to run if user clicks "Continue"
  const [onConfirmAction, setOnConfirmAction] = useState<(() => void) | null>(null)

  const showSuccess = (title: string, message: string) => {
    setType("success")
    setTitle(title)
    setMessage(message)
    setIsOpen(true)
    setOnConfirmAction(null)
  }

  const showError = (title: string, message: string) => {
    setType("error")
    setTitle(title)
    setMessage(message)
    setIsOpen(true)
    setOnConfirmAction(null)
  }

  // 4. Implement showConfirm
  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setType("confirm")
    setTitle(title)
    setMessage(message)
    // Store the function to run later
    setOnConfirmAction(() => onConfirm)
    setIsOpen(true)
  }

  const handleConfirm = () => {
    if (type === "confirm" && onConfirmAction) {
      onConfirmAction() // Run the delete/action function
    }
    setIsOpen(false)
  }

  return (
    <ModalContext.Provider value={{ showSuccess, showError, showConfirm }}>
      {children}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              {type === "success" && <CheckCircle2 className="w-6 h-6 text-green-500" />}
              {type === "error" && <XCircle className="w-6 h-6 text-red-500" />}
              {type === "confirm" && <AlertTriangle className="w-6 h-6 text-amber-500" />}
              <AlertDialogTitle>{title}</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="pt-2 text-base">
              {message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {/* 5. Logic to show Cancel button ONLY for Confirm dialogs */}
            {type === "confirm" ? (
              <>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirm} className="bg-destructive hover:bg-destructive/90">
                  Confirm
                </AlertDialogAction>
              </>
            ) : (
              <AlertDialogAction onClick={() => setIsOpen(false)}>
                Okay
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ModalContext.Provider>
  )
}

export function useGlobalModal() {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error("useGlobalModal must be used within a GlobalModalProvider")
  }
  return context
}