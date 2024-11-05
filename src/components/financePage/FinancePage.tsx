'use client'

import ClientsDataContext from "@/context/ClientsDataContext"
import { filterPaymentByMonth, formatCurrentMonth, getCurrentMonth, totalCurrentPrice } from "@/lib/dateFormatter"
import { SquareArrowLeft, SquareArrowRight } from "lucide-react"
import { useState, useEffect, use } from "react"

export function FinancePage() {

  const { clients, allPayments } = use(ClientsDataContext)

  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth())
  const [totalValueMonth, setTotalvalueMonth] = useState<number>(0)
  const [totalRevenue, setTotalRevenue] = useState<number>(0)

  const handlePrevMonth = () => {
    const [year, month] = currentMonth.split('-')
    const currentDate = new Date(parseInt(year), parseInt(month) - 1, 1)
    currentDate.setMonth(currentDate.getMonth() - 1)
    setCurrentMonth(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`)
  }

  const handleNextMonth = () => {
    const [year, month] = currentMonth.split('-')
    const currentDate = new Date(parseInt(year), parseInt(month) - 1, 1)
    currentDate.setMonth(currentDate.getMonth() + 1)
    setCurrentMonth(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`)
  }

  useEffect(() => {
    if (!clients) return

    const paymentBymonths = filterPaymentByMonth(allPayments, currentMonth)
    const revenueEnterprise = totalCurrentPrice(clients)

    setTotalvalueMonth(paymentBymonths)
    setTotalRevenue(revenueEnterprise)

  }, [currentMonth])

  const formaterTotalRevenue = 'R$ ' + totalRevenue.toFixed(2).replace('.', ',')
  const formaterTotalValueMonth = 'R$ ' + totalValueMonth.toFixed(2).replace('.', ',')

  return (
    <div className="flex flex-col mt-24 sm:mt-3 p-2 gap-4">
      <div className="flex items-center justify-center gap-10 w-full lg:w-1/3 py-4 lg:py-2">
        <div onClick={handlePrevMonth} className="cursor-pointer ">
          <SquareArrowLeft className="text-primary hover:text-blue-300 w-8 h-8" />
        </div>
        <div>
          <p className="font-bold">{formatCurrentMonth(currentMonth)}</p>
        </div>
        <div onClick={handleNextMonth} className="cursor-pointer ">
          <SquareArrowRight className="text-primary hover:text-blue-300 w-8 h-8" />
        </div>
      </div>
      <div className="flex px-2 py-5 justify-between items-center border-t-2 border-border rounded-lg shadow-md shadow-slate-600">
        <p className="font-bold text-base">Total a Receber:</p>
        <p className="font-bold text-lg">{formaterTotalRevenue}</p>
      </div>
      <div className="flex px-2 py-5 justify-between items-center border-t-2 border-border rounded-lg shadow-md shadow-slate-600">
        <p className="font-bold text-base">Total Recebido:</p>
        <p className="font-bold text-lg text-green-400">{formaterTotalValueMonth}</p>
      </div>
    </div>
  )
}