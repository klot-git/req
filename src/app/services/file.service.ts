import { Injectable } from '@angular/core';
import { v4 as uuidv4} from 'uuid';
import FileSaver from 'file-saver';
import { Project } from '../project';
import { Requirement } from '../requirement';
import { ConnectionService } from './db.service';
import Dexie from 'dexie';
import { EventAggregatorService } from './event-aggregator.service';
import { MessageService } from './message.service';
import PizZip from 'pizzip';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private projectHeader: Project;

  constructor(
    private messageService: MessageService,
    private conn: ConnectionService,
    private events: EventAggregatorService,
    ) {
  }

  /**
   * Gets current project.
   */
  public get project(): Project {
    return this.projectHeader;
  }

  /**
   * Gets current project Id.
   * It looks at localstorage to get the last Id.
   */
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
      this.events.publish('CHANGE-MENU', 'req');
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

  async loadProjects(limit: number = null): Promise<Project[]> {
    let query = await this.conn.db.projects.where('projectId').above('');
    if (limit) {
      query = query.limit(limit);
    }
    return await this.conn.map(query,
      doc => ({
        projectId: doc.projectId,
        name: doc.name,
        client: doc.client,
        code: doc.code
      })
    );
  }

  /**
   * Saves the projec at the local DB.
   * @param projectFile a JSON structure with all projects records
   */
  private async saveProject(projectFile: any) {

    await this.removeProject(projectFile.project.projectId);

    await this.conn.db.projects.add(projectFile.project);
    await this.conn.db.requirements.bulkAdd(projectFile.requirements);
    await this.conn.db.nonfrequirements.bulkAdd(projectFile.requirements);
  }

  /**
   * Removes the project from local DB.
   * @param projectId The project Id
   */
  async removeProject(projectId: string) {
    await this.conn.db.projects.delete(projectId);
    await this.conn.db.requirements.where('projectId').equals(projectId).delete();
    await this.conn.db.nonfrequirements.where('projectId').equals(projectId).delete();
  }

  /**
   * Imports a project zipfile to the local DB.
   * @param file Zipfile content
   * @returns the importanted project Id
   */
  async importFromZip(file): Promise<string> {
    this.messageService.blockUI();
    this.messageService.isLoadingData = true;
    let projectFile = null;

    try {
      const zip = new PizZip(file);
      const json = zip.files['project-data.json'].asText();
      projectFile = JSON.parse(json);
    } catch {
      this.messageService.addError('Invalid zip file or could not find project-data.json');
      this.messageService.isLoadingData = false;
      return null;
    }

    try {
      await this.saveProject(projectFile);
    } catch {
      this.messageService.addError('Error saving file');
      this.messageService.isLoadingData = false;
      return null;
    }

    this.messageService.isLoadingData = false;
    return projectFile.project.projectId;
  }


}
