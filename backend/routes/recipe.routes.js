const express = require('express');
const router = express.Router();

const uploader = require('../Utils/multer');

//middleware
const auth = require("../middleware/auth.middleware")


//controllers

const {createRecipe,getRecipes,getRecipeForUser, getRecipeFromSlug, getAllRecipes,
    createRating, likeRecipe,saveRecipe,
    search,
    basicStats,
    getNotifications,
    markAsRead,
    getUnreadNotifications,
    deleteRecipe,
    getOneRecipe,
    editRecipe
} = require('../controllers/Recipe/index');


//routes
router.post('/create-recipe', uploader.single('image'), createRecipe);


//get all recipes
router.get('/all-recipes', getRecipes)

// dynamic multiple routes for get recipes
router.get('/get-recipes/:userId', getRecipeForUser);

// from slug - single recipe
router.get('/get-single-recipe/:slug', getRecipeFromSlug)

//filter recipes route (multiple)
router.get('/filter-recipes',getAllRecipes)

//create rating
router.post('/new-rating', createRating);


//like recipe
router.post('/like-recipe', likeRecipe);

//save recipe
router.post('/save-recipe', saveRecipe);

//search
router.get('/search', search);

//basic stats
router.get('/basic-stats', basicStats);


//notifications
router.get('/all-notifications/:userId', getNotifications)

router.post('/mark-as-read/:userId', markAsRead)

router.get('/get-unread-notifications/:userId',  getUnreadNotifications)

//delete recipe
router.delete('/delete-recipe/:id',auth ,deleteRecipe);

//get single recipe
router.get('/get-one-recipe/:slug', getOneRecipe);

//edit recipe
router.patch('/edit-recipe/:slug',auth, editRecipe);

module.exports = router;