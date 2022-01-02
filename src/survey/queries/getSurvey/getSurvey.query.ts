export class GetSurveyQuery {
  constructor(
    public readonly id?: string,
    public readonly ids?: string[],
    public readonly from?: number,
    public readonly to?: number,
  ) {}
}
