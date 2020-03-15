CREATE DATABASE pickcel;

--------------------------------------------- uuid_v4() -----------------------------------------------------
-------------------------------------------------------------------------------------------------------------
CREATE DEFINER=`root`@`localhost` FUNCTION `uuid_v4`() RETURNS char(36) CHARSET utf8
BEGIN
    -- Generate 8 2-byte strings that we will combine into a UUIDv4
    SET @h1 = SUBSTR(UUID(), 3, 4);
    SET @h2 = SUBSTR(UUID(), 3, 4);
    SET @h3 = LPAD(HEX(FLOOR(RAND() * 0xffff)), 4, '0');
    SET @h6 = LPAD(HEX(FLOOR(RAND() * 0xffff)), 4, '0');
    SET @h7 = LPAD(HEX(FLOOR(RAND() * 0xffff)), 4, '0');
    SET @h8 = LPAD(HEX(FLOOR(RAND() * 0xffff)), 4, '0');

    -- 4th section will start with a 4 indicating the version
    SET @h4 = CONCAT('4', LPAD(HEX(FLOOR(RAND() * 0x0fff)), 3, '0'));

    -- 5th section first half-byte can only be 8, 9 A or B
    SET @h5 = CONCAT(HEX(FLOOR(RAND() * 4 + 8)),
                LPAD(HEX(FLOOR(RAND() * 0x0fff)), 3, '0'));

    -- Build the complete UUID
    RETURN LOWER(CONCAT(
        @h1, @h2, '-', @h3, '-', @h4, '-', @h5, '-', @h6, @h7, @h8
    ));
END
-------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------

