'use client'

import { getAllClients, getAllPayments } from "@/firebase/getDocs"
import { use, useEffect } from "react"
import ClientsDataContext from "@/context/ClientsDataContext"
import Link from "next/link"
import Image from "next/image"
import { ToggleTheme } from "./ToggleTheme"

export const TopBar = () => {
  const { setClients, setAllPayments } = use(ClientsDataContext)

  useEffect(() => {
    getAllClients({ setClients })
    getAllPayments({ setAllPayments })
  }, [])

  return (
    <div className="flex w-full md:max-w-7xl md:mx-auto justify-between h-auto py-5 px-2 fixed sm:relative z-50 bg-background">
      <div className="flex w-2/4 justify-start items-center ml-4 sm:ml-0">
        <Link href='/'>
          <Image src='/logo.png' alt="logo" width={100} height={100} quality={100} />
        </Link>
      </div>
      <ToggleTheme />
    </div>
  )
}