export class Requirement {

    public _id: string;
    public _rev: string;
    public type: string;

    public projectId: string;
    public name: string;
    public reqCode: string;
    public data: RequirementData;
    public order: number;

    constructor(name: string = null, projectId: string = null) {
        this.type = 'REQ';
        this.name = name;
        this.projectId = projectId;
        this.data = new RequirementData();
    }
}

export class RequirementData {

    public _id: string;
    public _rev: string;
    public type: string;

    public projectId: string;
    public story: string;


    constructor(projectId: string = null) {
        this.type = 'REQDATA';
        this.projectId = projectId;
    }
}
