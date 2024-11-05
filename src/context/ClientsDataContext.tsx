'use client'

import { allPaymentsProps, clientsProps } from "@/interface/globalInterfaces"
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react"

interface ClientsDataContextProps {
  clients: clientsProps[]
  allPayments: allPaymentsProps[]
  setClients: Dispatch<SetStateAction<clientsProps[]>>
  setAllPayments: Dispatch<SetStateAction<allPaymentsProps[]>>
}

const ClientsDataContext = createContext({} as ClientsDataContextProps)

export const ClientsDataProvider = ({ children }: { children: ReactNode }) => {
  const [clients, setClients] = useState<clientsProps[]>([])
  const [allPayments, setAllPayments] = useState<allPaymentsProps[]>([])

  return (
    <ClientsDataContext.Provider value={{ clients, allPayments, setClients, setAllPayments }}>
      {children}
    </ClientsDataContext.Provider>
  )
}

export default ClientsDataContext