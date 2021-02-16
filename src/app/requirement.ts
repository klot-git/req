export class Requirement {

    public reqId: number;
    public name: string;
    public reqCode: string;
    public order: number;

    public projectId: number;

}

export class RequirementData {

    public projectId: number;
    public story: string;


    constructor(projectId: number = null) {
        this.projectId = projectId;
    }
}
