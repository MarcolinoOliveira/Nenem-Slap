import { clientsProps, newBuyProps, paymentProps } from "@/interface/globalInterfaces";
import { formatIdPaymentMonth, getNewMaturity } from "@/lib/dateFormatter";
import { db } from "@/lib/firebase";
import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";

interface addPaymentPromissoryProps {
  id: string
  idSec: string
  totalValuePayments: number
  currentValue: string
  payment: paymentProps
  maturity: string
  method: string
}

interface addNewBuyProps {
  id: string
  totalValue: string
  newBuy: newBuyProps
  currentValue: string
  maturity: string
  method: string
  idSec: string
  totalValuePayments: number
}

export async function addClientDoc(client: clientsProps, idSec: string, totalValuePayments: number, method: string) {
  if (client) {
    const ref = collection(db, 'clientes')

    const newTotalValue = totalValuePayments + parseFloat(client.inputValue?.replace(/R\$\s?|/g, '').replace(',', '.'))

    const inputValueNumber = parseFloat(client.inputValue?.replace(/R\$\s?|/g, '').replace(',', '.'))
    const currentValueNumber = parseFloat(client.currentValue?.replace(/R\$\s?|/g, '').replace(',', '.'))

    const newCurrentValue = client.inputValue != '' ? (currentValueNumber - inputValueNumber) : currentValueNumber
    const newCurrentValueString = 'R$ ' + newCurrentValue.toFixed(2).replace('.', ',')


    const payload = {
      name: client.name,
      title: client.title,
      telephone: client.telephone,
      totalValue: client.currentValue,
      currentValue: newCurrentValueString,
      purchaseValue: client.currentValue,
      datePurchase: client.datePurchase?.split('-').reverse().join('/'),
      status: 'ativo',
      maturity: getNewMaturity(client.datePurchase),
      inputValue: client.inputValue,
      method: method
    }

    const payloadAllPayments = {
      currentValue: newTotalValue,
      date: client.datePurchase
    }

    await addDoc(ref, payload)

    if (client.inputValue != '') {
      if (idSec === '') {
        const id = formatIdPaymentMonth(client.datePurchase)
        const ref = doc(db, 'pagamentos', id)
        await setDoc(ref, payloadAllPayments)
      } else {
        const docUpdatePayment = doc(db, 'pagamentos', idSec)
        await updateDoc(docUpdatePayment, payloadAllPayments)
      }
    }
  }
}

export async function addPaymentPromissory({ id, idSec, totalValuePayments, currentValue, payment, maturity, method }: addPaymentPromissoryProps) {
  if (id) {
    const refPayment = collection(db, `clientes/${id}/payments`)
    const refDoc = doc(db, 'clientes', id)

    const newValue = parseFloat(currentValue?.replace(/R\$\s?|/g, '').replace(',', '.')) -
      parseFloat(payment.valuePayment?.replace(/R\$\s?|/g, '').replace(',', '.'))

    const newStatus = newValue === 0 ? 'inativo' : 'ativo'
    const newMaturity = getNewMaturity(maturity)
    const newValueString = 'R$ ' + newValue.toFixed(2).replace('.', ',')

    const newTotalValue = totalValuePayments + parseFloat(payment.valuePayment?.replace(/R\$\s?|/g, '').replace(',', '.'))

    const payloadPayment = {
      valuePayment: payment.valuePayment,
      method: method,
      datePayment: payment.datePayment
    }

    const payloadUpdate = {
      status: newStatus,
      maturity: newValue === 0 ? '' : newMaturity,
      currentValue: newValueString
    }

    const payloadAllPayment = {
      date: payment.datePayment,
      currentValue: newTotalValue
    }

    await addDoc(refPayment, payloadPayment)
    await updateDoc(refDoc, payloadUpdate)

    if (idSec === '') {
      const id = formatIdPaymentMonth(payment.datePayment)
      const ref = doc(db, 'pagamentos', id)
      await setDoc(ref, payloadAllPayment)
    } else {
      const docUpdatePayment = doc(db, 'pagamentos', idSec)
      await updateDoc(docUpdatePayment, payloadAllPayment)
    }
  }
}

export async function addNewBuyPromissory({ id, totalValue, newBuy, currentValue, maturity, method, idSec, totalValuePayments }: addNewBuyProps) {
  if (id) {
    const refNewBuy = collection(db, `clientes/${id}/buys`)
    const refDoc = doc(db, 'clientes', id)

    const currentValueNumber = parseFloat(currentValue?.replace(/R\$\s?|/g, '').replace(',', '.'))
    const totalValueNumber = parseFloat(totalValue?.replace(/R\$\s?|/g, '').replace(',', '.'))
    const buyValue = parseFloat(newBuy.purchaseValue?.replace(/R\$\s?|/g, '').replace(',', '.'))

    const newTotalValue = totalValueNumber + buyValue
    let newCurrentValue = 0
    const newMaturity = getNewMaturity(newBuy.datePurchase)


    if (newBuy.inputValue) {
      const inputValueNumber = parseFloat(newBuy.inputValue?.replace(/R\$\s?|/g, '').replace(',', '.'))
      newCurrentValue += currentValueNumber + (buyValue - inputValueNumber)
    } else {
      newCurrentValue += currentValueNumber + buyValue
    }

    const newTotalValueString = 'R$ ' + newTotalValue.toFixed(2).replace('.', ',')
    const newCurrentValueString = 'R$ ' + newCurrentValue.toFixed(2).replace('.', ',')

    const payloadBuy = {
      title: newBuy.title,
      purchaseValue: newBuy.purchaseValue,
      datePurchase: newBuy.datePurchase?.split('-').reverse().join('/')
    }

    const payloadUpdate = {
      totalValue: newTotalValueString,
      currentValue: newCurrentValueString,
      status: 'ativo',
      maturity: currentValueNumber === 0 ? newMaturity : maturity
    }

    await addDoc(refNewBuy, payloadBuy)
    await updateDoc(refDoc, payloadUpdate)

    if (newBuy.inputValue) {
      const refPayment = collection(db, `clientes/${id}/payments`)
      const payloadPayment = {
        datePayment: newBuy.datePurchase,
        method: method,
        valuePayment: newBuy.inputValue
      }
      await addDoc(refPayment, payloadPayment)

      const newTotalValue = totalValuePayments + parseFloat(newBuy.inputValue?.replace(/R\$\s?|/g, '').replace(',', '.'))

      const payloadAllPayment = {
        date: newBuy.datePurchase,
        currentValue: newTotalValue
      }

      if (idSec === '') {
        const id = formatIdPaymentMonth(newBuy.datePurchase)
        const ref = doc(db, 'pagamentos', id)
        await setDoc(ref, payloadAllPayment)
      } else {
        const docUpdatePayment = doc(db, 'pagamentos', idSec)
        await updateDoc(docUpdatePayment, payloadAllPayment)
      }
    }
  }
}