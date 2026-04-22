-- Update OMOI GPS coordinates + day_off (Monday only)
UPDATE locations 
SET name = 'O·MO·I Café',
    lat = 48.7704374,
    lng = 9.1766313,
    radius_m = 50,
    day_off = ARRAY[1]
WHERE id = 'omoistuttgart';
