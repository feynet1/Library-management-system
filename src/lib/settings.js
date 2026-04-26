import { supabase } from '../supabase';

export const fetchSystemSetting = async (key) => {
    const { data, error } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', key)
        .single();
    
    if (error) {
        // If the table doesn't exist or row doesn't exist, we might get an error
        // Default to true (enabled) if we can't find it to prevent locking everyone out
        return { data: true, error };
    }
    return { data: data?.value, error: null };
};

export const updateSystemSetting = async (key, value) => {
    const { data, error } = await supabase
        .from('system_settings')
        .upsert({ key, value })
        .select()
        .single();
    return { data, error };
};
