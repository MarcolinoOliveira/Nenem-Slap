'use client'

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "../ui/alert-dialog"
import { deleteBuyDoc } from "@/firebase/deleteDocs";
import { useToast } from "@/hooks/use-toast"
import { newBuyProps } from "@/interface/globalInterfaces";
import { DocumentData } from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";

type AlertModalDeleteProps = {
  client: DocumentData
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  buy: newBuyProps
}

export function DeleteBuyModal({ client, open, setOpen, buy }: AlertModalDeleteProps) {
  const { toast } = useToast()

  const handleDeleteBuy = () => {

    deleteBuyDoc(client, buy)
    toast({
      variant: "default",
      title: "Compra excluída com sucesso.",
      duration: 3000,
      className: 'border-2 border-green-500'
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={() => setOpen(prev => !prev)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente sua compra e removera seus dados de nossos servidores.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <div className="flex gap-2 items-center w-full">
            <AlertDialogCancel className="w-full">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBuy} className="w-full mt-2 sm:mt-0 text-white">Continue</AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}