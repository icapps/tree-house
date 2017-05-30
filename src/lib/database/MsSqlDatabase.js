import sql from 'mssql';
import BaseDatabase from '../base/BaseDatabase';

export default class MsSqlDatabase extends BaseDatabase {

    /**
     * Initialise a new SQL connection pool
     * @memberof MsSqlDatabase
     */
    init() {
        try {
            const newConnection = new sql.ConnectionPool(this.configuration);
            this.setConnection(newConnection);
        } catch (e) {
            throw new Error(e);
        }
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.getConnection().connect((err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }

    query(queryString) {
        return new Promise((resolve, reject) => {
            new sql.Request(this.getConnection()).query(queryString, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    // TODO: Properly implement
    handleErrors(errors) {
        console.log(errors);
    }

    // TODO: Properly implement
    get(context, valuesToGet, filters) {

    }

    // TODO: Properly implement
    create(context, valuesToInsert, valuesToOutput, filters) {

    }

    // TODO: Properly implement
    update(context, valuesToUpdate, valuesToOutput, filters) {

    }

    destroy(context, filters) {
        const q = `DELETE FROM [${context}] WHERE ${filters}`;
        return this.query(q);
    }
}
