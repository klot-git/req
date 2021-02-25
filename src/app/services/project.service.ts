import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {v4 as uuidv4} from 'uuid';
import { Project } from '../project';
import { ConnectionService } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(
    private route: ActivatedRoute,
    private conn: ConnectionService) {
  }

  private get lastProjectId(): string {
    return localStorage.getItem('__lastPrjId');
  }
  private set lastProjectId(value: string) {
    localStorage.setItem('__lastPrjId', value);
  }

  async updateProject(prj: Project) {
    await this.conn.db.projects.put(prj);
  }

  async loadProjectAsCurrent(): Promise<Project> {
    let prj = null;
    if (this.projectId) {
      await this.loadProject(this.projectId);
    }
    if (!prj) {
      prj = { projectId: uuidv4(), name: 'Your first project '} as Project;
      this.updateProject(prj);
    }
    this.lastProjectId = prj.projectId;
    return prj;
  }

  async loadProject(projectId: string): Promise<Project> {
    return await this.conn.db.projects.get({ projectId });
  }

  get projectId() {
    let prjId = this.route.snapshot.paramMap.get('id');
    if (prjId === 'last' || !prjId) {
      prjId = this.lastProjectId;
    }
    return prjId;
  }


}
