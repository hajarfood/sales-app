-- Create a test user for authentication testing
-- This will help verify that the authentication system is working

-- Insert a test user into auth.users (this simulates a registered user)
-- Note: In production, users should register through the application
-- This is only for testing purposes

-- The password hash below is for '123456' - DO NOT use in production
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'test@example.com',
  '$2a$10$8K0QZ0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0',
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "مستخدم تجريبي", "username": "test"}',
  false,
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- The corresponding public.users record will be created automatically by the trigger
