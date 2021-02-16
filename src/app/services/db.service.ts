import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { Project } from '../project';
import { Requirement } from '../requirement';


@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  public db: DB;

  constructor() { }

  async initDB() {
    // Instantiate it
    this.db = new DB('req');
  }

}

class DB extends Dexie {

  projects: Dexie.Table<Project, number>;
  requirements: Dexie.Table<Requirement, number>;

  constructor(databaseName) {
      super(databaseName);
      this.version(1).stores({
          projects: '++projectId',
          requirements: '++reqId, order',
      });
      this.projects = this.table('projects');
      this.requirements = this.table('requirements');
  }
}
