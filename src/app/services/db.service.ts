import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';


@Injectable({
  providedIn: 'root'
})
export class DbService {

  public connection;

  constructor() { }

  async initDB() {
    PouchDB.plugin(PouchDBFind);
    this.connection = new PouchDB('requirements.db');
  }



}
