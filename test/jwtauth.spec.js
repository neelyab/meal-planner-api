const jwt = require('jsonwebtoken')
const app = require('../src/app')
const knex = require('knex')
const helpers = require('./test-helpers')

describe('Authentication Endpoint', () => {
    let db;
    before('make connection', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })
    after('destroy connection', () => db.destroy())
    before('clean up table', () =>{
        return db.raw('TRUNCATE TABLE saved_meal_plans, saved_meals, users RESTART IDENTITY CASCADE;')
    })
    afterEach('clean up table', () => {
       return db.raw('TRUNCATE TABLE saved_meal_plans, saved_meals, users RESTART IDENTITY CASCADE;')
    })
    context('Bearer Token', () =>{
        beforeEach('seed users', () => {
            const usersArray = helpers.makeUsersArray()
           return helpers.seedUsers(db, usersArray)
        })
        it('header without bearer token returns 401 unauthorized', () => {
            return supertest(app)
            .get('/api/saved-meals')
            .expect(401, {error: 'Missing bearer token'})
        })
        const invalidUser = {
            id: 123,
            username: 'invalid',
            password: 'password'
        }
        it('header with invalid bearer token returns 401 unauthorized', () => {
            return supertest(app)
            .get('/api/saved-meals')
            .set('Authorization', helpers.makeAuthHeader(invalidUser))
            .expect(401)
        })
        const usersArray = helpers.makeUsersArray()
        const user = usersArray[0]
        const loginAttempt = {
            username: user.username,
            password: user.user_password
        }
        const expectedToken = jwt.sign(
            { user_id: user.id }, // payload
            process.env.JWT_SECRET,
            {
              subject: user.username,
              expiresIn: process.env.JWT_EXPIRY,
              algorithm: 'HS256',
            }
          )
        it('POST /api/auth/login returns 200 when successful login', () => {
            return supertest(app)
            .post('/api/auth/login')
            .send(loginAttempt)
            .expect(200, { authToken: expectedToken})
        })
        it('POST /api/auth/login returns 400 when incorrect user', () => {
            return supertest(app)
            .post('/api/auth/login')
            .send(invalidUser)
            .expect(400, {error: 'Incorrect username or password'})
        })
        const wrongPassword = {
            username: user.username,
            password: 'invalid'
        }
        it('POST /api/auth/login returns 400 when the correct username is present but invalid password', () => {
            return supertest(app)
            .post('/api/auth/login')
            .send(wrongPassword)
            .expect(400, {error: 'Invalid username or password'})
        })
        const missingPassword = {
            username: user.username,
            password: null
        }
        it('POST /api/auth/login returns 400 when no password is present', () => {
            return supertest(app)
            .post('/api/auth/login')
            .send(missingPassword)
            .expect(400, {error: `Missing password`})
        })
    })
})