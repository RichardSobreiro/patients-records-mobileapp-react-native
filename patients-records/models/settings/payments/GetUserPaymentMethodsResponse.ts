import PaymentMethods from '../../../constants/enums/PaymentMethods';
import PaymentsUserMethodStatus from '/constants/enums/PaymentsUserMethodStatus';

export class GetCreditCardPaymentMethodResponse {
  constructor(
    public cvc: string,
    public name: string,
    public expiry: string,
    public fourFinalNumbers: string,
    public type: string | undefined
  ) {}
}

export class GetUserPaymentMethodResponse {
  constructor(
    public paymentUserMethodId: string,
    public userId: string,
    public creationDate: Date,
    public paymentMethodId: PaymentMethods,
    public status: PaymentsUserMethodStatus,
    public statusDescription: string,
    public expireDate?: Date,
    public creditCard?: GetCreditCardPaymentMethodResponse
  ) {}
}

class GetUserPaymentMethodsResponse {
  constructor(
    public defaultPaymentMethod: PaymentMethods,
    public defaultPaymentUserMethodId: string,
    public paymentMethods: GetUserPaymentMethodResponse[]
  ) {}
}

export default GetUserPaymentMethodsResponse;
