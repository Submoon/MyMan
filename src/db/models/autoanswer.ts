import Database from '../database';

let db = Database.getInstance();
let Bookshelf = db.getBookshelf();

export default class AutoAnswer extends Bookshelf.Model<AutoAnswer>{
  get tableName(){ return "autoanswers"; }
  get hasTimestamps(){ return true; };
}
