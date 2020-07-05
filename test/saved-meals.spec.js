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
    // describe('saved meal endpoints', () => {
    //     const usersArray = helpers.makeUsersArray()
    //     const auth = helpers.makeAuthHeader(usersArray[0])
    //     it('responds 200 and sends an empty array when no meals are saved', () =>{
    //         return supertest(app)
    //         .get('/api/saved-meals')
    //         .set('Authorization', auth)
    //         .expect([])
    //     })
    // })
    beforeEach('seed users and meal plans', () => {
        const usersArray = helpers.makeUsersArray()
       return helpers.seedUsers(db, usersArray)
       .then(() => {
        const plans = helpers.makePlans();
        return helpers.seedSavedPlans(db, plans)
       })
       .then(() => {
        const meals = helpers.makeMeals();
        return helpers.seedMeals(db, meals)
       })
    })
    describe('saved meals and mealplans present', () => {
        const usersArray = helpers.makeUsersArray()
        const auth = helpers.makeAuthHeader(usersArray[0])
        it('responds 200 with array of mealplans', () => {
            const expectedResponse = {
                        dietlabels: "Low-Fat, Low-Carb",
                        healthlabels: "Vegetarian",
                        label: "keto nachos",
                        meal_id: 1,
                        meal_image: "webiste.com",
                        meal_url: "greatwebstie.com",
                        mealplan_id: 1,
                        mealplan_name: "keto mealplan",
                        user_id: 1
              
            }
            return supertest(app)
            .get('/api/saved-meals')
            .set('Authorization', auth)
            .expect(200)
            .then(res => {
                expect(res.body[0]).to.be.an('object')
                expect(res.body[0]).to.eql(expectedResponse)
            })
        })
    })
})