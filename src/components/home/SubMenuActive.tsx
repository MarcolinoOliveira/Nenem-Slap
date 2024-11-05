'use client'

import { Dispatch, SetStateAction } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { PopoverClose } from "@radix-ui/react-popover"
import { Button } from "../ui/button"
import { ChevronDown } from "lucide-react"

interface SubMenuActiveProps {
  statusClient: string
  clientsInactives: () => void
  setStatusClient: Dispatch<SetStateAction<string>>
}

export const SubMenuActive = ({ statusClient, clientsInactives, setStatusClient }: SubMenuActiveProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="default">
          <p className="text-white font-bold">{statusClient}</p>
          <ChevronDown className="text-white" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto items-start p-1" align='start'>
        <PopoverClose asChild>
          <div className="flex flex-col gap-2">
            <Button onClick={() => setStatusClient("Ativos")} className="text-white font-bold">Ativos</Button>
            <Button onClick={() => clientsInactives()} className="text-white font-bold">Inativos</Button>
          </div>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  )
}