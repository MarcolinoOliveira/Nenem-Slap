'use client'

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "../ui/alert-dialog"
import { deleteClientDoc } from "@/firebase/deleteDocs";
import { useToast } from "@/hooks/use-toast"
import { Dispatch, SetStateAction } from "react";

type AlertModalDeleteProps = {
  id: string
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  status: string
}

export function DeleteClient({ id, open, setOpen, status }: AlertModalDeleteProps) {
  const { toast } = useToast()

  const handleDeleteUser = () => {
    if (status === 'inativo') {
      deleteClientDoc(id)
      toast({
        variant: "default",
        title: "Cliente excluído com sucesso.",
        duration: 3000,
        className: 'border-2 border-green-500'
      })
    } else {
      toast({
        variant: "default",
        title: "Error.",
        description: 'Cliente com promissória em aberto',
        duration: 3000,
        className: 'border-2 border-red-500'
      })
    }
  }
  return (
    <AlertDialog open={open} onOpenChange={() => setOpen(prev => !prev)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente seu
            cliente e removera seus dados de nossos servidores.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <div className="flex gap-2 items-center w-full">
            <AlertDialogCancel className="w-full">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="w-full mt-2 sm:mt-0 text-white">Continue</AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}