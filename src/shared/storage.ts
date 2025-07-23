import PouchDB from "pouchdb";

// TODO: migrate to electricsql so workers
// can communicate with it
export const store = new PouchDB<PDF>("scribe-db");
