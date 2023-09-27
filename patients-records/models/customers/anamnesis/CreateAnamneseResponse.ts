/** @format */

export class CreateQuestionAnswerResponse {
  constructor(
    public questionItemId: string,
    public questionType: string,
    public questionPhrase: string,
    public questionAnswersOptions: string[] | undefined,
    public questionValue: string | undefined,
    public sectionId?: string
  ) {}
}

export class CreateAnamnesisTypeFileResponse {
  constructor(
    public fileId: string,
    public creationDate: Date,
    public mimeType: string,
    public fileType: string,
    public contentEncoding: string,
    public filename: string,
    public originalName: string,
    public baseUrl: string,
    public sasToken: string,
    public sasTokenExpiresOn: Date | undefined
  ) {}
}

export class CreateSectionItem {
  constructor(public sectionId: string, public sectionTitle: string) {}
}

export class CreateAnamnesisTypeContentResponse {
  constructor(
    public anamnesisTypeId: string,
    public anamnesisTypeDescription: string,
    public isDefault: boolean,
    public content?: string | null,
    public files?: CreateAnamnesisTypeFileResponse[] | null,
    public questions?: CreateQuestionAnswerResponse[] | undefined,
    public sections?: CreateSectionItem[] | undefined
  ) {}
}

export class CreateAnamnesisResponse {
  constructor(
    public anamneseId: string,
    public customerId: string,
    public creationDate: Date,
    public date: Date,
    public anamnesisTypesContent: CreateAnamnesisTypeContentResponse[]
  ) {}
}
