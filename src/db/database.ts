// database.js
import * as Bookshelf from "bookshelf";
import * as Knex from "knex";
import knexfile from "../../knexfile";

export default class Database {

    public static getInstance(): Database {
        return Database.instance;
    }

    private static instance: Database = new Database();

    protected knex: Knex = null;

    protected bookshelf: Bookshelf = null;

    protected constructor() {
        if (Database.instance) {
            throw new Error("Error: Instantiation failed: Use Database.getInstance() instead of new.");
        }

        this.knex = Knex(knexfile[process.env.NODE_ENV || "development"] as {[index: string]: Knex.Config});

        this.bookshelf = Bookshelf(this.knex);

        this.bookshelf.plugin("registry");

        Database.instance = this;
    }

    public getKnex(): any {
        return this.knex;
    }

    public getBookshelf(): Bookshelf {
        return this.bookshelf;
    }
}
