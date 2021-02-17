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

  async loadRequirements(includeData = false): Promise<Requirement[]> {
    const query = await this.conn.db.requirements.orderBy('order').filter(r => r.projectId === this.projectService.currentProjectId);
    if (includeData) {
      return query.toArray();
    }
    return this.conn.map(query, doc => ({
      reqId: doc.reqId,
      reqCode: doc.reqCode,
      parentId: doc.parentId,
      name: doc.name,
      order: doc.order
    }));
  }

  async loadRequirement(reqId: number): Promise<Requirement> {
    return await this.conn.db.requirements.get(reqId);
  }

  async updateRequirement(req: Requirement) {
    return await this.conn.db.requirements.put(req);
  }


  async updateRequirementsOrder(reqId: number, from: number, to: number) {

    const projectId = this.projectService.currentProjectId;

    // updates reqs in between
    if (from < to) {  // if item was moved down
      await this.conn.db.requirements
        .filter(r => r.projectId === projectId && r.order > from && r.order <= to)
        .modify(r => { r.order = r.order - 1; });
    } else {  // if item was moved up
      await this.conn.db.requirements
        .filter(r => r.projectId === projectId && r.order >= to && r.order < from)
        .modify(r => { r.order = r.order + 1; });
    }

    // update moved req
    const req = await this.conn.db.requirements.get(reqId);
    req.order = to;
    await this.conn.db.requirements.put(req);
  }

}
