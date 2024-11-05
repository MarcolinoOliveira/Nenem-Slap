'use client'

import { Dispatch, SetStateAction, useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { useToast } from "@/hooks/use-toast"
import { changeDataClientProps, clientsProps } from "@/interface/globalInterfaces"
import { updateDocClient } from "@/firebase/updateDocs"

type changeUserDataProps = {
  client: clientsProps
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

export function ChangeDataClient({ client, open, setOpen }: changeUserDataProps) {
  const { toast } = useToast()

  const [changeClient, setChangeCient] = useState<changeDataClientProps>({
    id: client.id,
    name: client.name,
    date: client.maturity
  })

  const changeData = () => {
    const [year, month, day] = changeClient.date.split('-')

    if (changeClient?.name === '' || changeClient?.date === '') {
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
      updateDocClient(changeClient)
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
              Nome:*
            </Label>
            <Input
              id="name"
              type="string"
              defaultValue={changeClient.name}
              onChange={(e) => setChangeCient({ ...changeClient, name: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="flex flex-col items-center gap-4">
            <Label htmlFor="username" className="text-left w-full font-semibold">
              Vencimento:*
            </Label>
            <Input
              id="data"
              type="Date"
              defaultValue={changeClient.date?.split('/').reverse().join('-')}
              onChange={(e) => setChangeCient({ ...changeClient, date: e.target.value })}
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