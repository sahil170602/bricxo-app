import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ydedhiwidebsgmjlwkff.supabase.co'
const supabaseKey = 'sb_publishable_VzsQ87k-mLrjk6UTMiN1jg_rg9XFmea'

export const supabase = createClient(supabaseUrl, supabaseKey)