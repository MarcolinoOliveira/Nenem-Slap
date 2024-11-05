'use client'

import { useState, Dispatch, SetStateAction, useEffect } from "react"
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"

interface methodsProps {
  pix: boolean,
  dinheiro: boolean,
  cartao: boolean
}

interface PaymentMethosProps {
  open: boolean
  setMethod: Dispatch<SetStateAction<string>>
}

export const PaymentMethods = ({ open, setMethod }: PaymentMethosProps) => {

  const [methods, setMethods] = useState<methodsProps>({
    pix: false,
    dinheiro: false,
    cartao: false
  })

  useEffect(() => {
    setMethods({ pix: false, dinheiro: false, cartao: false })
  }, [open])

  const handleMethods = (method: string) => {
    if (method === 'Pix') {
      setMethods({ pix: true, dinheiro: false, cartao: false })
      setMethod(method)
    }
    if (method === 'Dinheiro') {
      setMethods({ pix: false, dinheiro: true, cartao: false })
      setMethod(method)
    }
    if (method === 'Cartão') {
      setMethods({ pix: false, dinheiro: false, cartao: true })
      setMethod(method)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Label htmlFor="username" className="text-left w-full font-semibold">
        Forma de Pagamento:
      </Label>
      <div className="flex gap-6">
        <div className="flex gap-2 items-center justify-center">
          <Checkbox id="pix" onClick={() => handleMethods('Pix')} checked={methods.pix} />
          <Label htmlFor="username" className="text-left font-semibold">
            Pix
          </Label>
        </div>
        <div className="flex gap-2 items-center justify-center">
          <Checkbox id="dinehiro" onClick={() => handleMethods('Dinheiro')} checked={methods.dinheiro} />
          <Label htmlFor="username" className="text-left font-semibold">
            Dinheiro
          </Label>
        </div>
        <div className="flex gap-2 items-center justify-center">
          <Checkbox id="cartao" onClick={() => handleMethods('Cartão')} checked={methods.cartao} />
          <Label htmlFor="username" className="text-left font-semibold">
            Cartão
          </Label>
        </div>
      </div>
    </div>
  )
}