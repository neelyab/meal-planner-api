const express = require('express')
const SavedMealsService = require('./saved-meals-service')
const requireAuth = require('../middleware/jwt-auth')
const xss = require('xss')

savedMealsRouter = express.Router()
jsonBodyParser = express.json()

// get all saved meals by user
savedMealsRouter
.route('/')
.all(requireAuth)
.get((req, res) => {
    const user = req.user.id
    return SavedMealsService.getAllSavedMeals(req.app.get('db'), user)
    .then(meal => {
        return res.status(200).json(meal)
    })
})
.post(jsonBodyParser, (req, res) => {
    const user = req.user.id
    const {name} = req.body;
    const meals = req.body.meals;
    // check to see if name and meals array are present
    if (!name || !meals) {
        return res.status(400).json({error: `name and array of meals must be present in request body`})
    }
    // make an object for the saved meal plan
    const savedMealPlan = {
        mealplan_name: name,
        user_id: user
    }
    // check to make sure that 
    // for (const [key, value] of Object.entries(savedMeal)){
    //     if (value === null) {
    //         res.status(400).json({error: `please enter a value for ${key}`})
    //     }
    // }
   // check to make sure all fields are present in the meals array
    meals.map(meal => {
        for (const field of ['meal_image', 'meal_url', 'label']){
            if (!meal[field]){
                return res.status(400).json({error: `Missing ${field}`})
            }
        }
    })
    
    return SavedMealsService.saveNewMealPlan(req.app.get('db'), savedMealPlan, meals, user)
    .then(() => {
        return res.status(204).send(`Meal plan saved`)
    })
})

// mealplan by id route
savedMealsRouter
.route('/:mealId')
.all(requireAuth)
.get(checkIfExists, (req, res) => {
  const mealId = req.mealId
  const user = req.user
  return SavedMealsService.getMealPlanDetails(req.app.get('db'), mealId, user)
  .then(mealPlan => {
    return res.status(200).json(mealPlan)
  })
})
.delete(checkIfExists, (req, res) => {
    const mealId = req.mealId
    const user = req.user
    return SavedMealsService.deleteMealPlan(req.app.get('db'), mealId, user)
    .then(() => {
        return res.status(200).send(`Plan ${mealId} deleted`)
    })

})
//async function to check if a mealplan with the id exists
async function checkIfExists(req, res, next) {
    try {
    const user = req.user.id
    const mealId = req.params.mealId
    const mealPlan = await SavedMealsService.getMealPlanById(req.app.get('db'), mealId, user)
    if(!mealPlan){
        // error if meal id not found
        return res.status(404).json({error: 'Meal plan not found'})
    }
    // if there is a mealplan by id, assign mealid and user to a variable and send to the next middleware
    req.user = user
    req.mealId = mealId
    next()
    }
    catch(error) {
        next(error)
    }
}
function cleaner(meal){
    meal.map(m => {
        return {
            user_id,
            mealplan_id, 
            mealplan_name: xss(m.mealplan_name),
            label,
            meal_id,
            meal_url,
            meal_image,
            dietlabels,
            healthlabels
        }
    })
}
module.exports = savedMealsRouter;