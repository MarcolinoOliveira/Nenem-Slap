'use client'

import { CSSProperties, use, useState } from "react"
import { Button } from "../ui/button"
import { AddClientModal } from "./AddClientModal"
import ClientsDataContext from "@/context/ClientsDataContext"
import { Input } from "../ui/input"
import { CircleDollarSign } from "lucide-react"
import { clientsProps } from "@/interface/globalInterfaces"
import { getAllClientsInactives } from "@/firebase/getDocs"
import AutoSizer from "react-virtualized-auto-sizer"
import { FixedSizeList } from "react-window"
import { SubMenuClient } from "./SubMenuClient"
import { SubMenuActive } from "./SubMenuActive"
import Link from "next/link"

interface rowListUsersProps {
  index: number,
  style: CSSProperties
}

export function TableClients() {

  const { clients } = use(ClientsDataContext)

  const [search, setSearch] = useState<string>("")
  const [statusClient, setStatusClient] = useState<string>("Ativos")
  const [clientsInactive, setClientsInactive] = useState<clientsProps[]>([])

  const searchClientsAtivos = clients?.filter(client => client.name.toLowerCase().includes(search.toLowerCase())
    || client.status?.toLowerCase().includes(search.toLowerCase()))

  const searchClientsInativos = clientsInactive?.filter(client => client.name.toLowerCase().includes(search.toLowerCase())
    || client.status?.toLowerCase().includes(search.toLowerCase()))

  const clientsInactives = () => {
    getAllClientsInactives({ setClientsInactive })
    setStatusClient("Inativos")
  }

  const rowListUsers = ({ index, style }: rowListUsersProps) => {

    const e = statusClient === 'Ativos' ? searchClientsAtivos[index] : searchClientsInativos[index]

    return (
      <div key={index} style={style} className={`flex w-full rounded-md border-b px-2 py-3 border-border ${index % 2 === 0 ? 'bg-border' : 'bg-accent'}`}>
        <div className="flex flex-1 flex-col w-full items-center">
          <Link href={`/promissoryClient/${e.id}`} className="w-full flex flex-1 items-center justify-center">
            <p className="flex w-full items-start font-semibold text-sm hover:text-primary hover:underline">{e.name}</p>
          </Link>
          {e.status != 'inativo' &&
            <div className="flex w-full gap-4 items-start">
              <p className="text-sm text-slate-400">{e.maturity}</p>
              <p className="text-sm text-slate-400">{e.telephone}</p>
            </div>}
        </div>
        <div className={`flex ${e.status === 'inativo' ? 'bg-slate-700' : e.status === 'OK' ? 'bg-green-500' : 'bg-red-500'}
                       w-[20%] sm:w-[15%] items-center rounded-xl justify-center h-8 my-auto`}>
          <p className="text-white">{e.status}</p>
        </div>
        <div className="flex w-[12%] justify-end items-center">
          <SubMenuClient client={e} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-auto rounded-lg h-[65vh] md:h-[58vh] mt-24 sm:mt-3">
      <div className="flex justify-between py-2">
        <SubMenuActive statusClient={statusClient} clientsInactives={clientsInactives} setStatusClient={setStatusClient} />
        <div className="flex gap-1">
          <div className="flex md:hidden">
            <Link href='financeiro'>
              <Button variant="default" size='icon' asChild>
                <CircleDollarSign className="w-14 h-10 text-white p-2" />
              </Button>
            </Link>
          </div>
          <div className="hidden md:flex">
            <Link href='financeiro'>
              <Button variant="default" className="flex gap-1 text-white">
                <CircleDollarSign />
                <p className="hidden sm:flex">Finançeiro</p>
              </Button>
            </Link>
          </div>
          <AddClientModal />
        </div>
      </div>
      <div className="flex items-center py-2">
        <Input placeholder="Pesquisar.." className="w-full" onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="flex w-full h-auto bg-primary rounded-t-lg justify-between p-3 text-white mt-2">
        <p className="flex flex-1 font-bold">Nome / Vencimento</p>
        <p className="w-1/5 font-bold">Status</p>
        <div>
          <p className="flex gap-1 justify-center items-center font-bold">
            Nº {statusClient === 'Ativos' ? searchClientsAtivos.length : searchClientsInativos.length}
          </p>
        </div>
      </div>
      <AutoSizer>
        {({ height, width }) => (
          <FixedSizeList
            height={height}
            width={width}
            itemCount={statusClient === 'Ativos' ? searchClientsAtivos.length : searchClientsInativos.length}
            itemSize={75}
          >
            {rowListUsers}
          </FixedSizeList>
        )}
      </AutoSizer>
    </div>
  )
}