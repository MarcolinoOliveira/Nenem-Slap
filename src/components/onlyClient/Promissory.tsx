'use client'

import { getClient, getPromissoryBuyClient, getPromissoryPaymentClient } from "@/firebase/getDocs"
import { DocumentData } from "firebase/firestore"
import { useEffect, useState } from "react"
import { PaymentPromissoryModal } from "./PaymentPromissoryModal"
import { NewBuyModal } from "./NewBuyModal"
import { newBuyProps, promissoryPaymentProps } from "@/interface/globalInterfaces"
import { SubMenuPromissory } from "./SubMenuPromissory"
import { SubMenuBuys } from "./SubMenuBuys"

interface promissoryProps {
  id: string
}

export const Promissory = ({ id }: promissoryProps) => {

  const [client, setClient] = useState<DocumentData>()
  const [promissoryPayment, setPromissoryPayment] = useState<promissoryPaymentProps[]>([])
  const [promissoryBuy, setPromissoryBuy] = useState<newBuyProps[]>([])

  useEffect(() => {
    getClient({ id, setClient })
    getPromissoryPaymentClient({ id, setPromissoryPayment })
    getPromissoryBuyClient({ id, setPromissoryBuy })
  }, [])

  const payment = parseFloat(client?.totalValue.replace(/R\$\s?|/g, '').replace(',', '.')) -
    parseFloat(client?.currentValue.replace(/R\$\s?|/g, '').replace(',', '.'))

  const totalReceive = 'R$ ' + payment.toFixed(2).replace('.', ',')

  return (
    <div className="w-full mt-24 sm:mt-3 px-3">
      <div className="flex w-full py-4 items-center justify-center border-t-2 border-border rounded-full shadow-md shadow-slate-600 bg-accent">
        <h1 className="font-bold">{client?.name}</h1>
      </div>
      <div className="flex flex-col w-full h-auto gap-5 pt-4">
        <div className="flex w-full flex-wrap gap-4">
          <div className="flex items-center py-2 px-1 w-[165px] justify-between flex-col border-t-2 border-border rounded-lg shadow-md shadow-slate-600">
            <div className="flex flex-col items-center gap-2 px-3 w-f">
              <p className="font-semibold">{client?.datePurchase}</p>
              <p className="font-semibold">{client?.title}</p>
            </div>
            <div className="flex items-center mt-2 justify-between">
              <p className="font-bold text-[20px]">{client?.purchaseValue}</p>
              {client && !promissoryBuy.length && <SubMenuBuys client={client} newBuy={promissoryBuy[0]} />}
            </div>
          </div>
          {promissoryBuy?.map((e, key) => (
            <div key={key} className="flex items-center py-2 px-1 w-[165px] border-t-2 border-border rounded-lg shadow-md shadow-slate-600 flex-col">
              <div className="flex flex-col items-center gap-2">
                <p className="font-semibold">{e?.datePurchase.split("-").reverse().join("/")}</p>
                <p className="font-semibold">{e?.title}</p>
              </div>
              <div className="flex items-center mt-2 justify-between">
                <p className="font-bold text-[20px]">{e?.purchaseValue}</p>
                {client && (key === promissoryBuy.length - 1) && <SubMenuBuys client={client} newBuy={e} />}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between w-full p-4 border-t-2 border-border rounded-full shadow-md shadow-slate-600 mt-2 bg-accent">
          <p className="font-bold">Total Comprado:</p>
          <p className="font-bold text-2xl">{client?.totalValue}</p>
        </div>

        <div className="flex items-center justify-between w-full p-4 border-t-2 border-border rounded-full shadow-md shadow-slate-600 bg-accent">
          <p className="font-bold">Divida Atual:</p>
          <p className="font-bold text-2xl text-red-500">{client?.currentValue}</p>
        </div>

        <div className="flex items-center justify-between w-full p-4 border-t-2 border-border rounded-full shadow-md shadow-slate-600 bg-accent">
          <p className="font-bold">Total Pago:</p>
          <p className="font-bold text-2xl text-green-500">{totalReceive}</p>
        </div>

        <div className="flex w-full justify-between gap-2">
          <NewBuyModal id={id} totalValue={client?.totalValue} currentValue={client?.currentValue} maturity={client?.maturity} status={client?.status} />
          <PaymentPromissoryModal id={id} currentValue={client?.currentValue} maturity={client?.maturity} />
        </div>
      </div>
      <div className="border-2 border-primary rounded-2xl mt-4">
        <div className="flex w-full justify-between items-center bg-primary rounded-t-2xl px-2">
          <p className="text-xl text-white font-bold py-3">Pagamentos</p>
          <p className="text-white font-semibold">Venc. {client?.maturity}</p>
        </div>

        {promissoryPayment?.map((e, key) => (
          <div key={key} className={`flex bg-accent w-full py-6 pl-2 border-b border-slate-400 ${client?.inputValue == '' ? (key === promissoryPayment?.length - 1) ? 'rounded-b-2xl' : '' : ''}`}>
            <p className="flex w-[30%] font-semibold justify-start items-center">{e.datePayment.split("-").reverse().join("/")}</p>
            <p className="flex w-[30%] font-semibold justify-center items-center">{e.method}</p>
            <p className="flex w-[30%] font-semibold justify-end items-center">{e.valuePayment}</p>
            {client && (key === 0) &&
              <div className="flex flex-1 justify-end items-center">
                <SubMenuPromissory client={client} promissoryPayment={e} />
              </div>}
          </div>
        ))}
        {client && (payment != 0) && (client?.inputValue != '') &&
          <div className="flex bg-accent w-full py-6 pl-2 rounded-b-2xl">
            <p className="flex w-[30%] font-semibold justify-start items-center">{client?.datePurchase}</p>
            <p className="flex w-[30%] font-semibold justify-center items-center">{client?.method}</p>
            <p className="flex w-[30%] font-semibold justify-end items-center">{client?.inputValue}</p>
            {!promissoryPayment.length &&
              <div className="flex flex-1 justify-end items-center">
                <SubMenuPromissory client={client} promissoryPayment={promissoryPayment[0]} />
              </div>}
          </div>
        }
      </div>
    </div>
  )
}