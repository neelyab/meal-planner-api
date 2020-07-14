const helpers = require('./test-helpers')
const app = require('../src/app')
const knex = require('knex')
const {expect} = require('chai')

describe('saved meals endpoints', () =>{
    let db;
    before('make connection', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })
    after('destroy connection', () => db.destroy())
    before('clean tables', () =>{
        return db.raw('TRUNCATE TABLE saved_meal_plans, saved_meals, users RESTART IDENTITY CASCADE')
    })
    afterEach('clean tables', () => {
        return db.raw('TRUNCATE TABLE saved_meal_plans, saved_meals, users RESTART IDENTITY CASCADE')
    })

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
                        mealplan: 1,
                        mealplan_id: 1,
                        mealplan_name: "keto mealplan",
                        user_id: 1
              
            }
            return supertest(app)
            .get('/api/saved-meal-plans')
            .set('Authorization', auth)
            .expect(200)
            .then(res => {
                expect(res.body[0]).to.be.an('object')
                expect(res.body[0]).to.eql(expectedResponse)
            })
        })
        it('responds 404 when mealplan id does not exist', () => {
            const id = 098
            return supertest(app)
            .get(`/api/saved-meal-plans/123`)
            .set('Authorization', auth)
            .expect(404)
            .then(res => {
                expect(res.body).to.eql({error: 'Meal plan not found'})
            })
        })
        it('responds 200 with meal plan by id', () => {
            return supertest(app)
            .get('/api/saved-meal-plans/1')
            .set('Authorization', auth)
            .expect(200)
            .then(res => {
                expect(res.body[0].mealplan_id).to.eql(1)
                expect(res.body[0].label).to.eql('keto nachos')
            })
        })

    })
    describe('delete plan endpoint', () => {
        const usersArray = helpers.makeUsersArray()
        const auth = helpers.makeAuthHeader(usersArray[0])
        it('responds 200 deleted when a mealplan is deleted', () => {
            return supertest(app)
            .delete('/api/saved-meal-plans/1')
            .set('Authorization', auth)
            .expect(200, `Plan 1 deleted`)
            .then(() => {
                return supertest(app)
                .get('/api/saved-meal-plans/1')
                .set('Authorization', auth)
                .expect(404)
            })
        })
    })
    
})