--------------------------------------------- assets --------------------------------------------------------
-------------------------------------------------------------------------------------------------------------
CREATE TABLE `pickcel`.`assets` (
  `id` CHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `type` SMALLINT NOT NULL,
  `size` DECIMAL NULL,
  `dimension` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `modified_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `duration` INT NULL,
  `content` TEXT NULL,
  `user_id` CHAR(36) NOT NULL,
  PRIMARY KEY (`id`));
DROP TRIGGER IF EXISTS `pickcel`.`assets_BEFORE_INSERT`;

DELIMITER $$
USE `pickcel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `pickcel`.`assets_BEFORE_INSERT` BEFORE INSERT ON `assets` FOR EACH ROW
BEGIN
	IF new.id IS NULL THEN
		SET new.id = uuid_v4();
	  END IF;
END$$
DELIMITER ;
DROP TRIGGER IF EXISTS `pickcel`.`assets_AFTER_INSERT`;

DELIMITER $$
USE `pickcel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `pickcel`.`assets_AFTER_INSERT` AFTER INSERT ON `assets` FOR EACH ROW
BEGIN
	IF new.id IS NOT NULL THEN
		DROP TEMPORARY TABLE IF EXISTS temp_insert_assets;
		DROP TEMPORARY TABLE IF EXISTS temp_update_assets;
		DROP TEMPORARY TABLE IF EXISTS temp_delete_assets;
		CREATE TEMPORARY TABLE IF NOT EXISTS temp_insert_assets
        SELECT * FROM assets WHERE id = new.id;
    END IF;
END$$
DELIMITER ;
DROP TRIGGER IF EXISTS `pickcel`.`assets_AFTER_UPDATE`;

DELIMITER $$
USE `pickcel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `pickcel`.`assets_AFTER_UPDATE` AFTER UPDATE ON `assets` FOR EACH ROW
BEGIN
	IF new.id IS NOT NULL THEN
		DROP TEMPORARY TABLE IF EXISTS temp_insert_assets;
		DROP TEMPORARY TABLE IF EXISTS temp_update_assets;
		DROP TEMPORARY TABLE IF EXISTS temp_delete_assets;
		CREATE TEMPORARY TABLE IF NOT EXISTS temp_update_assets
        SELECT * FROM assets WHERE id = new.id;
    END IF;
END$$
DELIMITER ;
DROP TRIGGER IF EXISTS `pickcel`.`assets_BEFORE_DELETE`;

DELIMITER $$
USE `pickcel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `pickcel`.`assets_BEFORE_DELETE` BEFORE DELETE ON `assets` FOR EACH ROW
BEGIN
	IF old.id IS NOT NULL THEN
		DROP TEMPORARY TABLE IF EXISTS temp_insert_assets;
		DROP TEMPORARY TABLE IF EXISTS temp_update_assets;
		DROP TEMPORARY TABLE IF EXISTS temp_delete_assets;
		CREATE TEMPORARY TABLE IF NOT EXISTS temp_delete_assets
        SELECT * FROM assets WHERE id = old.id;
    END IF;
END$$
DELIMITER ;
-------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------

--------------------------------------------- schedule_compositions -----------------------------------------
-------------------------------------------------------------------------------------------------------------
CREATE TABLE `pickcel`.`schedule_compositions` (
  `id` CHAR(36) NOT NULL,
  `schedule_id` CHAR(36) NOT NULL,
  `composition_id` CHAR(36) NOT NULL,
  `start_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `end_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `is_repeat` BOOLEAN DEFAULT FALSE,
  `monday` BOOLEAN DEFAULT FALSE,
  `tuesday` BOOLEAN DEFAULT FALSE,
  `wednesday` BOOLEAN DEFAULT FALSE,
  `thursday` BOOLEAN DEFAULT FALSE,
  `friday` BOOLEAN DEFAULT FALSE,
  `saturday` BOOLEAN DEFAULT FALSE,
  `sunday` BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (`id`));
DROP TRIGGER IF EXISTS `pickcel`.`schedule_compositions_BEFORE_INSERT`;

DELIMITER $$
USE `pickcel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `pickcel`.`schedule_compositions_BEFORE_INSERT` BEFORE INSERT ON `schedule_compositions` FOR EACH ROW
BEGIN
	IF new.id IS NULL THEN
		SET new.id = uuid_v4();
	  END IF;
END$$
DELIMITER ;
DROP TRIGGER IF EXISTS `pickcel`.`schedule_compositions_AFTER_INSERT`;

DELIMITER $$
USE `pickcel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `pickcel`.`schedule_compositions_AFTER_INSERT` AFTER INSERT ON `schedule_compositions` FOR EACH ROW
BEGIN
	IF new.id IS NOT NULL THEN
		DROP TEMPORARY TABLE IF EXISTS temp_insert_schedule_compositions;
		DROP TEMPORARY TABLE IF EXISTS temp_update_schedule_compositions;
		DROP TEMPORARY TABLE IF EXISTS temp_delete_schedule_compositions;
		CREATE TEMPORARY TABLE IF NOT EXISTS temp_insert_schedule_compositions
        SELECT * FROM schedule_compositions WHERE id = new.id;
    END IF;
END$$
DELIMITER ;
DROP TRIGGER IF EXISTS `pickcel`.`schedule_compositions_AFTER_UPDATE`;

DELIMITER $$
USE `pickcel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `pickcel`.`schedule_compositions_AFTER_UPDATE` AFTER UPDATE ON `schedule_compositions` FOR EACH ROW
BEGIN
	IF new.id IS NOT NULL THEN
		DROP TEMPORARY TABLE IF EXISTS temp_insert_schedule_compositions;
		DROP TEMPORARY TABLE IF EXISTS temp_update_schedule_compositions;
		DROP TEMPORARY TABLE IF EXISTS temp_delete_schedule_compositions;
		CREATE TEMPORARY TABLE IF NOT EXISTS temp_update_schedule_compositions
        SELECT * FROM schedule_compositions WHERE id = new.id;
    END IF;
END$$
DELIMITER ;
DROP TRIGGER IF EXISTS `pickcel`.`schedule_compositions_BEFORE_DELETE`;

DELIMITER $$
USE `pickcel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `pickcel`.`schedule_compositions_BEFORE_DELETE` BEFORE DELETE ON `schedule_compositions` FOR EACH ROW
BEGIN
	IF old.id IS NOT NULL THEN
		DROP TEMPORARY TABLE IF EXISTS temp_insert_schedule_compositions;
		DROP TEMPORARY TABLE IF EXISTS temp_update_schedule_compositions;
		DROP TEMPORARY TABLE IF EXISTS temp_delete_schedule_compositions;
		CREATE TEMPORARY TABLE IF NOT EXISTS temp_delete_schedule_compositions
        SELECT * FROM schedule_compositions WHERE id = old.id;
    END IF;
END$$
DELIMITER ;
-------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------

--------------------------------------------- compositions --------------------------------------------------
-------------------------------------------------------------------------------------------------------------
CREATE TABLE `pickcel`.`compositions` (
  `id` CHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `modified_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `version` SMALLINT NOT NULL DEFAULT 1,
  `duration` INTEGER NOT NULL DEFAULT 0,
  `template_id` CHAR(36) NOT NULL,
  `user_id` CHAR(36) NOT NULL,
  PRIMARY KEY (`id`));
DROP TRIGGER IF EXISTS `pickcel`.`compositions_BEFORE_INSERT`;

DELIMITER $$
USE `pickcel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `pickcel`.`compositions_BEFORE_INSERT` BEFORE INSERT ON `compositions` FOR EACH ROW
BEGIN
	IF new.id IS NULL THEN
		SET new.id = uuid_v4();
	  END IF;
END$$
DELIMITER ;
DROP TRIGGER IF EXISTS `pickcel`.`compositions_AFTER_INSERT`;

DELIMITER $$
USE `pickcel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `pickcel`.`compositions_AFTER_INSERT` AFTER INSERT ON `compositions` FOR EACH ROW
BEGIN
	IF new.id IS NOT NULL THEN
		DROP TEMPORARY TABLE IF EXISTS temp_insert_compositions;
		DROP TEMPORARY TABLE IF EXISTS temp_update_compositions;
		DROP TEMPORARY TABLE IF EXISTS temp_delete_compositions;
		CREATE TEMPORARY TABLE IF NOT EXISTS temp_insert_compositions
        SELECT * FROM compositions WHERE id = new.id;
    END IF;
END$$
DELIMITER ;
DROP TRIGGER IF EXISTS `pickcel`.`compositions_AFTER_UPDATE`;

