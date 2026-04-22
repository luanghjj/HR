-- Update OMOI: rename to Café, set Monday as day off
UPDATE locations 
SET name = 'O·MO·I Café',
    day_off = '[1]'::jsonb
WHERE id = 'omoistuttgart';
