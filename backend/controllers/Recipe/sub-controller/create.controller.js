const Recipe = require('../../../models/recipe.models')
const User = require('../../../models/user.models')
const slug = require('slug')
const { uploadFile } = require('../../../Utils/fileUpload')
const Notification = require('../../../models/notification.model')

//create
const createRecipe = async (req, res) => {
  try {
    let { title, summary, description, type, categories, methods, ingredients , userId } = req.body;
    const image = req.file.path;

    ingredients = JSON.parse(ingredients);
    categories = JSON.parse(categories);
    methods = JSON.parse(methods);


    // Check if the title already exists
    const validateTitle = await Recipe.findOne({ title });
    if (validateTitle) {
      return res.status(400).json({ success: false, message: "Title Already Exists" });
    }

    // Create slug from the title and ensure it's unique
    let slugTitle = slug(title);
    let existingSlug = await Recipe.findOne({ slug: slugTitle });
    while (existingSlug) {
      slugTitle = `${slugTitle}-${Math.floor(Math.random() * 10000)}`;
      existingSlug = await Recipe.findOne({ slug: slugTitle });
    }

    // Upload image
    const uploadImage = await uploadFile(image, "recipe-images");
    if (!uploadImage) {
      return res.status(400).json({ success: false, message: "Error uploading image" });
    }

    // Create recipe
    const newRecipe = new Recipe({
      title,
      slug: slugTitle,
      summary,
      description,
      image: uploadImage.secure_url,
      imageId: uploadImage.public_id,
      userId,
      type,
    });

    // Add categories, methods, and ingredients
    if (Array.isArray(categories)) {
      categories.forEach((category) => {
        newRecipe.categories.push(category.toLowerCase());
      });
    }
    
    if (Array.isArray(methods)) {
      methods.forEach((method) => {
        newRecipe.method.push(method.toLowerCase());
      });
    }
    
    if (Array.isArray(ingredients)) {
      ingredients.forEach((ingredient) => {
        newRecipe.ingredients.push(ingredient.toLowerCase());
      });
    }

    const recipe = await newRecipe.save();
    

    // Updating user profile
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }
    user.recipesPosted.push(recipe._id);
    await user.save();


    user.followers.forEach(async (follower)=>{
      // Create notification
    const notification = new Notification({
      type: 'newRecipe',
      sender: userId,
      receiver: follower,
      recipe: newRecipe._id,
      message: `${userId} added new recipe recipe ${newRecipe.title}`,
      });
      await notification.save();
    })
  

    return res.status(200).json({ success: true, message: "Recipe created successfully", recipe });
  } catch (error) {
    console.error("Error on createRecipe:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = createRecipe;

