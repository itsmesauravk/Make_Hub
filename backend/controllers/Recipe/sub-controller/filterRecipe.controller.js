const Recipe = require('../../../models/recipe.models')
const User = require('../../../models/user.models')
// const redisClient = require('../../../Utils/RedisClient')


const getAllRecipes = async (req, res) => {
    try {
      const { page = 1, limit = 8, type='all', category='all',  sort='newest' } = req.query;

     
  
      const query = {};
  
      // Filtering by type
      if (type && type !== 'all') {
        query.type = type;
      }
  
      // Filtering by category
      if (category && category !== 'all') {
        query.categories = { $in: [category.toLowerCase()] };
      }
  
   
  
      // Sorting
      let sortOption = {};
      if (sort) {
        if (sort === 'popular') {
          sortOption = { views: -1 };
        } else if (sort === 'newest') {
          sortOption = { createdAt: -1 };
        } else if (sort === 'oldest') {
            sortOption = { createdAt: 1 };
        }else if (sort === 'high-low') {
          sortOption = { likeCounts: -1 };
        }else if (sort === 'low-high') {
            sortOption = { likeCounts: 1 };
          }
      }
  
      // Pagination
      const recipes = await Recipe.find(query)
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
  
      const total = await Recipe.countDocuments(query);
  
      res.status(200).json({
        success: true,
        message: 'Recipes fetched successfully',
        data: recipes,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      });
    } catch (error) {
      console.error('Error fetching recipes:', error);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  };

  
// const getAllRecipes = async (req, res) => {
//   try {
//     const { page = 1, limit = 8, type = 'all', category = 'all', sort = 'newest' } = req.query;

//     // Check if Redis client is connected
//     if (!redisClient.isOpen) {
//       console.error('Redis client is not connected');
//       return res.status(500).json({
//         success: false,
//         message: 'Redis client not connected',
//       });
//     }

//     const query = {};

//     // Filtering by type
//     if (type && type !== 'all') {
//       query.type = type;
//     }

//     // Filtering by category
//     if (category && category !== 'all') {
//       query.categories = { $in: [category.toLowerCase()] };
//     }

//     // Sorting options
//     let sortOption = {};
//     if (sort === 'popular') {
//       sortOption = { views: -1 };
//     } else if (sort === 'newest') {
//       sortOption = { createdAt: -1 };
//     } else if (sort === 'oldest') {
//       sortOption = { createdAt: 1 };
//     } else if (sort === 'high-low') {
//       sortOption = { likeCounts: -1 };
//     } else if (sort === 'low-high') {
//       sortOption = { likeCounts: 1 };
//     }

//     // Redis cache key
//     const cacheKey = JSON.stringify({ query, page, limit, sort });
//     let results;
//     let isCached = false;

//     const cacheResults = await redisClient.get(cacheKey);
//     if (cacheResults) {
//       isCached = true;
//       results = JSON.parse(cacheResults);
//     } else {
//       // Fetch from MongoDB if cache miss
//       results = await Recipe.find(query)
//         .sort(sortOption)
//         .skip((page - 1) * limit)
//         .limit(parseInt(limit));

//       const total = await Recipe.countDocuments(query);

//       // Store results and total in Redis
//       await redisClient.set(cacheKey, JSON.stringify({ results, total }), 'EX', 3600);  // 1-hour expiration
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Recipes fetched successfully',
//       fromCache: isCached,
//       data: results.results,
//       total: results.total,
//       page: parseInt(page),
//       pages: Math.ceil(results.total / limit),
//     });
//   } catch (error) {
//     console.error('Error fetching recipes:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal Server Error',
//     });
//   }
// };


module.exports = getAllRecipes;


  
