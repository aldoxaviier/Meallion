class recipesService {
    static async getRecipesByNameCategory(query, category, page, limit) {
        const firstPage = (page - 1) * limit;
        const nextPage = firstPage + limit - 1; 
        if (query && !category) {
            console.log("query");
            return null
        }
        else if (!query && category) {
            console.log("category");
            return null
        }
        else {
            console.log("dua duanya");
            return null
        }
    }
}

module.exports = { recipesService };