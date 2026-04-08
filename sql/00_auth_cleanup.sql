-- XOÁ SẠCH auth + profiles để tạo lại
DELETE FROM auth.identities;
DELETE FROM auth.users;
TRUNCATE user_profiles;  

SELECT 'Auth cleaned: ' || count(*) || ' users remain' as status FROM auth.users;
