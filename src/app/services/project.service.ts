import { Injectable } from '@angular/core';
import { v4 as uuidv4} from 'uuid';
import { Project } from '../project';
import { ConnectionService } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private conn: ConnectionService) {
  }

  public get projectId(): string {
    return localStorage.getItem('__lastPrjId');
  }

  async updateProject(prj: Project) {
    await this.conn.db.projects.put(prj);
  }

  async loadProjectAsCurrent(projectId: string): Promise<Project> {
    let prj = null;

    if (projectId === 'new') {
      prj = this.startNewProject();
    } else if (projectId) {
      prj = await this.loadProject(projectId);
    }

    if (!prj) {
      prj = this.startNewProject();
    }

    this.changeCurrentProject(prj.projectId);
    return prj;
  }

  changeCurrentProject(projectId: string) {
    localStorage.setItem('__lastPrjId', projectId);
  }

  startNewProject(): Project {
    const prj = { projectId: uuidv4(), name: 'Your first project '} as Project;
    this.updateProject(prj);
    return prj;
  }

  async loadProject(projectId: string): Promise<Project> {
    return await this.conn.db.projects.get({ projectId });
  }

}
