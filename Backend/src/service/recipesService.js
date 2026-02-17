const recipesRepository = require('../repositories/recipesRepository')
class recipesService {
    static async getRecipesByNameCategory(query, category, page = 1, limit = 10) {
        const firstPage = (page - 1) * limit;
        const nextPage = firstPage + limit - 1;
        
        if (query && !category) {
            const result = await recipesRepository.getRecipesByName(query, firstPage, nextPage)
            return result
        }
        else if (!query && category) {
            const categories = category.split(',')
            const result = await recipesRepository.getRecipesByCategory(categories, firstPage, nextPage)
            return result
        }
        else {
            const categories = category.split(',')
            const result = await recipesRepository.getRecipesByNameCategory(query, categories, firstPage, nextPage)
            return result
        }
    }
}

module.exports = recipesService