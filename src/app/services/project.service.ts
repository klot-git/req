import { Injectable } from '@angular/core';
import { v4 as uuidv4} from 'uuid';
import FileSaver from 'file-saver';
import { Project } from '../project';
import { Requirement } from '../requirement';
import { ConnectionService } from './db.service';
import Dexie from 'dexie';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private projectHeader: Project;

  constructor(private conn: ConnectionService) {
  }

  public get project(): Project {
    return this.projectHeader;
  }

  public get projectId(): string {

    if (!this.projectHeader) {
      const prjJson = localStorage.getItem('__lastPrj');
      if (!prjJson) {
        return null;
      }
      this.projectHeader = JSON.parse(prjJson);
    }
    return this.projectHeader.projectId;
  }

  async updateProject(prj: Project) {
    await this.conn.db.projects.put(prj);
  }

  async loadProjectAsCurrent(projectId: string): Promise<Project> {
    let prj = null;

    if (projectId === 'new') {
      prj = this.startNewProject();
    } else if (projectId) {
      prj = await this.loadProject(projectId, true);
    }

    if (!prj) {
      prj = this.startNewProject();
    }

    this.changeCurrentProject(prj.projectId);
    return prj;
  }

  async changeCurrentProject(projectId: string) {
    this.projectHeader = await this.loadProject(projectId);
    if (!this.projectHeader) {
      return;
    }
    localStorage.setItem('__lastPrj', JSON.stringify(this.projectHeader));
  }

  startNewProject(): Project {
    const prj = { projectId: uuidv4(), name: 'Your first project', data: {}} as Project;
    this.updateProject(prj);
    return prj;
  }

  async loadProject(projectId: string, includeData = false): Promise<Project> {
    if (!includeData) {
      const query = await this.conn.db.projects.where('projectId').equals(projectId);
      const prjs = await this.conn.map(query,
        doc => ({
          projectId: doc.projectId,
          name: doc.name,
          client: doc.client,
          code: doc.code
        })
      );
      return prjs[0] as Project;
    }
    return await this.conn.db.projects.get({ projectId });
  }

}
