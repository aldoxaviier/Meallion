from supabase import create_client, Client
from core.config import setting

SUPABASE_URL = setting.SupabaseUrl
SUPABASE_KEY = setting.SupabaseKey
supabase_client: Client = create_client(SUPABASE_URL, SUPABASE_KEY)