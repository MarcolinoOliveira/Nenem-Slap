export interface clientsProps {
  id: string
  name: string
  title: string
  telephone: string
  currentValue: string
  datePurchase: string
  status: string
  inputValue: string
  maturity: string
  purchaseValue: string
}

export interface allPaymentsProps {
  id: string
  currentValue: number
  date: string
}

export interface paymentProps {
  id: string
  valuePayment: string
  datePayment: string
}

export interface promissoryPaymentProps extends paymentProps {
  method: string
}

export interface newBuyProps {
  id: string
  title: string
  purchaseValue: string
  datePurchase: string
}

export interface changeDataClientProps {
  id: string
  name: string
  date: string
}

export interface paymentMethodProps {
  pix: boolean,
  dinheiro: boolean,
  cartao: boolean
}