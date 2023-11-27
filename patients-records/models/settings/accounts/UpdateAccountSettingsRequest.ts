/** @format */
import PaymentMethods from '../../../constants/enums/PaymentMethods';

export class CreditCard {
  constructor(
    public cvc: string,
    public name: string,
    public expiry: string,
    public number: string,
    public type: string
  ) {}
}

export class PaymentMethod {
  constructor(public paymentMethodId: PaymentMethods, public creditCard?: CreditCard | undefined) {}
}

class UpdateAccountSettingsRequest {
  constructor(
    public userNameComplete: string,
    public username: string,
    public userBirthdate: Date,
    public userGender: string,
    public userCPF: string,
    public userCreationCompleted: boolean,
    public phoneNumber: string,
    public phoneNumberVerified: boolean,
    public email: string,
    public emailVerified: boolean,

    public referPronoun: string,
    public messageProfessionalName: string,

    public userAddressCEP: string,
    public userAddressStreet: string,
    public userAddressNumber: string,
    public userAddressDistrict: string,
    public userAddressCity: string,
    public userAddressComplement: string,
    public userAddressState: string,

    public userPlanId: string,

    public paymentMethod?: PaymentMethod,

    public companyName?: string,
    public companyCNPJ?: string,
    public companyNumberOfEmployees?: string | number
  ) {}
}

export default UpdateAccountSettingsRequest;
