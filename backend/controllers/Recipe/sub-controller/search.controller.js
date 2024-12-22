const Recipe = require('../../../models/recipe.models');

const searchRecipes = async (searchTerm) => {
  const recipes = await Recipe.find({
    $or: [
      { title: { $regex: searchTerm, $options: "i" } },
      { summary: { $regex: searchTerm, $options: "i" } },
      { ingredients: { $regex: searchTerm, $options: "i" } },
    ],
  });
  return recipes;
}


const findSimilarRecipes = async (recipe) => {
    const similarRecipes = await Recipe.find({
      _id: { $ne: recipe._id },
      $or: [
        { ingredients: { $in: recipe.ingredients } },
        { category: recipe.category },
        { type: recipe.type },
      ],
    }).limit(5);
    return similarRecipes;
  }

  

 const search =  async (req, res) => {
    const searchTerm = req.query.term;
    const recipes = await searchRecipes(searchTerm);
    const similarRecipes = recipes.map(async (recipe) => {
      return await findSimilarRecipes(recipe);
    });
  
    res.json({success:true, recipes, similarRecipes });
  };


  module.exports = search

  
  
