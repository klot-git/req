export class Project {
    public projectId: string;
    public projectCode: string;
    public name: string;
    public client: string;
    public data: ProjectData;

    constructor() {
        this.data = new ProjectData();
    }
}

export class ProjectData {
    public vision: string;
}
