import PouchDB from "pouchdb";

export const store = new PouchDB<PDF>("scribe-db");