DELIMITER $$
USE `pickcel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `pickcel`.`compositions_AFTER_UPDATE` AFTER UPDATE ON `compositions` FOR EACH ROW
BEGIN
	IF new.id IS NOT NULL THEN
		DROP TEMPORARY TABLE IF EXISTS temp_insert_compositions;
		DROP TEMPORARY TABLE IF EXISTS temp_update_compositions;
		DROP TEMPORARY TABLE IF EXISTS temp_delete_compositions;
		CREATE TEMPORARY TABLE IF NOT EXISTS temp_update_compositions
        SELECT * FROM compositions WHERE id = new.id;
    END IF;
END$$
DELIMITER ;
DROP TRIGGER IF EXISTS `pickcel`.`compositions_BEFORE_DELETE`;

DELIMITER $$
USE `pickcel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `pickcel`.`compositions_BEFORE_DELETE` BEFORE DELETE ON `compositions` FOR EACH ROW
BEGIN
	IF old.id IS NOT NULL THEN
		DROP TEMPORARY TABLE IF EXISTS temp_insert_compositions;
		DROP TEMPORARY TABLE IF EXISTS temp_update_compositions;
		DROP TEMPORARY TABLE IF EXISTS temp_delete_compositions;
		CREATE TEMPORARY TABLE IF NOT EXISTS temp_delete_compositions
        SELECT * FROM compositions WHERE id = old.id;
    END IF;
END$$
DELIMITER ;
-------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------

