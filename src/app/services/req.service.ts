import { Injectable } from '@angular/core';
import { Requirement, RequirementData } from '../requirement';

import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import { DbService } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class ReqService {

  constructor(private db: DbService) { }

  async createRequirement(req: Requirement) {
    const r = await this.db.connection.post(req);
    req._id = r.id;
    req._rev = r.rev;
  }

  async loadRequirements() {

    // create index first
    await this.db.connection.createIndex({ index: { fields: ['order', 'type'] }});

    const result = await this.db.connection.find({
          selector: { order: { $gte: 0 }, type: 'REQ' },
          // fields: ['_id', '_rev', 'name', 'reqCode', 'order'],
          sort: [ 'order' ]
        });

    console.log(result.docs);
    if (!result.docs) {
      return [];
    }
    const reqs = result.docs.map(doc => {
      // row.doc.Date = new Date(row.doc.Date);
      return doc;
      });
    return reqs;
  }

  async loadRequirement(reqId: string) {
    return await this.db.connection.get(reqId);
  }

  async updateRequirement(req: Requirement) {
    return await this.db.connection.put(req);
  }

  async updateRequirements(reqs: Requirement[]) {
    return await this.db.connection.bulkDocs(reqs);
  }

}
