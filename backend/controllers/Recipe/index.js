const createRecipe = require('./sub-controller/create.controller')
const {getRecipes,getRecipeForUser} = require('./sub-controller/get.controller')
const getRecipeFromSlug = require('./sub-controller/singlerecipe.controller')
const getAllRecipes = require('./sub-controller/filterRecipe.controller')

const {createRating} = require('./sub-controller/rating.controller')

const {likeRecipe,saveRecipe} = require('./sub-controller/likesave.controller')

const search = require('./sub-controller/search.controller')
const basicStats = require('./sub-controller/basicstats.controller')

const {getNotifications, markAsRead, getUnreadNotifications} = require('./sub-controller/notification.controller')

const deleteRecipe = require('./sub-controller/delete.controller')

const getOneRecipe = require('./sub-controller/getSingleRecipe.controller')
const editRecipe = require('./sub-controller/editRecipe.controller')



module.exports = {
    createRecipe,
    getRecipes,
    getRecipeForUser,
    getRecipeFromSlug,
    getAllRecipes,
    createRating,
    likeRecipe,
    saveRecipe,
    search,
    basicStats,
    getNotifications,
    markAsRead,
    getUnreadNotifications,
    deleteRecipe,
    getOneRecipe,
    editRecipe
}