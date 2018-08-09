// database.js
import * as Knex from 'knex';
import * as Bookshelf from 'bookshelf';
import knexfile from '../knexfile';

'use strict';

export default class Database{

    private static _instance : Database = new Database();

    protected _knex:any = null;

    protected _bookshelf : Bookshelf = null;

    constructor() {
        if(Database._instance){
            throw new Error("Error: Instantiation failed: Use Database.getInstance() instead of new.");
        }

        this._knex = Knex(knexfile[process.env.NODE_ENV || 'development']);

        this._bookshelf = Bookshelf(this._knex);

        this._bookshelf.plugin('registry');

        Database._instance = this;
    }

    public static getInstance():Database
    {
        return Database._instance;
    }

    public getKnex(): any
    {
        return this._knex;
    }

    public getBookshelf(): Bookshelf
    {
        return this._bookshelf;
    }
}