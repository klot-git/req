export class Requirement {

    public reqId: string;
    public name: string;
    public reqCode: string;
    public order: number;
    public color: string;

    public parentId: string;

    public projectId: string;

    public data: RequirementData;

    public childs: Requirement[];

}

export class RequirementData {

    public story: string;

}