--------------------------------------------- displays ------------------------------------------------------
-------------------------------------------------------------------------------------------------------------
CREATE TABLE `pickcel`.`displays` (
  `id` CHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `schedule_id` CHAR(36),
  `online_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `network_status` BOOLEAN NOT NULL DEFAULT 0,
  `address` VARCHAR(255),
  `location` VARCHAR(255),
  `default_composition_id` VARCHAR(255) NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000',
  `network_speed` DECIMAL NOT NULL DEFAULT 0,
  `private_ip` VARCHAR(25) NOT NULL,
  `public_ip` VARCHAR(25) NOT NULL,
  `apk_version` SMALLINT,
  `sdk_version` SMALLINT,
  `javascript_version` SMALLINT NOT NULL DEFAULT 1,
  `storage` DECIMAL,
  `available_ram` DECIMAL,
  `brand` VARCHAR(255),
  `device` VARCHAR(255),
  `manufacturer` VARCHAR(255),
  `hardware` VARCHAR(255),
  `model` VARCHAR(255),
  `total_storage` DECIMAL,
  `total_ram` DECIMAL,
  `orientation` BOOLEAN NOT NULL DEFAULT true,
  `code` VARCHAR(10) NOT NULL,
  `user_id` CHAR(36) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `displays_code_UNIQUE` (`code` ASC));
DROP TRIGGER IF EXISTS `pickcel`.`displays_BEFORE_INSERT`;

DELIMITER $$
USE `pickcel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `pickcel`.`displays_BEFORE_INSERT` BEFORE INSERT ON `displays` FOR EACH ROW
BEGIN
	IF new.id IS NULL THEN
		SET new.id = uuid_v4();
	  END IF;
END$$
DELIMITER ;
DROP TRIGGER IF EXISTS `pickcel`.`displays_AFTER_INSERT`;

DELIMITER $$
USE `pickcel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `pickcel`.`displays_AFTER_INSERT` AFTER INSERT ON `displays` FOR EACH ROW
BEGIN
	IF new.id IS NOT NULL THEN
		DROP TEMPORARY TABLE IF EXISTS temp_insert_displays;
		DROP TEMPORARY TABLE IF EXISTS temp_update_displays;
		DROP TEMPORARY TABLE IF EXISTS temp_delete_displays;
		CREATE TEMPORARY TABLE IF NOT EXISTS temp_insert_displays
        SELECT * FROM displays WHERE id = new.id;
    END IF;
END$$
DELIMITER ;
DROP TRIGGER IF EXISTS `pickcel`.`displays_AFTER_UPDATE`;

DELIMITER $$
USE `pickcel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `pickcel`.`displays_AFTER_UPDATE` AFTER UPDATE ON `displays` FOR EACH ROW
BEGIN
	IF new.id IS NOT NULL THEN
		DROP TEMPORARY TABLE IF EXISTS temp_insert_displays;
		DROP TEMPORARY TABLE IF EXISTS temp_update_displays;
		DROP TEMPORARY TABLE IF EXISTS temp_delete_displays;
		CREATE TEMPORARY TABLE IF NOT EXISTS temp_update_displays
        SELECT * FROM displays WHERE id = new.id;
    END IF;
END$$
DELIMITER ;
DROP TRIGGER IF EXISTS `pickcel`.`displays_BEFORE_DELETE`;

DELIMITER $$
USE `pickcel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `pickcel`.`displays_BEFORE_DELETE` BEFORE DELETE ON `displays` FOR EACH ROW
BEGIN
	IF old.id IS NOT NULL THEN
		DROP TEMPORARY TABLE IF EXISTS temp_insert_displays;
		DROP TEMPORARY TABLE IF EXISTS temp_update_displays;
		DROP TEMPORARY TABLE IF EXISTS temp_delete_displays;
		CREATE TEMPORARY TABLE IF NOT EXISTS temp_delete_displays
        SELECT * FROM displays WHERE id = old.id;
    END IF;
END$$
DELIMITER ;
-------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------

--------------------------------------------- schedules -----------------------------------------------------
-------------------------------------------------------------------------------------------------------------
CREATE TABLE `pickcel`.`schedules` (
  `id` CHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `version` SMALLINT NOT NULL DEFAULT 1,
  `user_id` CHAR(36) NOT NULL,
  PRIMARY KEY (`id`));
DROP TRIGGER IF EXISTS `pickcel`.`displays_BEFORE_INSERT`;

DELIMITER $$
USE `pickcel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `pickcel`.`schedules_BEFORE_INSERT` BEFORE INSERT ON `schedules` FOR EACH ROW
BEGIN
	IF new.id IS NULL THEN
		SET new.id = uuid_v4();
	  END IF;
END$$
DELIMITER ;
DROP TRIGGER IF EXISTS `pickcel`.`schedules_AFTER_INSERT`;

DELIMITER $$
USE `pickcel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `pickcel`.`schedules_AFTER_INSERT` AFTER INSERT ON `schedules` FOR EACH ROW
BEGIN
	IF new.id IS NOT NULL THEN
		DROP TEMPORARY TABLE IF EXISTS temp_insert_schedules;
		DROP TEMPORARY TABLE IF EXISTS temp_update_schedules;
		DROP TEMPORARY TABLE IF EXISTS temp_delete_schedules;
		CREATE TEMPORARY TABLE IF NOT EXISTS temp_insert_schedules
        SELECT * FROM schedules WHERE id = new.id;
    END IF;
END$$
DELIMITER ;
DROP TRIGGER IF EXISTS `pickcel`.`schedules_AFTER_UPDATE`;

DELIMITER $$
USE `pickcel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `pickcel`.`schedules_AFTER_UPDATE` AFTER UPDATE ON `schedules` FOR EACH ROW
BEGIN
	IF new.id IS NOT NULL THEN
		DROP TEMPORARY TABLE IF EXISTS temp_insert_schedules;
		DROP TEMPORARY TABLE IF EXISTS temp_update_schedules;
		DROP TEMPORARY TABLE IF EXISTS temp_delete_schedules;
		CREATE TEMPORARY TABLE IF NOT EXISTS temp_update_schedules
        SELECT * FROM schedules WHERE id = new.id;
    END IF;
END$$
DELIMITER ;
DROP TRIGGER IF EXISTS `pickcel`.`schedules_BEFORE_DELETE`;

DELIMITER $$
USE `pickcel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `pickcel`.`schedules_BEFORE_DELETE` BEFORE DELETE ON `schedules` FOR EACH ROW
BEGIN
	IF old.id IS NOT NULL THEN
		DROP TEMPORARY TABLE IF EXISTS temp_insert_schedules;
		DROP TEMPORARY TABLE IF EXISTS temp_update_schedules;
		DROP TEMPORARY TABLE IF EXISTS temp_delete_schedules;
		CREATE TEMPORARY TABLE IF NOT EXISTS temp_delete_schedules
        SELECT * FROM schedules WHERE id = old.id;
    END IF;
END$$
DELIMITER ;
-------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------

--------------------------------------------- tags ----------------------------------------------------------
-------------------------------------------------------------------------------------------------------------
CREATE TABLE `pickcel`.`tags` (
  `id` CHAR(36) NOT NULL,
  `key` VARCHAR(255) NOT NULL,
  `value` VARCHAR(255) NOT NULL,
  `asset_id` CHAR(36) NOT NULL,
  PRIMARY KEY (`id`));
DROP TRIGGER IF EXISTS `pickcel`.`tags_BEFORE_INSERT`;

DELIMITER $$
USE `pickcel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `pickcel`.`tags_BEFORE_INSERT` BEFORE INSERT ON `tags` FOR EACH ROW
BEGIN
	IF new.id IS NULL THEN
		SET new.id = uuid_v4();
	  END IF;
END$$
DELIMITER ;
DROP TRIGGER IF EXISTS `pickcel`.`tags_AFTER_INSERT`;

DELIMITER $$
USE `pickcel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `pickcel`.`tags_AFTER_INSERT` AFTER INSERT ON `tags` FOR EACH ROW
BEGIN
	IF new.id IS NOT NULL THEN
		DROP TEMPORARY TABLE IF EXISTS temp_insert_tags;
		DROP TEMPORARY TABLE IF EXISTS temp_update_tags;
		DROP TEMPORARY TABLE IF EXISTS temp_delete_tags;
		CREATE TEMPORARY TABLE IF NOT EXISTS temp_insert_tags
        SELECT * FROM tags WHERE id = new.id;
    END IF;
END$$
DELIMITER ;
DROP TRIGGER IF EXISTS `pickcel`.`tags_AFTER_UPDATE`;

DELIMITER $$
USE `pickcel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `pickcel`.`tags_AFTER_UPDATE` AFTER UPDATE ON `tags` FOR EACH ROW
BEGIN
	IF new.id IS NOT NULL THEN
		DROP TEMPORARY TABLE IF EXISTS temp_insert_tags;
		DROP TEMPORARY TABLE IF EXISTS temp_update_tags;
		DROP TEMPORARY TABLE IF EXISTS temp_delete_tags;
		CREATE TEMPORARY TABLE IF NOT EXISTS temp_update_tags
        SELECT * FROM tags WHERE id = new.id;
    END IF;
END$$
DELIMITER ;
DROP TRIGGER IF EXISTS `pickcel`.`tags_BEFORE_DELETE`;

DELIMITER $$
USE `pickcel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `pickcel`.`tags_BEFORE_DELETE` BEFORE DELETE ON `tags` FOR EACH ROW
BEGIN
	IF old.id IS NOT NULL THEN
		DROP TEMPORARY TABLE IF EXISTS temp_insert_tags;
		DROP TEMPORARY TABLE IF EXISTS temp_update_tags;
		DROP TEMPORARY TABLE IF EXISTS temp_delete_tags;
		CREATE TEMPORARY TABLE IF NOT EXISTS temp_delete_tags
        SELECT * FROM tags WHERE id = old.id;
    END IF;
END$$
DELIMITER ;
-------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------

--------------------------------------------- templates -----------------------------------------------------
-------------------------------------------------------------------------------------------------------------
CREATE TABLE `pickcel`.`templates` (
  `id` CHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `orientation` BOOLEAN NOT NULL DEFAULT TRUE,
  `width` INTEGER NOT NULL DEFAULT 0,
  `height` INTEGER NOT NULL DEFAULT 0,
  `user_id` CHAR(36) NOT NULL,
  PRIMARY KEY (`id`));
DROP TRIGGER IF EXISTS `pickcel`.`templates_BEFORE_INSERT`;

DELIMITER $$
USE `pickcel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `pickcel`.`templates_BEFORE_INSERT` BEFORE INSERT ON `templates` FOR EACH ROW
BEGIN
	IF new.id IS NULL THEN
		SET new.id = uuid_v4();
	  END IF;
END$$
DELIMITER ;
DROP TRIGGER IF EXISTS `pickcel`.`templates_AFTER_INSERT`;

DELIMITER $$
USE `pickcel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `pickcel`.`templates_AFTER_INSERT` AFTER INSERT ON `templates` FOR EACH ROW
BEGIN
	IF new.id IS NOT NULL THEN
		DROP TEMPORARY TABLE IF EXISTS temp_insert_templates;
		DROP TEMPORARY TABLE IF EXISTS temp_update_templates;
		DROP TEMPORARY TABLE IF EXISTS temp_delete_templates;
		CREATE TEMPORARY TABLE IF NOT EXISTS temp_insert_templates
        SELECT * FROM templates WHERE id = new.id;
    END IF;
END$$
DELIMITER ;
DROP TRIGGER IF EXISTS `pickcel`.`templates_AFTER_UPDATE`;

DELIMITER $$
USE `pickcel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `pickcel`.`templates_AFTER_UPDATE` AFTER UPDATE ON `templates` FOR EACH ROW
BEGIN
	IF new.id IS NOT NULL THEN
		DROP TEMPORARY TABLE IF EXISTS temp_insert_templates;
		DROP TEMPORARY TABLE IF EXISTS temp_update_templates;
		DROP TEMPORARY TABLE IF EXISTS temp_delete_templates;
		CREATE TEMPORARY TABLE IF NOT EXISTS temp_update_templates
        SELECT * FROM templates WHERE id = new.id;
    END IF;
END$$
DELIMITER ;
DROP TRIGGER IF EXISTS `pickcel`.`templates_BEFORE_DELETE`;

DELIMITER $$
USE `pickcel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `pickcel`.`templates_BEFORE_DELETE` BEFORE DELETE ON `templates` FOR EACH ROW
BEGIN
	IF old.id IS NOT NULL THEN
		DROP TEMPORARY TABLE IF EXISTS temp_insert_templates;
		DROP TEMPORARY TABLE IF EXISTS temp_update_templates;
		DROP TEMPORARY TABLE IF EXISTS temp_delete_templates;
		CREATE TEMPORARY TABLE IF NOT EXISTS temp_delete_templates
        SELECT * FROM templates WHERE id = old.id;
    END IF;
END$$
DELIMITER ;
-------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------

--------------------------------------------- users ---------------------------------------------------------
-------------------------------------------------------------------------------------------------------------
CREATE TABLE `pickcel`.`users` (
  `id` CHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `verify` BOOLEAN NOT NULL DEFAULT FALSE,
  `company_name` VARCHAR(255),
  `country_code` VARCHAR(25),
  `phone_number` VARCHAR(255),
  PRIMARY KEY (`id`));
DROP TRIGGER IF EXISTS `pickcel`.`users_BEFORE_INSERT`;

DELIMITER $$
USE `pickcel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `pickcel`.`users_BEFORE_INSERT` BEFORE INSERT ON `users` FOR EACH ROW
BEGIN
	IF new.id IS NULL THEN
		SET new.id = uuid_v4();
	  END IF;
END$$
DELIMITER ;
DROP TRIGGER IF EXISTS `pickcel`.`users_AFTER_INSERT`;

DELIMITER $$
USE `pickcel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `pickcel`.`users_AFTER_INSERT` AFTER INSERT ON `users` FOR EACH ROW
BEGIN
	IF new.id IS NOT NULL THEN
		DROP TEMPORARY TABLE IF EXISTS temp_insert_users;
		DROP TEMPORARY TABLE IF EXISTS temp_update_users;
		DROP TEMPORARY TABLE IF EXISTS temp_delete_users;
		CREATE TEMPORARY TABLE IF NOT EXISTS temp_insert_users
        SELECT * FROM users WHERE id = new.id;
    END IF;
END$$
DELIMITER ;
DROP TRIGGER IF EXISTS `pickcel`.`users_AFTER_UPDATE`;

DELIMITER $$
USE `pickcel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `pickcel`.`users_AFTER_UPDATE` AFTER UPDATE ON `users` FOR EACH ROW
BEGIN
	IF new.id IS NOT NULL THEN
		DROP TEMPORARY TABLE IF EXISTS temp_insert_users;
		DROP TEMPORARY TABLE IF EXISTS temp_update_users;
		DROP TEMPORARY TABLE IF EXISTS temp_delete_users;
		CREATE TEMPORARY TABLE IF NOT EXISTS temp_update_users
        SELECT * FROM users WHERE id = new.id;
    END IF;
END$$
DELIMITER ;
DROP TRIGGER IF EXISTS `pickcel`.`users_BEFORE_DELETE`;

DELIMITER $$
USE `pickcel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `pickcel`.`users_BEFORE_DELETE` BEFORE DELETE ON `users` FOR EACH ROW
BEGIN
	IF old.id IS NOT NULL THEN
		DROP TEMPORARY TABLE IF EXISTS temp_insert_users;
		DROP TEMPORARY TABLE IF EXISTS temp_update_users;
		DROP TEMPORARY TABLE IF EXISTS temp_delete_users;
		CREATE TEMPORARY TABLE IF NOT EXISTS temp_delete_users
        SELECT * FROM users WHERE id = old.id;
    END IF;
END$$
DELIMITER ;
-------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------

--------------------------------------------- zone_assets ---------------------------------------------------
-------------------------------------------------------------------------------------------------------------
CREATE TABLE `pickcel`.`zone_assets` (
  `id` CHAR(36) NOT NULL,
  `zone_id` CHAR(36) NOT NULL,
  `asset_id` CHAR(36) NOT NULL,
  `duration` INTEGER NOT NULL DEFAULT 10,
  `z_index` INTEGER NOT NULL,
  `composition_id` CHAR(36),
  PRIMARY KEY (`id`));
DROP TRIGGER IF EXISTS `pickcel`.`zone_assets_BEFORE_INSERT`;

DELIMITER $$
USE `pickcel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `pickcel`.`zone_assets_BEFORE_INSERT` BEFORE INSERT ON `zone_assets` FOR EACH ROW
BEGIN
	IF new.id IS NULL THEN
		SET new.id = uuid_v4();
	  END IF;
END$$
DELIMITER ;
DROP TRIGGER IF EXISTS `pickcel`.`zone_assets_AFTER_INSERT`;

DELIMITER $$
USE `pickcel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `pickcel`.`zone_assets_AFTER_INSERT` AFTER INSERT ON `zone_assets` FOR EACH ROW
BEGIN
	IF new.id IS NOT NULL THEN
		DROP TEMPORARY TABLE IF EXISTS temp_insert_zone_assets;
		DROP TEMPORARY TABLE IF EXISTS temp_update_zone_assets;
		DROP TEMPORARY TABLE IF EXISTS temp_delete_zone_assets;
		CREATE TEMPORARY TABLE IF NOT EXISTS temp_insert_zone_assets
        SELECT * FROM zone_assets WHERE id = new.id;
    END IF;
END$$
DELIMITER ;
DROP TRIGGER IF EXISTS `pickcel`.`zone_assets_AFTER_UPDATE`;

DELIMITER $$
USE `pickcel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `pickcel`.`zone_assets_AFTER_UPDATE` AFTER UPDATE ON `zone_assets` FOR EACH ROW
BEGIN
	IF new.id IS NOT NULL THEN
		DROP TEMPORARY TABLE IF EXISTS temp_insert_zone_assets;
		DROP TEMPORARY TABLE IF EXISTS temp_update_zone_assets;
		DROP TEMPORARY TABLE IF EXISTS temp_delete_zone_assets;
		CREATE TEMPORARY TABLE IF NOT EXISTS temp_update_zone_assets
        SELECT * FROM zone_assets WHERE id = new.id;
    END IF;
END$$
DELIMITER ;
DROP TRIGGER IF EXISTS `pickcel`.`zone_assets_BEFORE_DELETE`;

DELIMITER $$
USE `pickcel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `pickcel`.`zone_assets_BEFORE_DELETE` BEFORE DELETE ON `zone_assets` FOR EACH ROW
BEGIN
	IF old.id IS NOT NULL THEN
		DROP TEMPORARY TABLE IF EXISTS temp_insert_zone_assets;
		DROP TEMPORARY TABLE IF EXISTS temp_update_zone_assets;
		DROP TEMPORARY TABLE IF EXISTS temp_delete_zone_assets;
		CREATE TEMPORARY TABLE IF NOT EXISTS temp_delete_zone_assets
        SELECT * FROM zone_assets WHERE id = old.id;
    END IF;
END$$
DELIMITER ;
-------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------

--------------------------------------------- zones ---------------------------------------------------------
-------------------------------------------------------------------------------------------------------------
CREATE TABLE `pickcel`.`zones` (
  `id` CHAR(36) NOT NULL,
  `template_id` CHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `top` DECIMAL NOT NULL DEFAULT 0,
  `left` DECIMAL NOT NULL DEFAULT 0,
  `width` DECIMAL NOT NULL DEFAULT 160,
  `height` DECIMAL NOT NULL DEFAULT 90,
  `z_index` INTEGER NOT NULL,
  PRIMARY KEY (`id`));
DROP TRIGGER IF EXISTS `pickcel`.`zones_BEFORE_INSERT`;

DELIMITER $$
USE `pickcel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `pickcel`.`zones_BEFORE_INSERT` BEFORE INSERT ON `zones` FOR EACH ROW
BEGIN
	IF new.id IS NULL THEN
		SET new.id = uuid_v4();
	  END IF;
END$$
DELIMITER ;
DROP TRIGGER IF EXISTS `pickcel`.`zones_AFTER_INSERT`;

DELIMITER $$
USE `pickcel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `pickcel`.`zones_AFTER_INSERT` AFTER INSERT ON `zones` FOR EACH ROW
BEGIN
	IF new.id IS NOT NULL THEN
		DROP TEMPORARY TABLE IF EXISTS temp_insert_zones;
		DROP TEMPORARY TABLE IF EXISTS temp_update_zones;
		DROP TEMPORARY TABLE IF EXISTS temp_delete_zones;
		CREATE TEMPORARY TABLE IF NOT EXISTS temp_insert_zones
        SELECT * FROM zones WHERE id = new.id;
    END IF;
END$$
DELIMITER ;
DROP TRIGGER IF EXISTS `pickcel`.`zones_AFTER_UPDATE`;

DELIMITER $$
USE `pickcel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `pickcel`.`zones_AFTER_UPDATE` AFTER UPDATE ON `zones` FOR EACH ROW
BEGIN
	IF new.id IS NOT NULL THEN
		DROP TEMPORARY TABLE IF EXISTS temp_insert_zones;
		DROP TEMPORARY TABLE IF EXISTS temp_update_zones;
		DROP TEMPORARY TABLE IF EXISTS temp_delete_zones;
		CREATE TEMPORARY TABLE IF NOT EXISTS temp_update_zones
        SELECT * FROM zones WHERE id = new.id;
    END IF;
END$$
DELIMITER ;
DROP TRIGGER IF EXISTS `pickcel`.`zones_BEFORE_DELETE`;

DELIMITER $$
USE `pickcel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `pickcel`.`zones_BEFORE_DELETE` BEFORE DELETE ON `zones` FOR EACH ROW
BEGIN
	IF old.id IS NOT NULL THEN
		DROP TEMPORARY TABLE IF EXISTS temp_insert_zones;
		DROP TEMPORARY TABLE IF EXISTS temp_update_zones;
		DROP TEMPORARY TABLE IF EXISTS temp_delete_zones;
		CREATE TEMPORARY TABLE IF NOT EXISTS temp_delete_zones
        SELECT * FROM zones WHERE id = old.id;
    END IF;
END$$
DELIMITER ;
-------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------

--------------------------------------------- apps ----------------------------------------------------------
-------------------------------------------------------------------------------------------------------------
CREATE TABLE `pickcel`.`apps` (
  `id` CHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `modified_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `content` TEXT,
  `user_id` CHAR(36) NOT NULL,
  PRIMARY KEY (`id`));
