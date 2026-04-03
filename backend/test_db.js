import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    try {
        console.log("Connecting to Supabase at:", supabaseUrl);
        const { data, error } = await supabase
            .from('users')
            .select('count', { count: 'exact', head: true });
        
        if (error) {
            console.error("Supabase Error:", error);
        } else {
            console.log("Successfully connected! User count:", data);
        }
    } catch (e) {
        console.error("Exception details:", e);
    }
}

testConnection();
