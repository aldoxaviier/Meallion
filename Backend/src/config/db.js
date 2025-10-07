const {createClient} = require('@supabase/supabase-js');

class Database {
    static client = createClient(process.env.SupabaseUrl, process.env.SupabaseKey);
    // static async getClient() {
    //     if(!this.client) {
    //         const supabaseUrl = process.env.SupabaseUrl;
    //         const supabaseKey = process.env.SupabaseKey;
    //         this.client = createClient(supabaseUrl, supabaseKey)
    //     }
    //     return this.client
    // }
}
module.exports = Database.client ;
