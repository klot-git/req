import { Injectable } from '@angular/core';
import { NonFRequirement } from '../non-f-requirement';
import { ConnectionService } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class NonFunctionalRequirementService {

  constructor(
    private conn: ConnectionService
  ) { }

  async updateRequirement(req: NonFRequirement) {
    await this.conn.db.nonfrequirements.put(req);
  }

  async loadRequirements(projectId: string): Promise<NonFRequirement[]> {
    return await this.conn.db.nonfrequirements
      .orderBy('[reqCode+projectId]')
      .filter(r => r.projectId === projectId).toArray();
  }

  async removeRequirement(reqId: string) {
    await this.conn.db.nonfrequirements.delete(reqId);
  }

}
