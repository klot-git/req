export class Requirement {

    public reqId: number;
    public name: string;
    public reqCode: string;
    public order: number;

    public projectId: string;

    public data: RequirementData;

}

export class RequirementData {

    public story: string;

}
