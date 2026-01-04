-- PowerSync Database Setup - https://docs.powersync.com/installation/database-setup#postgres
-- This script initializes the database for PowerSync local development

-- Create a role/user with replication privileges for PowerSync
CREATE ROLE powersync_role WITH REPLICATION BYPASSRLS LOGIN PASSWORD 'powersync_dev';

-- Set up permissions for the newly created role
-- Read-only (SELECT) access is required
GRANT SELECT ON ALL TABLES IN SCHEMA public TO powersync_role;

-- Grant SELECT on all future tables (to cater for schema additions)
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO powersync_role;

-- Create a publication to replicate tables. The publication must be named "powersync"
CREATE PUBLICATION powersync FOR ALL TABLES;
