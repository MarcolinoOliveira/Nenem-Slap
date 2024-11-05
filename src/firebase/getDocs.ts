import { allPaymentsProps, clientsProps, newBuyProps, promissoryPaymentProps } from "@/interface/globalInterfaces"
import { getDaysLate } from "@/lib/dateFormatter"
import { db } from "@/lib/firebase"
import { collection, doc, DocumentData, getDocs, onSnapshot, orderBy, query, where } from "firebase/firestore"
import { Dispatch, SetStateAction } from "react"

interface getAllClientsProps {
  setClients: Dispatch<SetStateAction<clientsProps[]>>
}

interface getAllClientsInactivesProps {
  setClientsInactive: Dispatch<SetStateAction<clientsProps[]>>
}

interface getAllPaymentsProps {
  setAllPayments: Dispatch<SetStateAction<allPaymentsProps[]>>
}

interface getClientProps {
  id: string
  setClient: Dispatch<SetStateAction<DocumentData>>
}

interface getPromissoryPaymentClientProps {
  id: string
  setPromissoryPayment: Dispatch<SetStateAction<promissoryPaymentProps[]>>
}

interface getPromissoryBuyClientProps {
  id: string
  setPromissoryBuy: Dispatch<SetStateAction<newBuyProps[]>>
}


export async function getAllClients({ setClients }: getAllClientsProps) {
  const ref = collection(db, "clientes")
  onSnapshot(query(ref, where("status", "==", "ativo"), orderBy('name')), (snapshot) => {
    const res = snapshot.docs.map((doc) => {
      const { name, maturity, telephone, currentValue, title, inputValue, datePurchase, purchaseValue } = doc.data() as clientsProps

      const newDaysLater = getDaysLate(maturity)
      const status = newDaysLater <= 0 ? 'OK' : 'Vencido'
      const id = doc.id

      return { id, name, title, maturity, status, telephone, currentValue, inputValue, datePurchase, purchaseValue }
    })
    setClients(res)
  })
}

export async function getAllClientsInactives({ setClientsInactive }: getAllClientsInactivesProps) {
  const ref = query(collection(db, "clientes"), where("status", "==", "inativo"), orderBy('name'))
  onSnapshot(ref, (snapshot) => {
    const res = snapshot.docs.map((doc) => ({ ...doc.data() as clientsProps, id: doc.id }))
    setClientsInactive(res)
  })
}

export async function getAllPayments({ setAllPayments }: getAllPaymentsProps) {
  const ref = collection(db, 'pagamentos')
  onSnapshot(ref, (snapshot) => {
    const res = snapshot.docs.map((doc) => ({ ...doc.data() as allPaymentsProps, id: doc.id }))
    setAllPayments(res)
  })
}

export function getClient({ id, setClient }: getClientProps) {
  if (id) {
    const ref = doc(db, 'clientes', id)
    onSnapshot(ref, (doc) => {
      if (doc.exists()) {
        setClient({ ...doc.data(), id: doc.id })
      }
    })
  }
}

export async function getPromissoryPaymentClient({ id, setPromissoryPayment }: getPromissoryPaymentClientProps) {
  if (id) {
    const ref = collection(db, `clientes/${id}/payments`)
    onSnapshot(query(ref, orderBy('datePayment', "desc")), (snapshot) => {
      const res = snapshot.docs.map((doc) => ({ ...doc.data() as promissoryPaymentProps, id: doc.id }))
      setPromissoryPayment(res)
    })
  }
}

export async function getPromissoryBuyClient({ id, setPromissoryBuy }: getPromissoryBuyClientProps) {
  if (id) {
    const ref = collection(db, `clientes/${id}/buys`)
    onSnapshot(query(ref, orderBy('datePurchase', 'desc')), (snapshot) => {
      const res = snapshot.docs.map((doc) => ({ ...doc.data() as newBuyProps, id: doc.id }))
      setPromissoryBuy(res)
    })
  }
}