import { Injectable } from '@angular/core';
import Dexie, { Collection } from 'dexie';
import { NonFRequirement } from '../non-f-requirement';
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

  public map(collection: Collection, mapperFn: any) {
    const result = [];
    return collection.each(row => result.push(mapperFn(row))).then(() => result);
  }

}

class DB extends Dexie {

  projects: Dexie.Table<Project, string>;
  requirements: Dexie.Table<Requirement, [string, number]>;
  nonfrequirements: Dexie.Table<NonFRequirement, [string, number]>;

  constructor(databaseName) {
      super(databaseName);
      this.version(1).stores({
          projects: 'projectId',
          requirements: '[projectId+reqId],[projectId+parentId+order],projectId',
          nonfrequirements: '[projectId+reqId],[projectId+reqCode],projectId',
      });
      this.projects = this.table('projects');
      this.requirements = this.table('requirements');
      this.nonfrequirements = this.table('nonfrequirements');
  }

}
