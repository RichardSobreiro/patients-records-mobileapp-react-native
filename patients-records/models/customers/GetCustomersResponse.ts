/** @format */

export class GetCustomer {
  constructor(
    public userId: string,
    public customerId: string,
    public customerName: string,
    public birthDate: Date,
    public cpf: undefined | string,
    public gender: undefined | string,
    public maritalStatus: undefined | string,
    public ethnicity: undefined | string,
    public placeOfBirth: undefined | string,
    public occupation: undefined | string,
    public phoneNumber: string,
    public instagramAccount: undefined | string,
    public email: undefined | string,
    public creationDate: Date,
    public cep: undefined | string,
    public street: undefined | string,
    public number: undefined | string,
    public district: undefined | string,
    public city: undefined | string,
    public complement: undefined | string,
    public state: undefined | string
  ) {}
}

class ListPage {
  constructor(public pageNumber: number, public limit: number) {}
}

export class GetCustomersResponse {
  constructor(
    public userId: string,
    public customersCount: number,
    public previous?: ListPage,
    public next?: ListPage,
    public customers?: GetCustomer[]
  ) {}
}