DROP TRIGGER IF EXISTS `pickcel`.`apps_BEFORE_INSERT`;

DELIMITER $$
USE `pickcel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `pickcel`.`apps_BEFORE_INSERT` BEFORE INSERT ON `apps` FOR EACH ROW
BEGIN
	IF new.id IS NULL THEN
		SET new.id = uuid_v4();
	  END IF;
END$$
DELIMITER ;
DROP TRIGGER IF EXISTS `pickcel`.`apps_AFTER_INSERT`;

DELIMITER $$
USE `pickcel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `pickcel`.`apps_AFTER_INSERT` AFTER INSERT ON `apps` FOR EACH ROW
BEGIN
	IF new.id IS NOT NULL THEN
		DROP TEMPORARY TABLE IF EXISTS temp_insert_apps;
		DROP TEMPORARY TABLE IF EXISTS temp_update_apps;
		DROP TEMPORARY TABLE IF EXISTS temp_delete_apps;
		CREATE TEMPORARY TABLE IF NOT EXISTS temp_insert_apps
        SELECT * FROM apps WHERE id = new.id;
    END IF;
END$$
DELIMITER ;
DROP TRIGGER IF EXISTS `pickcel`.`apps_AFTER_UPDATE`;

DELIMITER $$
USE `pickcel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `pickcel`.`apps_AFTER_UPDATE` AFTER UPDATE ON `apps` FOR EACH ROW
BEGIN
	IF new.id IS NOT NULL THEN
		DROP TEMPORARY TABLE IF EXISTS temp_insert_apps;
		DROP TEMPORARY TABLE IF EXISTS temp_update_apps;
		DROP TEMPORARY TABLE IF EXISTS temp_delete_apps;
		CREATE TEMPORARY TABLE IF NOT EXISTS temp_update_apps
        SELECT * FROM apps WHERE id = new.id;
    END IF;
END$$
DELIMITER ;
DROP TRIGGER IF EXISTS `pickcel`.`apps_BEFORE_DELETE`;

DELIMITER $$
USE `pickcel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `pickcel`.`apps_BEFORE_DELETE` BEFORE DELETE ON `apps` FOR EACH ROW
BEGIN
	IF old.id IS NOT NULL THEN
		DROP TEMPORARY TABLE IF EXISTS temp_insert_apps;
		DROP TEMPORARY TABLE IF EXISTS temp_update_apps;
		DROP TEMPORARY TABLE IF EXISTS temp_delete_apps;
		CREATE TEMPORARY TABLE IF NOT EXISTS temp_delete_apps
        SELECT * FROM apps WHERE id = old.id;
    END IF;
