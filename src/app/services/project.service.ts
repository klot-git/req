import { Injectable } from '@angular/core';
import { Project } from '../project';
import { DbService } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private db: DbService) {
  }

  async loadCurrentProject() {
    if (this.projectId) {
      return await this.loadProject(this.projectId);
    }
    const prj = new Project('1', 'Your first project');
    this.projectId = prj._id;
    return prj;
  }

  private get projectId() {
    return localStorage.getItem('__prjId');
  }
  private set projectId(value: string) {
    localStorage.setItem('__prjId', value);
  }
  public get currentProjectId() {
    return this.projectId;
  }

  async updateProject(prj: Project) {
    await this.db.connection.put(prj);
  }

  async loadProject(prjId: string) {
    const prj = await this.db.connection.get(prjId);
    this.projectId = prj._id;
    return prj;
  }


}
