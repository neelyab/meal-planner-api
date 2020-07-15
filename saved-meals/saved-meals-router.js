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
    let mealIds;
    let responseObject = [];
    // get unique meal ids
    return SavedMealsService.getSavedMealIds(req.app.get('db'), user)
    .then(ids => {
        //push meal ids into an array to use later 
        mealIds = ids.map(id=> id.mealplan_id)
        // get all the saved meals
        return SavedMealsService.getAllSavedMeals(req.app.get('db'), user)
        .then(mealPlan => {  
            mealIds.map(id => {
                //filter meal plans by id, push to sortedMealPlans array
                let sortedMealPlans = [];
                sortedMealPlans.push(mealPlan.filter(meal => id === meal.mealplan_id))
                sortedMealPlans.map(meals => {
                    const mealPlanById = {
                        name: meals[0].mealplan_name,
                        meals: sortedMealPlans[0]
                    }
                    responseObject.push(mealPlanById)
                })
            })
        })
        .then( () => res.status(200).json(responseObject))
    })
})
.post(jsonBodyParser, (req, res, next) => {
    const user = req.user.id
    const {name} = req.body;
    const meals = req.body.meals;
    // check to see if name and meals array are present
    if (!name || !meals || meals.length === 0) {
        return res.status(400).json({error: `name and array of meals must be present in request body`})
    } 
    let error;
    meals.forEach(meal => {
    for (const field of ['meal_image', 'meal_url', 'label']){
        if (!meal[field]){
            error = `Missing ${field}`
        }
            }
    for (const [key, value] of Object.entries(meal)){
        if (value === null) {
           error = `Missing value for ${key}`
        }
    }
    })
    if (error){
        return res.status(400).json({error})
    }
    // make an object for the saved meal plan
    const savedMealPlan = {
        mealplan_name: name,
        user_id: user
    }
    
    SavedMealsService.saveNewMealPlan(req.app.get('db'), savedMealPlan, meals, user)
    .then((meals) => {
        return res.status(201).json({name: savedMealPlan.mealplan_name, meals})
    })
    .catch(next)
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