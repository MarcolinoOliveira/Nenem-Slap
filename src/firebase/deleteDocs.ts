import { promissoryPaymentProps } from "@/interface/globalInterfaces";
import { getPreviousMaturity } from "@/lib/dateFormatter";
import { db } from "@/lib/firebase";
import { deleteDoc, doc, DocumentData, updateDoc } from "firebase/firestore";

export async function deleteClientDoc(id: string) {
  if (id) {
    const ref = doc(db, 'clientes', id)

    await deleteDoc(ref)
  }
}

export async function deletePaymentDoc(client: DocumentData, promissoryPayment: promissoryPaymentProps, idSec: string, totalValuePayments: number) {

  if (client.id) {

    const ref = doc(db, 'clientes', client.id)
    const refAll = doc(db, 'pagamentos', idSec)
    const refDel = doc(db, `clientes/${client.id}/payments`, promissoryPayment.id)

    const value = parseFloat(client.currentValue?.replace(/R\$\s?|/g, '').replace(',', '.')) + parseFloat(promissoryPayment.valuePayment?.replace(/R\$\s?|/g, '').replace(',', '.'))
    const allValue = totalValuePayments - parseFloat(promissoryPayment.valuePayment?.replace(/R\$\s?|/g, '').replace(',', '.'))

    const newCurrentValueString = 'R$ ' + value.toFixed(2).replace('.', ',')

    const payload = {
      maturity: getPreviousMaturity(client.maturity),
      currentValue: newCurrentValueString,
    }

    const payloadAllPayments = {
      currentValue: allValue
    }

    await updateDoc(ref, payload)
    await updateDoc(refAll, payloadAllPayments)
    await deleteDoc(refDel)
  }
}

export async function deletePaymentInput(client: DocumentData, idSec: string, totalValuePayments: number) {

  if (client.id) {
    const ref = doc(db, 'clientes', client.id)
    const refAll = doc(db, 'pagamentos', idSec)

    let value = 0
    let allValue = 0

    value += parseFloat(client.currentValue?.replace(/R\$\s?|/g, '').replace(',', '.')) + parseFloat(client.inputValue?.replace(/R\$\s?|/g, '').replace(',', '.'))
    allValue += totalValuePayments - parseFloat(client.inputValue?.replace(/R\$\s?|/g, '').replace(',', '.'))

    const newCurrentValueString = 'R$ ' + value.toFixed(2).replace('.', ',')

    const payload = {
      currentValue: newCurrentValueString,
      inputValue: ''
    }

    const payloadAllPayments = {
      currentValue: allValue
    }

    await updateDoc(ref, payload)
    await updateDoc(refAll, payloadAllPayments)
  }
}