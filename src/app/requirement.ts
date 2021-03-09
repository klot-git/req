export class Requirement {

    public reqId: number;
    public projectId: string;

    public name: string;
    public reqCode: string;
    public order: number;
    public color: string;

    public parentId: number;

    public data: RequirementData;

    public childs: Requirement[];

}

export class RequirementData {

    public story: string;

}
