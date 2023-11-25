import PaymentMethods from '../constants/enums/PaymentMethods';

export const convertPaymentMethodToString = (paymentMethod?: PaymentMethods): string => {
  let description: string = '';
  switch (paymentMethod + '') {
    case PaymentMethods.CreditCard:
      description = 'Cartão de Crédito';
      break;
    case PaymentMethods.CreditCardRecurrent:
      description = 'Cartão de Crédito Recorrente';
      break;
    case PaymentMethods.Pix:
      description = 'PIX';
      break;
    case PaymentMethods.FreeTrial:
      description = 'Teste 7 Dias';
      break;
    default:
      description = 'Método Inválido';
  }
  return description;
};
