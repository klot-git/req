import { Injectable } from '@angular/core';
import { Requirement, RequirementData } from '../requirement';

import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import { ConnectionService } from './db.service';
import { FileService } from './file.service';
import { NonFRequirement } from '../non-f-requirement';

@Injectable({
  providedIn: 'root'
})
export class ReqService {

  constructor(private conn: ConnectionService) {}

  async createRequirement(req: Requirement) {
    req.reqId = await this.getNextRequirementId(req.projectId);
    await this.conn.db.requirements.put(req);
  }

  async loadRequirements(projectId: string, includeData = false): Promise<Requirement[]> {
    const query = await this.conn.db.requirements
      .orderBy('[projectId+parentId+order]')
      .filter(r => r.projectId === projectId);
    if (includeData) {
      return query.toArray();
    }
    return await this.conn.map(query, doc => ({
      reqId: doc.reqId,
      reqCode: doc.reqCode,
      parentId: doc.parentId,
      name: doc.name,
      order: doc.order,
      color: doc.color
    }));
  }

  groupRequirementsIntoEpics(requirements: Requirement[]): Requirement[] {
    const grouped: Requirement[] = [];

    requirements.forEach(r => {
      if (r.parentId === 0) {
        grouped.push(r);
      } else {
        const parent = grouped.find(r2 => r2.reqId === r.parentId);
        if (!parent.childs) {
          parent.childs = [];
        }
        parent.childs.push(r);
      }
    });
    return grouped;
  }

  async loadRequirement(projectId: string, reqId: number): Promise<Requirement> {
    return await this.conn.db.requirements.get([projectId, reqId]);
  }

  async updateRequirement(req: Requirement) {
    return await this.conn.db.requirements.put(req);
  }

  async updateRequirementParentId(projectId: string, reqId: number, parentId: number, order: number, color: string) {
    console.log(projectId);
    return await this.conn.db.requirements.update([projectId, reqId], { parentId, order, color });
  }

  async updateRequirementsOrder(projectId: string, reqId: number, parentId: number, from: number, to: number) {

    // updates reqs in between
    if (from < to) {  // if item was moved down
      await this.conn.db.requirements
        .filter(r => r.projectId === projectId && r.parentId === parentId && r.order > from && r.order <= to)
        .modify(r => { r.order = r.order - 1; });
    } else {  // if item was moved up
      await this.conn.db.requirements
        .filter(r => r.projectId === projectId && r.parentId === parentId && r.order >= to && r.order < from)
        .modify(r => { r.order = r.order + 1; });
    }

    // update moved req
    const req = await this.conn.db.requirements.get([projectId, reqId]);
    req.order = to;
    await this.conn.db.requirements.put(req);
  }

  async shiftRequirementsOrder(projectId: string, parentId: number, orderFrom: number, step: number) {

    await this.conn.db.requirements
      .filter(r => r.projectId === projectId && r.parentId === parentId && r.order >= orderFrom)
      .modify(r => { r.order = r.order + step; });

  }

  async removeRequirement(projectId: string, reqId: number) {
    await this.conn.db.requirements.delete([projectId, reqId]);
  }

  async updateNonFRequirement(req: NonFRequirement) {
    if (!req.reqId) {
      req.reqId = await this.getNextNonFRequirementId(req.projectId);
    }
    await this.conn.db.nonfrequirements.put(req);
  }

  async loadNonFRequirements(projectId: string): Promise<NonFRequirement[]> {
    return await this.conn.db.nonfrequirements
      .orderBy('[projectId+reqCode]')
      .filter(r => r.projectId === projectId).toArray();
  }

  async removeNonFRequirement(projectId: string, reqId: number) {
    await this.conn.db.nonfrequirements.delete([projectId, reqId]);
  }

  private async getNextNonFRequirementId(projectId: string): Promise<number> {
    const last = await this.conn.db.nonfrequirements
      .orderBy('[projectId+reqId]').reverse().limit(1)
      .filter(r => r.projectId === projectId).toArray();
    if (!last || last.length === 0) {
      return 1;
    }
    return last[0].reqId + 1;
  }

  private async getNextRequirementId(projectId: string): Promise<number> {
    const last = await this.conn.db.requirements
      .orderBy('[projectId+reqId]').reverse().limit(1)
      .filter(r => r.projectId === projectId).toArray();
    if (!last || last.length === 0) {
      return 1;
    }
    return last[0].reqId + 1;
  }

}
