/** @format */
import PaymentMethods from '../../../constants/enums/PaymentMethods';
import PaymentsUserMethodStatus from '../../../constants/enums/PaymentsUserMethodStatus';

export class CreateCreditCardPaymentMethodResponse {
  constructor(
    public cvc: string,
    public name: string,
    public expiry: string,
    public fourFinalNumbers: string,
    public type: string
  ) {}
}

class CreateUserPaymentMethodResponse {
  constructor(
    public paymentsUserMethodId: string,
    public userId: string,
    public creationDate: Date,
    public paymentMethodId: PaymentMethods,
    public status: PaymentsUserMethodStatus,
    public statusDescription: string,
    public expireDate?: Date,
    public creditCard?: CreateCreditCardPaymentMethodResponse
  ) {}
}

export default CreateUserPaymentMethodResponse;
