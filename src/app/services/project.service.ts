import { Injectable } from '@angular/core';
import {v4 as uuidv4} from 'uuid';
import { Project } from '../project';
import { ConnectionService } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private conn: ConnectionService) {
  }

  async loadCurrentProject() {
    let prj: Project;

    if (this.projectId) {
      prj = await this.loadProject(this.projectId);
    }

    if (!prj) {
      prj = { projectId: uuidv4(), name: 'Your first project '} as Project;
    }

    this.projectId = prj.projectId;
    return prj;
  }

  private get projectId(): string {
    return localStorage.getItem('__prjId');
  }
  private set projectId(value: string) {
    localStorage.setItem('__prjId', value);
  }
  public get currentProjectId(): string {
    return this.projectId;
  }

  async updateProject(prj: Project) {
    await this.conn.db.projects.put(prj);
  }

  async loadProject(projectId: string) {
    const prj = await this.conn.db.projects.get({ projectId });
    return prj;
  }


}
