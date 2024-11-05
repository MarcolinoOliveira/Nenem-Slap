'use client'

import ClientsDataContext from "@/context/ClientsDataContext";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "../ui/alert-dialog"
import { deletePaymentDoc, deletePaymentInput } from "@/firebase/deleteDocs";
import { useToast } from "@/hooks/use-toast"
import { promissoryPaymentProps } from "@/interface/globalInterfaces";
import { DocumentData } from "firebase/firestore";
import { Dispatch, SetStateAction, use } from "react";
import { getTotalPayments } from "@/lib/dateFormatter";

type AlertModalDeleteProps = {
  client: DocumentData
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  promissoryPayment: promissoryPaymentProps
}

export function DeletePayment({ client, open, setOpen, promissoryPayment }: AlertModalDeleteProps) {
  const { toast } = useToast()
  const { allPayments } = use(ClientsDataContext)

  const handleDeleteUser = () => {
    if (parseFloat(client.currentValue?.replace(/R\$\s?|/g, '').replace(',', '.')) > 0) {
      if (promissoryPayment) {
        const { idSec, totalValuePayments } = getTotalPayments(promissoryPayment.datePayment, allPayments)

        deletePaymentDoc(client, promissoryPayment, idSec, totalValuePayments)
        toast({
          variant: "default",
          title: "Pagamento excluído com sucesso.",
          duration: 3000,
          className: 'border-2 border-green-500'
        })
      } else {
        const newDate = client.datePurchase?.split('/').reverse().join('-')
        const { idSec, totalValuePayments } = getTotalPayments(newDate, allPayments)

        deletePaymentInput(client, idSec, totalValuePayments)
        toast({
          variant: "default",
          title: "Pagamento excluído com sucesso.",
          duration: 3000,
          className: 'border-2 border-green-500'
        })
      }
    } else {
      toast({
        variant: "default",
        title: "Esse pagamento não pode ser excluido.",
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
            pagamento e removera seus dados de nossos servidores.
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