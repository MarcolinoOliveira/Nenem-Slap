import { changeDataClientProps, newBuyProps } from "@/interface/globalInterfaces";
import { db } from "@/lib/firebase";
import { doc, DocumentData, updateDoc } from "firebase/firestore";


export async function updateDocClient(client: changeDataClientProps) {
  if (client.id) {
    const ref = doc(db, 'clientes', client.id)

    const payload = {
      name: client.name,
      maturity: client.date?.split('-').reverse().join('/'),
    }

    await updateDoc(ref, payload)
  }
}

export async function changeBuyHome(client: DocumentData, changeBuy: newBuyProps, newBuy: newBuyProps) {
  if (client.id) {
    const ref = doc(db, 'clientes', client.id)

    const currentValueNumber = parseFloat(client?.currentValue.replace(/R\$\s?|/g, '').replace(',', '.'))
    const totalValueNumber = parseFloat(client?.totalValue.replace(/R\$\s?|/g, '').replace(',', '.'))
    const purchaseValueNumber = parseFloat(client?.purchaseValue.replace(/R\$\s?|/g, '').replace(',', '.'))
    const changeBuyValueNumber = parseFloat(changeBuy?.purchaseValue.replace(/R\$\s?|/g, '').replace(',', '.'))
    const purchaseValueBuyNumber = parseFloat(newBuy?.purchaseValue.replace(/R\$\s?|/g, '').replace(',', '.'))

    const newCurrentValue = currentValueNumber + (changeBuyValueNumber - purchaseValueNumber)
    const newTotalValue = totalValueNumber + (changeBuyValueNumber - purchaseValueNumber)

    const newCurrentValueBuy = currentValueNumber + (changeBuyValueNumber - purchaseValueBuyNumber)
    const newTotalValueBuy = totalValueNumber + (changeBuyValueNumber - purchaseValueBuyNumber)

    const newCurrentValueString = 'R$ ' + newCurrentValue.toFixed(2).replace('.', ',')
    const newTotalValueString = 'R$ ' + newTotalValue.toFixed(2).replace('.', ',')

    const newCurrentValueBuyString = 'R$ ' + newCurrentValueBuy.toFixed(2).replace('.', ',')
    const newTotalValueBuyString = 'R$ ' + newTotalValueBuy.toFixed(2).replace('.', ',')

    const payload = {
      title: changeBuy.title,
      totalValue: newTotalValueString,
      datePurchase: changeBuy.datePurchase?.split('-').reverse().join('/'),
      currentValue: newCurrentValueString,
      purchaseValue: changeBuy.purchaseValue
    }

    const payloadBuyId = {
      totalValue: newTotalValueBuyString,
      currentValue: newCurrentValueBuyString,
    }

    const payloadBuy = {
      title: changeBuy.title,
      datePurchase: changeBuy.datePurchase?.split('-').reverse().join('/'),
      purchaseValue: changeBuy.purchaseValue
    }

    if (newBuy) {
      const refBuy = doc(db, `clientes/${client.id}/buys`, newBuy.id)
      await updateDoc(refBuy, payloadBuy)
      await updateDoc(ref, payloadBuyId)
      console.log('id')
    } else {
      await updateDoc(ref, payload)
      console.log('semId')
    }
  }
}