END$$
DELIMITER ;
-------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------


---- Pre-defined templates
use pickcel;

INSERT INTO templates(`name`, orientation, width, height, user_id) VALUES ('Three Zone', true, 16, 9, null);
INSERT INTO zones(template_id, `name`, top, `left`, width, height, z_index) VALUES ((SELECT id from temp_insert_templates), 'Zone 1', 0, 0, 67.5, 75, 3);
INSERT INTO zones(template_id, `name`, top, `left`, width, height, z_index) VALUES ((SELECT id from temp_insert_templates), 'Zone 2', 0, 67.5, 32.5, 75, 2);
INSERT INTO zones(template_id, `name`, top, `left`, width, height, z_index) VALUES ((SELECT id from temp_insert_templates), 'Zone 3', 75, 0, 100, 25, 1);

INSERT INTO templates(`name`, orientation, width, height, user_id) VALUES ('Two Zone', false, 9, 16, null);
INSERT INTO zones(template_id, `name`, top, `left`, width, height, z_index) VALUES ((SELECT id from temp_insert_templates), 'Zone 1', 0, 0, 100, 75, 2);
INSERT INTO zones(template_id, `name`, top, `left`, width, height, z_index) VALUES ((SELECT id from temp_insert_templates), 'Zone 2', 75, 0, 100, 25, 1);

