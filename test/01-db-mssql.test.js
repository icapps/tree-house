import { expect } from 'chai';
import { localTestMsSqlConfig as dbConfig } from './lib/database.config';
import { MsSqlDatabase } from '../src/index';

let db = null;

// TODO: Test mssql database
xdescribe('Create a new MSSQL connection', () => {
    it('Create a new instance and set configuration', () => {
        db = new MsSqlDatabase();
        db.setConfiguration(dbConfig);
    });

    it('Try to create a new database connection pool', (done) => {
        db.init();
        db.connect()
            .then(() => done());
    });

    it('Execute basic query', (done) => {
        db.query('IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id(N\'[dbo].[test]\') AND OBJECTPROPERTY(id, N\'IsUserTable\') = 1) DROP TABLE [dbo].[test];')
        .then((result) => {
            done();
        });
        /*db.query('CREATE TABLE [dbo].[test]([Id] [int])')
            .then((result) => {
                console.log('RESULT', result);
                done();
            })
            .catch(e => console.log('ERR', e));*/
    });
});
