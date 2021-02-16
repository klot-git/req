export class Project {
    public type: string;
    public _id: string;
    public name: string;
    public client: string;
    public description: string;
    public projectCode: string;

    constructor(id: string, name: string) {
        this.type = 'PRJ';
        this._id = id;
        this.name = name;
    }
}
