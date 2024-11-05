'use client'

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { use, useState } from "react"
import { CirclePlus } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from "../ui/input"
import MaskedTelephoneInput from "@/lib/masks/MaskTelephoneInput"
import MaskedCurrencyInput from "@/lib/masks/MaskCurrencyInput"
import { clientsProps } from "@/interface/globalInterfaces"
import { addClientDoc } from "@/firebase/addDocs"
import { Button } from "../ui/button";
import ClientsDataContext from "@/context/ClientsDataContext";
import { PaymentMethods } from "../global/PaymentsMethods";
import { getTotalPayments } from "@/lib/dateFormatter";


export function AddClientModal() {

  const { toast } = useToast()
  const { allPayments } = use(ClientsDataContext)

  const [open, setOpen] = useState<boolean>(false)
  const [method, setMethod] = useState<string>('')

  const [client, setClient] = useState<clientsProps>({
    id: '',
    name: '',
    title: '',
    telephone: '',
    currentValue: '',
    status: '',
    datePurchase: '',
    inputValue: '',
    maturity: '',
    purchaseValue: ''
  })

  const endValue = parseFloat(client.currentValue?.replace(/R\$\s?|/g, '').replace(',', '.')) -
    parseFloat(client.inputValue?.replace(/R\$\s?|/g, '').replace(',', '.'))

  const addclient = async () => {
    const [year, month, day] = client.datePurchase?.split('-')
    const { idSec, totalValuePayments } = getTotalPayments(client.datePurchase, allPayments)

    if (client.name === '' || client.currentValue === '' || client.datePurchase === '') {
      toast({
        variant: "default",
        title: 'Campos Inválidos',
        description: 'Preencha todos os campos obrigatórios',
        duration: 3000,
        className: 'border-2 border-red-500'
      })
    } else if (parseInt(day) > 28) {
      toast({
        variant: "default",
        title: 'Data inválida',
        description: 'Informe um dia até dia 28',
        duration: 3000,
        className: 'border-2 border-red-500'
      })
    } else if (endValue < 0) {
      toast({
        variant: "default",
        title: 'Valor inválido',
        description: 'Informe um valor menor',
        duration: 3000,
        className: 'border-2 border-red-500'
      })
    } else {
      addClientDoc(client, idSec, totalValuePayments, method)
      toast({
        variant: "default",
        title: "Cliente Adicionado com sucesso.",
        duration: 3000,
        className: 'border-2 border-green-500'
      })
      setOpen(prev => !prev)
      setClient({ id: '', name: '', title: '', telephone: '', currentValue: '', status: '', datePurchase: '', inputValue: '', maturity: '', purchaseValue: '' })

    }
  }

  const cancelarAddclient = () => {
    setClient({ id: '', name: '', title: '', telephone: '', currentValue: '', status: '', datePurchase: '', inputValue: '', maturity: '', purchaseValue: '' })
  }

  return (
    <div>
      <div className="flex md:hidden">
        <Button variant="default" size='icon' asChild onClick={() => setOpen(prev => !prev)}>
          <CirclePlus className="w-14 h-10 text-white p-2" />
        </Button>
      </div>
      <div className="hidden md:flex">
        <Button variant="default" className="flex gap-1 text-white" onClick={() => setOpen(prev => !prev)}>
          <CirclePlus />
          <p className="hidden sm:flex">Novo Cliente</p>
        </Button>
      </div>
      <Dialog open={open} onOpenChange={() => setOpen(prev => !prev)}>
        <DialogContent className="w-[340px] sm:w-[400px]">
          <DialogHeader className="flex items-center justify-center">
            <DialogTitle>Novo Cliente</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center gap-2">
              <Label htmlFor="name" className="text-left w-full font-semibold">
                Nome:*
              </Label>
              <Input
                id="name"
                type="string"
                onChange={(e) => setClient({ ...client, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="flex flex-col items-center gap-2">
              <Label htmlFor="name" className="text-left w-full font-semibold">
                Titulo da Venda:*
              </Label>
              <Input
                id="title"
                type="string"
                onChange={(e) => setClient({ ...client, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="flex flex-col items-center gap-2">
              <Label htmlFor="username" className="text-left w-full font-semibold">
                Número do Celular:
              </Label>
              <MaskedTelephoneInput value={client.telephone} onChange={(e) => setClient({ ...client, telephone: e })} />
            </div>
            <div className="flex gap-2 w-full">
              <div className="flex flex-col items-center gap-2 w-1/2">
                <Label htmlFor="username" className="text-left w-full font-semibold">
                  Valor da Venda:*
                </Label>
                <MaskedCurrencyInput value={client.currentValue} onChange={(e) => setClient({ ...client, currentValue: e })} />
              </div>
              <div className="flex flex-col items-center gap-2 w-1/2">
                <Label htmlFor="username" className="text-left w-full font-semibold">
                  Entrada:
                </Label>
                <MaskedCurrencyInput value={client.inputValue} onChange={(e) => setClient({ ...client, inputValue: e })} />
              </div>
            </div>

            {client.inputValue &&
              <PaymentMethods open={open} setMethod={setMethod} />
            }

            <div className="flex flex-col items-center gap-2">
              <Label htmlFor="username" className="text-left w-full font-semibold">
                Data da Venda:*
              </Label>
              <Input
                id="maturity"
                type="Date"
                className="col-span-3"
                onChange={(e) => setClient({ ...client, datePurchase: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <div className="flex gap-1 sm:gap-2 w-full">
              <DialogClose asChild>
                <Button type="button" variant='outline' onClick={cancelarAddclient} className="w-full">Cancelar</Button>
              </DialogClose>
              <Button type="submit" onClick={() => addclient()} className="w-full text-white">Salvar</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}