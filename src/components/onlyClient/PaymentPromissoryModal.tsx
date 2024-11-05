'use client'

import MaskedCurrencyInput from "@/lib/masks/MaskCurrencyInput"
import { Button } from "../ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Label } from "../ui/label"
import { use, useState } from "react"
import { Input } from "../ui/input"
import { paymentProps } from "@/interface/globalInterfaces"
import { addPaymentPromissory } from "@/firebase/addDocs"
import { useToast } from "@/hooks/use-toast"
import ClientsDataContext from "@/context/ClientsDataContext"
import { PaymentMethods } from "../global/PaymentsMethods"
import { getTotalPayments } from "@/lib/dateFormatter"


interface PaymentPromissoryModalProps {
  id: string
  currentValue: string
  maturity: string
}

export const PaymentPromissoryModal = ({ id, currentValue, maturity }: PaymentPromissoryModalProps) => {

  const { toast } = useToast()
  const { allPayments } = use(ClientsDataContext)

  const [open, setOpen] = useState<boolean>(false)
  const [method, setMethod] = useState<string>('')
  const [payment, setPayment] = useState<paymentProps>({
    id: '',
    valuePayment: '',
    datePayment: '',
  })

  const valueNumber = parseFloat(currentValue?.replace(/R\$\s?|/g, '').replace(',', '.'))
  const valuePaymentNUmber = parseFloat(payment.valuePayment?.replace(/R\$\s?|/g, '').replace(',', '.'))

  const addPayment = () => {

    const { idSec, totalValuePayments } = getTotalPayments(payment.datePayment, allPayments)

    if (payment.datePayment === '' || payment.valuePayment === '') {
      toast({
        variant: "default",
        title: 'Campos Inválidos',
        description: 'Preencha todos os campos obrigatórios',
        duration: 3000,
        className: 'border-2 border-red-500'
      })
    } else if (valueNumber - valuePaymentNUmber < 0) {
      toast({
        variant: "default",
        title: 'Valor inválido',
        description: 'Informe um valor menor',
        duration: 3000,
        className: 'border-2 border-red-500'
      })
    } else {
      addPaymentPromissory({ id, idSec, totalValuePayments, currentValue, payment, maturity, method })
      toast({
        variant: "default",
        title: 'Pagamento realizado com sucesso',
        duration: 3000,
        className: 'border-2 border-green-500'
      })
      setOpen(prev => !prev)
      setPayment({ id: '', valuePayment: '', datePayment: '' })
    }
  }

  const cancelPayment = () => {
    setPayment({ id: '', valuePayment: '', datePayment: '' })
  }

  return (
    <div className='w-1/2'>
      <Button variant="default" className="w-full text-white font-bold rounded-full text-base" onClick={() => setOpen(prev => !prev)}>Receber</Button>
      <Dialog open={open} onOpenChange={() => setOpen(prev => !prev)}>
        <DialogContent className="w-80 sm:max-w-[350px]">
          <DialogHeader className="flex items-center justify-center">
            <DialogTitle>Receber</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center gap-2">
              <Label htmlFor="name" className="text-left w-full font-semibold">
                Valor:*
              </Label>
              <MaskedCurrencyInput value={payment.valuePayment} onChange={(e) => setPayment({ ...payment, valuePayment: e })} />
            </div>
            <div className="flex flex-col items-center gap-2">
              <Label htmlFor="username" className="text-left w-full font-semibold">
                Data do Pagamento:*
              </Label>
              <Input
                id="date"
                className="col-span-3"
                type="Date"
                onChange={(e) => setPayment({ ...payment, datePayment: e.target.value })}
              />
            </div>
            <PaymentMethods open={open} setMethod={setMethod} />
          </div>
          <DialogFooter>
            <div className="w-full flex gap-2">
              <DialogClose asChild>
                <Button type="button" variant='outline' onClick={cancelPayment} className="w-full">Cancelar</Button>
              </DialogClose>
              <Button type="submit" onClick={() => addPayment()} className="w-full text-white">Salvar</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}