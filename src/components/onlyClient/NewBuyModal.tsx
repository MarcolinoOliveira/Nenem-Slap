'use client'

import MaskedCurrencyInput from "@/lib/masks/MaskCurrencyInput"
import { Button } from "../ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Label } from "../ui/label"
import { useState } from "react"
import { Input } from "../ui/input"
import { newBuyProps } from "@/interface/globalInterfaces"
import { addNewBuyPromissory } from "@/firebase/addDocs"
import { useToast } from "@/hooks/use-toast"


interface PaymentPromissoryModalProps {
  id: string
  totalValue: string
  currentValue: string
  maturity: string
}

export const NewBuyModal = ({ id, totalValue, currentValue, maturity }: PaymentPromissoryModalProps) => {

  const { toast } = useToast()

  const [open, setOpen] = useState<boolean>(false)
  const [newBuy, setNewBuy] = useState<newBuyProps>({
    id: '',
    title: '',
    purchaseValue: '',
    datePurchase: '',
  })

  const addNewBuy = () => {

    if (newBuy.title === '' || newBuy.purchaseValue === '' || newBuy.datePurchase === '') {
      toast({
        variant: "default",
        title: 'Campos Inválidos',
        description: 'Preencha todos os campos obrigatórios',
        duration: 3000,
        className: 'border-2 border-red-500'
      })
    } else {
      addNewBuyPromissory({ id, totalValue, newBuy, currentValue, maturity })
      toast({
        variant: "default",
        title: "Venda relizada com sucesso.",
        duration: 3000,
        className: 'border-2 border-green-500'
      })
      setOpen(prev => !prev)
      setNewBuy({ id: '', title: '', purchaseValue: '', datePurchase: '' })
    }
  }

  const cancelBuy = () => {
    setNewBuy({ id: '', title: '', purchaseValue: '', datePurchase: '' })
  }

  return (
    <div className="w-1/2">
      <Button variant="default" className="w-full text-white font-bold rounded-full text-base" onClick={() => setOpen(prev => !prev)}>Nova Venda</Button>
      <Dialog open={open} onOpenChange={() => setOpen(prev => !prev)}>
        <DialogContent className="w-[340px] sm:max-w-[350px]">
          <DialogHeader className="flex items-center justify-center">
            <DialogTitle>Nova Venda</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center gap-4">
              <Label htmlFor="name" className="text-left w-full font-semibold">
                Titulo da Venda:*
              </Label>
              <Input
                id="title"
                type="string"
                onChange={(e) => setNewBuy({ ...newBuy, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="flex flex-col items-center gap-2 w-full">
              <Label htmlFor="name" className="text-left w-full font-semibold">
                Valor da Venda:*
              </Label>
              <MaskedCurrencyInput value={newBuy.purchaseValue} onChange={(e) => setNewBuy({ ...newBuy, purchaseValue: e })} />
            </div>
            <div className="flex flex-col items-center gap-2">
              <Label htmlFor="username" className="text-left w-full font-semibold">
                Data da Venda:*
              </Label>
              <Input
                id="date"
                className="col-span-3"
                type="Date"
                onChange={(e) => setNewBuy({ ...newBuy, datePurchase: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <div className="w-full flex gap-2">
              <DialogClose asChild>
                <Button type="button" variant='outline' onClick={cancelBuy} className="w-full">Cancelar</Button>
              </DialogClose>
              <Button type="submit" onClick={() => addNewBuy()} className="w-full text-white">Salvar</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}