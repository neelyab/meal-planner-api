const helpers = require('./test-helpers')
const app = require('../src/app')
const knex = require('knex')
const {expect} = require('chai')

describe.only('saved meals endpoints', () =>{
    const db = knex({
        client: 'pg',
        connection: process.env.TEST_DATABASE_URL
    })
    app.set('db', db)

    before('clean tables', () =>{
        return db.raw('TRUNCATE TABLE saved_meal_plans, saved_meals, users RESTART IDENTITY CASCADE')
    })
    afterEach('clean tables', () => {
        return db.raw('TRUNCATE TABLE saved_meal_plans, saved_meals, users RESTART IDENTITY CASCADE')
    })
    beforeEach('seed users', () => {
        const usersArray = helpers.makeUsersArray()
       return helpers.seedUsers(db, usersArray)
    })
    describe('saved meal endpoints', () => {
        const usersArray = helpers.makeUsersArray()
        const auth = helpers.makeAuthHeader(usersArray[0])
        it('responds 200 and sends all saved meals in an array', () =>{
            return supertest(app)
            .get('/api/saved-meals')
            .set('Authorization', auth)
            .expect(200)
        })
    })
})