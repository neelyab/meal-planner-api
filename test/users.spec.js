const helpers = require('./test-helpers')
const app = require('../src/app')
const knex = require('knex')
const {expect} = require('chai')

const usersArray = helpers.makeUsersArray()


describe('Embroidery User endpoints', () => {
    let db
    before('make knex instance', () =>{
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        })
        app.set('db', db)
    })
    before('clean tables', () => {
       return db.raw('TRUNCATE TABLE saved_meal_plans, saved_meals, users RESTART IDENTITY CASCADE')
    })
    afterEach('clean up tables', () => {
       return db.raw('TRUNCATE TABLE saved_meal_plans, saved_meals, users RESTART IDENTITY CASCADE')
    })
    describe('user registration field requirements', () => {
        context('POST /users missing fields returns status 400', () => {
            const requiredFields = ['username', 'user_password', 'first_name']
            requiredFields.forEach(field => {
                const registerAttempt = {
                username: 'test user_name',
                user_password: 'test password',
                first_name: 'test full_name',
              } 
              it(`POST /users returns 400 status when missing ${field} in request body`, () => {
                delete registerAttempt[field];
                return supertest(app)
                .post('/api/users/')
                .send(registerAttempt)
                .expect(400)
            })
        })
        context('POST /users password requirements', () =>{
            const shortPassword = {
                username: 'test',
                user_password: 'P1!j',
                first_name: 'name'
            }
            const longPassword = {
                username: 'test1',
                user_password: '!1k*'.repeat(72),
                first_name: 'name'
            }
            const startSpacePassword = {
                username: 'test2',
                user_password: ' 1!Password',
                first_name: 'name'
            }
            const endSpacePassword = {
                username: 'test2',
                user_password: '1!Password ',
                first_name: 'name'
            }
            const invalidRequirements =  {
                username: 'test user_name',
                user_password: 'test password',
                first_name: 'test full_name',
                }
            it('/POST users/ with short password returns 400', () => {
                return supertest(app)
                .post('/api/users/')
                .send(shortPassword)
                .expect(400, {error: 'Password must be longer than 8 characters'})
            })
            it('/POST /users returns 400 when password is too long', () => {
                return supertest(app)
                .post('/api/users')
                .send(longPassword)
                .expect(400, {error:'Password must be less than 72 characters'})
            })
            it('/POST users/ with space at beginner or end returns 400', () => {
                return supertest(app)
                .post('/api/users')
                .send(startSpacePassword)
                .expect(400, {error:'Password must not start or end with empty spaces'})
            })
            it('/POST users/ with space at beginning or end returns 400', () => {
                return supertest(app)
                .post('/api/users')
                .send(endSpacePassword)
                .expect(400, {error:'Password must not start or end with empty spaces'})
            })
            it('returns 404 password must contain...', () => {
                return supertest(app)
                .post('/api/users/')
                .send(invalidRequirements)
                .expect(400, {error:'Password must contain one upper case, lower case, number and special character'})
            })
        })
    })
    })
    describe('duplicate username', () => {
        before('insert test users into db', () => {
            return db.into('users').insert(usersArray)
         })
        context('POST /users returns 400 when the username already exists', () => {
            const duplicateUser = {
                username:'test-user-1',
                user_password: 'Password1!',
                first_name: 'Test',
            }  
            it('returns 400 username already taken', () => {  
                return supertest(app)
                .post('/api/users')
                .send(duplicateUser)
                .expect(400, {error: 'Username already taken'})
            })
        })
    })
    describe('new user registration success', () => {
        context('POST /users posts new user into database and returns user information in json response', () => {
            const newUser = {
                username: 'admin',
                user_password: 'Password!1',
                first_name: 'amanda'
            }
            it('creates new user', () => {
                return supertest(app)
                .post('/api/users/')
                .send(newUser)
                .expect(201)
            })
        })
    })
})