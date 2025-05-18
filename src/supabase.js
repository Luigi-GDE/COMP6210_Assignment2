import {createClient} from '@supabase/supabase-js';

const supabaseUrl = 'https://uzfxafltcckxursnmvmn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6ZnhhZmx0Y2NreHVyc25tdm1uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzA4MDU1MCwiZXhwIjoyMDYyNjU2NTUwfQ.AL9gTd5wCTq9qrlST02SBPAjcj9SoxUySS6NSO2mcPQ';

export const supabase = createClient(supabaseUrl, supabaseKey);