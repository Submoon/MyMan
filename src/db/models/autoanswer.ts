import Database from "../database";

const db = Database.getInstance();
const Bookshelf = db.getBookshelf();

export default class AutoAnswer extends Bookshelf.Model<AutoAnswer> {
  get tableName() { return "autoanswers"; }
  get hasTimestamps() { return true; }
}