INSERT INTO templates(`name`, orientation, width, height, user_id) VALUES ('Two Zone', true, 16, 9, null);
INSERT INTO zones(template_id, `name`, top, `left`, width, height, z_index) VALUES ((SELECT id FROM temp_insert_templates), 'Zone 1', 0, 0, 100, 85, 2);
INSERT INTO zones(template_id, `name`, top, `left`, width, height, z_index) VALUES ((SELECT id FROM temp_insert_templates), 'Zone 2', 85, 0, 100, 15, 1);

INSERT INTO templates(`name`, orientation, width, height, user_id) VALUES ('Two Zone', false, 9, 16, null);
INSERT INTO zones(template_id, `name`, top, `left`, width, height, z_index) VALUES ((SELECT id FROM temp_insert_templates), 'Zone 1', 0, 0, 100, 50, 2);
INSERT INTO zones(template_id, `name`, top, `left`, width, height, z_index) VALUES ((SELECT id FROM temp_insert_templates), 'Zone 2', 50, 0, 100, 50, 1);

INSERT INTO templates(`name`, orientation, width, height, user_id) VALUES ('Two Zone', true, 16, 9, null);
INSERT INTO zones(template_id, `name`, top, `left`, width, height, z_index) VALUES ((SELECT id FROM temp_insert_templates), 'Zone 1', 0, 0, 50, 100, 2);
INSERT INTO zones(template_id, `name`, top, `left`, width, height, z_index) VALUES ((SELECT id FROM temp_insert_templates), 'Zone 2', 0, 50, 50, 100, 1);

