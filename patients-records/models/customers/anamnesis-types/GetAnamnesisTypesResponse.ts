/** @format */

export class GetQuestionItem {
  constructor(
    public questionItemId: string,
    public questionType: string,
    public questionPhrase: string,
    public questionAnswersOptions: string[] | undefined,
    public questionValue: string | undefined
  ) {}
}

export class GetAnamnesisTypeResponse {
  constructor(
    public anamnesisTypeId: string,
    public anamnesisTypeDescription: string,
    public template: string | undefined,
    public isDefault: boolean,
    public questions?: GetQuestionItem[] | undefined
  ) {}
}

export class GetAnamnesisTypesResponse {
  constructor(public userId: string, public anamnesisTypes?: GetAnamnesisTypeResponse[] | null) {}
}
