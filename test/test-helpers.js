const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
    return [
      {
        id: 1,
        username: 'test-user-1',
        first_name: 'Test user 1',
        user_password: 'password',
        date_created: '2029-01-22T16:28:32.615Z',
      },
      {
        id: 2,
        username: 'test-user-2',
        first_name: 'Test user 2',
        user_password: 'password',
        date_created: '2029-01-22T16:28:32.615Z',
      },
      {
        id: 3,
        username: 'test-user-3',
        first_name: 'Test user 3',
        user_password: 'password',
        date_created: '2029-01-22T16:28:32.615Z',
      },
      {
        id: 4,
        username: 'test-user-4',
        first_name: 'Test user 4',
        user_password: 'password',
        date_created: '2029-01-22T16:28:32.615Z',
      },
    ]
  }
  function makePlans() {
      return [
        {         user_id: 1,
          mealplan_name: 'keto mealplan'
        },
        {
            
            user_id: 1,
            mealplan_name: 'veggie mealplan'
        },
        {
            
            user_id: 2,
            mealplan_name: 'this weeks mealplan'
        },
        {
           
            user_id: 2,
            mealplan_name: 'tuesday mealplan'
        },
        {
           
            user_id: 2,
            mealplan_name: 'paleo mealplan'
        },

    ];
  }
  function makeMeals() {
      return [
          {
              mealplan: 1,
              label: 'keto nachos',
              meal_url: 'greatwebstie.com',
              meal_image: 'webiste.com',
              dietlabels: 'Low-Fat, Low-Carb',
              healthlabels: 'Vegetarian'
          },
          {
            mealplan: 1,
            label: 'eggplant',
            meal_url: 'greatwebstie.com',
            meal_image: 'webiste.com',
            dietlabels: 'Low-Fat, Low-Carb',
            healthlabels: 'Vegetarian'
        },
        {
            mealplan: 1,
            label: 'muffins',
            meal_url: 'greatwebstie.com',
            meal_image: 'webiste.com',
            dietlabels: 'Low-Fat, Low-Carb',
            healthlabels: 'Vegetarian'
        },
        {
            mealplan: 2,
            label: 'spaghetti',
            meal_url: 'greatwebstie.com',
            meal_image: 'webiste.com',
            dietlabels: 'Low-Fat, Low-Carb',
            healthlabels: 'Vegetarian'
        },
        {
            mealplan: 2,
            label: 'chicken',
            meal_url: 'greatwebstie.com',
            meal_image: 'webiste.com',
            dietlabels: 'Low-Fat, Low-Carb',
            healthlabels: 'Vegetarian'
        },
        {
            mealplan: 3,
            label: 'stuffed peppers',
            meal_url: 'greatwebstie.com',
            meal_image: 'webiste.com',
            dietlabels: 'Low-Fat, Low-Carb',
            healthlabels: 'Vegetarian'
        }]
  }
  function seedUsers(db, users){
    const preppedUsers = users.map(user=> ({
      ...user,
      user_password: bcrypt.hashSync(user.user_password, 1)
    }))
    return db.into('users').insert(preppedUsers)
  }
  function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
           subject: user.username,
           algorithm: 'HS256',
         })
       return `Bearer ${token}`
  }
  function seedSavedPlans(db, plans){
    return db.into('saved_meal_plans').insert(plans)
  }
  function seedMeals(db, meals){
      return db.into('saved_meals').insert(meals)
  }
  module.exports = {
    makeUsersArray,
    seedUsers,
    makeAuthHeader,
    makePlans,
    makeMeals,
    seedSavedPlans,
    seedMeals
  }