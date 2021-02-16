import { Injectable } from '@angular/core';
import { Requirement, RequirementData } from '../requirement';

import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import { ConnectionService } from './db.service';
import { ProjectService } from './project.service';

@Injectable({
  providedIn: 'root'
})
export class ReqService {

  constructor(
    private conn: ConnectionService,
    private projectService: ProjectService) {}

  async createRequirement(req: Requirement) {
    req.projectId = this.projectService.currentProjectId;
    req.reqId = await this.conn.db.requirements.put(req);
  }

  async loadRequirements(): Promise<Requirement[]> {
    return await this.conn.db.requirements.filter(r => r.projectId === this.projectService.currentProjectId).sortBy('order');
  }

  async loadRequirement(reqId: number): Promise<Requirement> {
    return await this.conn.db.requirements.get(reqId);
  }

  async updateRequirement(req: Requirement) {
    return await this.conn.db.requirements.put(req);
  }

  async updateRequirementsOrder(reqs: Requirement[]) {
    // return await this.db.connection.bulkDocs(reqs);
  }

}
