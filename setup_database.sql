-- Database Setup Script for Apple Ad Performance Dashboard
-- Run this script to create the database and user

-- Create the database
CREATE DATABASE ad_dashboard;

-- Create a user for the dashboard
CREATE USER dashboard_user WITH ENCRYPTED PASSWORD 'dashboard_password_2024';

-- Grant privileges to the user
GRANT ALL PRIVILEGES ON DATABASE ad_dashboard TO dashboard_user;

-- Connect to the new database (you'll need to run this separately)
\c ad_dashboard;

-- Grant schema privileges
GRANT ALL PRIVILEGES ON SCHEMA public TO dashboard_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO dashboard_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO dashboard_user;

-- Show successful completion
SELECT 'Database setup completed successfully!' as status; 