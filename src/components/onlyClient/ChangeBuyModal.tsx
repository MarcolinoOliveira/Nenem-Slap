'use client'

import { Dispatch, SetStateAction, useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { useToast } from "@/hooks/use-toast"
import { newBuyProps } from "@/interface/globalInterfaces"
import { changeBuyHome } from "@/firebase/updateDocs"
import { DocumentData } from "firebase/firestore"
import MaskedCurrencyInput from "@/lib/masks/MaskCurrencyInput"

type changeUserDataProps = {
  client: DocumentData
  newBuy: newBuyProps
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

export function ChangeBuyModal({ client, open, setOpen, newBuy }: changeUserDataProps) {
  const { toast } = useToast()

  const [changeBuy, setChangeBuy] = useState<newBuyProps>({
    id: newBuy ? newBuy.id : client.id,
    title: newBuy ? newBuy.title : client.title,
    purchaseValue: newBuy ? newBuy.purchaseValue : client.purchaseValue,
    datePurchase: newBuy ? newBuy.datePurchase : client.datePurchase
  })

  const changeData = () => {
    const [year, month, day] = changeBuy.datePurchase.split('-')

    if (changeBuy?.title === '' || changeBuy?.purchaseValue === '' || changeBuy?.datePurchase === '') {
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
    } else {

      changeBuyHome(client, changeBuy, newBuy)

      toast({
        variant: "default",
        title: "Alterações feitas com sucesso.",
        duration: 3000,
        className: 'border-2 border-green-500'
      })
      setOpen(prev => !prev)
    }
  }

  return (
    <Dialog open={open} onOpenChange={() => setOpen(prev => !prev)}>
      <DialogContent className="w-80 sm:max-w-[400px]">
        <DialogHeader className="flex justify-center items-center">
          <DialogTitle>Alterar dados</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center gap-4">
            <Label htmlFor="name" className="text-left w-full font-semibold">
              Titulo da Venda:*
            </Label>
            <Input
              id="name"
              type="string"
              defaultValue={changeBuy.title}
              onChange={(e) => setChangeBuy({ ...changeBuy, title: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="flex flex-col items-center gap-2 w-full">
            <Label htmlFor="name" className="text-left w-full font-semibold">
              Valor da Venda:*
            </Label>
            <MaskedCurrencyInput value={changeBuy.purchaseValue} onChange={(e) => setChangeBuy({ ...changeBuy, purchaseValue: e })} />
          </div>
          <div className="flex flex-col items-center gap-4">
            <Label htmlFor="username" className="text-left w-full font-semibold">
              Data da Venda:*
            </Label>
            <Input
              id="data"
              type="Date"
              defaultValue={changeBuy.datePurchase?.split('/').reverse().join('-')}
              onChange={(e) => setChangeBuy({ ...changeBuy, datePurchase: e.target.value })}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <div className="flex w-full gap-1 sm:gap-2">
            <Button type="button" variant='outline' onClick={() => setOpen(prev => !prev)} className="w-full">Cancelar</Button>
            <Button type="submit" onClick={() => changeData()} className="w-full text-white">Salvar</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}