INSERT INTO templates(`name`, orientation, width, height, user_id) VALUES ('Fullscreen', false, 9, 16, null);
INSERT INTO zones(template_id, `name`, top, `left`, width, height, z_index) VALUES ((SELECT id FROM temp_insert_templates), 'Zone 1', 0, 0, 100, 100, 1);

INSERT INTO templates(`name`, orientation, width, height, user_id) VALUES ('Fullscreen', true, 16, 9, null);
INSERT INTO zones(template_id, `name`, top, `left`, width, height, z_index) VALUES ((SELECT id FROM temp_insert_templates), 'Zone 1', 0, 0, 100, 100, 1);

-- Default composition with default template
INSERT INTO assets(id, name, type, size, dimension, content, user_id) VALUES('00000000-0000-0000-0000-000000000000', 'Default Template Image', 0, 11.11, '1470*813', 'https://d2juedknhp61ae.cloudfront.net/57b598e787895d651b5477cd/5b6bf2666d0469232a87bd9a.jpeg', '00000000-0000-0000-0000-000000000000');
INSERT INTO zone_assets(id, zone_id, asset_id, duration, z_index, composition_id) VALUES ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', 10, 1, '00000000-0000-0000-0000-000000000000');
INSERT INTO templates(id, name, orientation, width, height, user_id) VALUES ('00000000-0000-0000-0000-000000000000', 'Default Template', true, 16, 9, '00000000-0000-0000-0000-000000000000');
INSERT INTO zones(id, template_id, name, top, `left`, width, height, z_index) VALUES('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', 'Zone 1', 0, 0, 100, 100, 1);
INSERT INTO compositions(id, name, created_at, version, duration, modified_at, template_id, user_id) VALUES ('00000000-0000-0000-0000-000000000000', 'Default Composition', current_timestamp, 1, 10, current_timestamp, '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000');