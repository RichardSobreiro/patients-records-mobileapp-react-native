/** @format */
export class GetAnamnesisTypeResponse {
  constructor(
    public anamnesisTypeId: string,
    public anamnesisTypeDescription: string,
    public template: string | undefined,
    public isDefault: boolean
  ) {}
}

export class GetAnamnesisTypesResponse {
  constructor(public userId: string, public anamnesisTypes?: GetAnamnesisTypeResponse[] | null) {}
}
