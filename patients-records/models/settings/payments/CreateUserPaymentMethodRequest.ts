/** @format */
import PaymentMethods from '../../../constants/enums/PaymentMethods';

export class CreateCreditCardPaymentMethodRequest {
  constructor(
    public cvc: string,
    public name: string,
    public expiry: string,
    public number: string,
    public fourFinalNumbers: string,
    public type: string | undefined
  ) {}
}

class CreateUserPaymentMethodRequest {
  constructor(
    public paymentMethodId: PaymentMethods,
    public creditCard?: CreateCreditCardPaymentMethodRequest
  ) {}
}

export default CreateUserPaymentMethodRequest;
