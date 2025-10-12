-- Add unique constraints to enable upsert operations

-- Add unique constraint on hymn_date for daily_hymns table
ALTER TABLE public.daily_hymns 
ADD CONSTRAINT daily_hymns_hymn_date_unique UNIQUE (hymn_date);

-- Add unique constraint on setting_key for church_settings table
ALTER TABLE public.church_settings 
ADD CONSTRAINT church_settings_setting_key_unique UNIQUE (setting_key);