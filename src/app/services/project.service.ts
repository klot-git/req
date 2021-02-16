import { Injectable } from '@angular/core';
import { Project } from '../project';
import { ConnectionService } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private conn: ConnectionService) {
  }

  async loadCurrentProject() {
    let prj = { projectId: 1, name: 'Your first project '} as Project;

    if (this.projectId) {
      prj = await this.loadProject(this.projectId);
    }

    this.projectId = prj.projectId;
    return prj;
  }

  private get projectId(): number | null {
    const t = localStorage.getItem('__prjId');
    if (!t) {
      return null;
    }
    return parseInt(t, 10);
  }
  private set projectId(value: number) {
    localStorage.setItem('__prjId', value.toString());
  }
  public get currentProjectId(): number {
    return this.projectId;
  }

  async updateProject(prj: Project) {
    await this.conn.db.projects.put(prj);
  }

  async loadProject(prjId: number) {
    const prj = await this.conn.db.projects.get(prjId);
    return prj;
  }


}
