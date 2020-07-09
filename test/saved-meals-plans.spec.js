const helpers = require('./test-helpers')
const app = require('../src/app')
const knex = require('knex')
const {expect} = require('chai')

describe('POST new meal plan', () => {
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

    beforeEach('seed users and meal plans', () => {
        const usersArray = helpers.makeUsersArray()
       return helpers.seedUsers(db, usersArray)
    })
    const usersArray = helpers.makeUsersArray()
    const auth = helpers.makeAuthHeader(usersArray[0])
    const name = 'sdfasdf'
    const meals = [{
        label: 'keto nachos',
        meal_url: 'greatwebstie.com',
        meal_image: 'webiste.com',
        dietlabels: 'Low-Fat, Low-Carb',
        healthlabels: 'Vegetarian'
    },
    {
      label: 'eggplant',
      meal_url: 'greatwebstie.com',
      meal_image: 'webiste.com',
      dietlabels: 'Low-Fat, Low-Carb',
      healthlabels: 'Vegetarian'
  }]
  const reqBody = {
      name,
      meals
  }
  context('post endpoint', () => {
    it('responds 200 and mealplan created when successful ', () =>{
        return supertest(app)
        .post('/api/saved-meal-plans/')
        .set('Authorization', auth)
        .send(reqBody)
        .expect(201)
        .then((res) => {
           expect(res.body.meals[0].label).to.eql('keto nachos')
           expect(res.body.meals[1].label).to.eql('eggplant')
           expect(res.body.meals[0].mealplan).to.eql(1)
        })     
    })
    context('responds with missing field response when a required field is missing', () => {
        const fields = ['label', 'meal_url', 'meal_image']
        fields.forEach(field => {
            const meal = {
                label: 'eggplant',
                meal_url: 'greatwebstie.com',
                meal_image: 'webiste.com',
                dietlabels: 'Low-Fat, Low-Carb',
                healthlabels: 'Vegetarian'
            }
        it('responds 400', () => {
            delete meal[field];
            return supertest(app)
            .post('/api/saved-meal-plans/')
            .set('Authorization', auth)
            .send({name: "asdf", meals: [meal]})
            .expect(400, {error: `Missing ${field}`})
        })
        })
    })
    context('missing name field', () => {
        const meal = {
            label: 'eggplant',
            meal_url: 'greatwebstie.com',
            meal_image: 'webiste.com',
            dietlabels: 'Low-Fat, Low-Carb',
            healthlabels: 'Vegetarian'
        }
        it('responds 400 when name is missing', () => {
            return supertest(app)
            .post('/api/saved-meal-plans/')
            .set('Authorization', auth)
            .send(meal)
            .expect(400, {error: "name and array of meals must be present in request body"})
        })
    })

  })
})