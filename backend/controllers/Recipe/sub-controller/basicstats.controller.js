const Recipe = require('../../../models/recipe.models')
const User = require('../../../models/user.models')



// counting basic stats

const basicStats = async (req, res) => {
    try {
        const totalRecipes = await Recipe.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalCategoriesData = await Recipe.distinct('categories');
        const totalTypesData = await Recipe.distinct('type')

        const totalCategories = totalCategoriesData.length;
        const totalTypes = totalTypesData.length;

        res.status(200).json({success:true,message:"Count Successful" ,data:{totalRecipes, totalUsers, totalCategories, totalTypes} });
    } catch (error) {
        res.status(500).json({success:false,message:"Internal server error", error: error.message });
    }
}

module.exports = basicStats;