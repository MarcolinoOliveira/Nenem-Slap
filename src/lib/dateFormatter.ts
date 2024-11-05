import { allPaymentsProps, clientsProps } from "@/interface/globalInterfaces";

export const dateFormatterPTBR = (date: Date, locale = 'pt-BR') => {
  return new Intl.DateTimeFormat(locale).format(date)
}

export const getCurrentMonth = () => {
  let now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}`;
}

export const getDaysLate = (maturity: string) => {
  const dateBR = dateFormatterPTBR(new Date())

  const inicio: any = new Date(maturity?.split('/').reverse().join('-'));
  const fim: any = new Date(dateBR.split('/').reverse().join('-'));

  const diferenca = fim - inicio
  const dias = diferenca / (1000 * 60 * 60 * 24);

  return dias;
}

export const getNewMaturity = (date: string) => {
  const newDate = new Date(date?.split('/').reverse().join('-'))
  newDate.setDate(newDate.getDate() + 1);
  newDate.setMonth(newDate.getMonth() + 1);

  const opcoes: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const formatador = new Intl.DateTimeFormat('pt-BR', opcoes);

  return formatador.format(newDate)
}

export const getPreviousMaturity = (date: string) => {
  const newDate = new Date(date?.split('/').reverse().join('-'))
  newDate.setDate(newDate.getDate() + 1);
  newDate.setMonth(newDate.getMonth() - 1);

  const opcoes: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const formatador = new Intl.DateTimeFormat('pt-BR', opcoes);

  return formatador.format(newDate)
}

export const totalCurrentPrice = (client: clientsProps[]) => {
  let total = 0

  for (let i = 0; i < client?.length; i++) {
    total += parseFloat(client[i].currentValue.replace(/R\$\s?|/g, '').replace(',', '.'))
  }

  return total
}

export const formatIdPaymentMonth = (date: string) => {
  const [year, month] = date.split('-')

  return `${year}-${month}`
}

export const getTotalPayments = (date: string, allPayments: allPaymentsProps[]) => {
  const newDate = date?.split('/').reverse().join('-')
  const [year, month] = newDate?.split('-')

  let totalValuePayments = 0
  let idSec = ''

  for (let i = 0; i < allPayments.length; i++) {
    const [yearPayment, monthPayment] = allPayments[i].id?.split('-')

    if (parseInt(year) === parseInt(yearPayment) && parseInt(month) === parseInt(monthPayment)) {
      totalValuePayments += allPayments[i].currentValue
      idSec = allPayments[i].id
      break
    }
  }

  return { totalValuePayments, idSec }
}

export const filterPaymentByMonth = (allPayments: allPaymentsProps[], date: string) => {
  const [year, month] = date?.split('-')
  let total = 0

  for (let i = 0; i < allPayments?.length; i++) {
    const newDate = new Date(allPayments[i].date)

    if (newDate.getFullYear() === parseInt(year) && (newDate.getMonth() + 1) === parseInt(month)) {
      total += (allPayments[i].currentValue)
    }
  }

  return total
}

export const formatCurrentMonth = (currentMonth: string) => {
  if (!currentMonth) return
  const [year, month] = currentMonth.split('-')
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

  return `${months[parseInt(month) - 1]} de ${year}`;
}