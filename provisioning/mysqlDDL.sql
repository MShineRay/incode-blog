DROP DATABASE IF EXISTS imgcat;
CREATE DATABASE imgcat;

use imgcat;

-- FIXME: allow connections from other hosts
GRANT USAGE ON imgcat.* TO 'imgcat'@'%' IDENTIFIED BY 'password';
DROP USER 'imgcat'@'%';

GRANT ALL ON imgcat.* TO 'imgcat'@'%' IDENTIFIED BY 'img302cat';

-- SET GLOBAL time_zone = '+00:00';

SET SESSION time_zone = '+00:00';

--
-- Table structure for user
--


DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `user_uuid` bigint(20) NOT NULL,
  `username` varchar(64) DEFAULT NULL,
  `email` varchar(256) DEFAULT NULL,
  `display_name` varchar(128) DEFAULT NULL,
  `facebook_id` char(20) DEFAULT NULL,
  `icloud_credential` varchar(256) DEFAULT NULL,
  `password_salt` char(32) DEFAULT NULL,
  `pbkdf2_hash` char(32) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `wants_status_email` bit(1) DEFAULT NULL,
  `deleted` bit(1) DEFAULT NULL,
  PRIMARY KEY (`user_uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

insert into user (user_uuid, username, email, display_name) 
       values (1, 'admin', 'bill@blnz.com', 'Administrator');

DROP TABLE IF EXISTS `load_status`;
CREATE TABLE `load_status` (
  `load_status_id` varchar(32) NOT NULL DEFAULT '',
  `description` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`load_status_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

insert into load_status values ('identified', '');
insert into load_status values ('uploaded', '');
insert into load_status values ('duplicate', '');
insert into load_status values ('thumbnailed', '');
insert into load_status values ('fingerprinted', '');
insert into load_status values ('categorized-watson', '');
insert into load_status values ('categorized-faces', '');
insert into load_status values ('categorized-topics', '');
insert into load_status values ('indexed', '');
insert into load_status values ('failed', '');

--
-- Table structure for table `upload_source`
--

DROP TABLE IF EXISTS `upload_source`;

CREATE TABLE `upload_source` (
  `upload_source_id` varchar(32) NOT NULL DEFAULT '',
  `description` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`upload_source_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

insert into upload_source values ('local', '');
insert into upload_source values ('web', '');
insert into upload_source values ('facebook', '');
insert into upload_source values ('icloud', '');

DROP TABLE IF EXISTS `image`;
CREATE TABLE `image` (
  `image_uuid` bigint(20) NOT NULL,
  `owner_uuid` bigint(20) NOT NULL DEFAULT 1,
  `image_name` varchar(256) DEFAULT NULL,
  `mimetype` varchar(64) DEFAULT NULL,
  `upload_source_id` varchar(32) DEFAULT NULL,
  `source_locater` varchar(256) DEFAULT NULL,
  `load_status` varchar(32) DEFAULT NULL,
  `failure_reason` varchar(256) DEFAULT NULL,
  `original_path` varchar(256) DEFAULT NULL,
  `original_width` int(11) DEFAULT NULL,
  `original_height` int(11) DEFAULT NULL,
  `original_filesize` int(11) DEFAULT NULL,
  `thumb_path` varchar(256) DEFAULT NULL,
  `thumb_width` int(11) DEFAULT NULL,
  `thumb_height` int(11) DEFAULT NULL,
  `fingerprint` varchar(1024) DEFAULT NULL,
  `metadata` text,
  `loaded_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`image_uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
ALTER TABLE image add unique (source_locater);

insert into image values (
    uuid_short() MOD 100000000000,
    1,              -- owner
    'test_image',   -- name
    'image/jpg',
    'web',
    'https://s3-us-west-2.amazonaws.com/imgcat-dev/DSC_0055.JPG',
    'identified',
    null,       -- failure reason
    null,       -- original path
    null,       -- original_width
    null,
    null,       -- original_filesize
    null,       -- thumb_path
    null,
    null,       -- thumb_height
    null,       -- fingerprint
    null,       -- metadata
    null,       -- loaded_at
    null,
    null);

insert into image values (
    uuid_short() MOD 100000000000,
    1,              -- owner
    'proxy7987',   -- name
    'image/jpg',
    'web',
    'https://s3-us-west-2.amazonaws.com/imgcat-dev/samples/proxy7987.jpg',
    'identified',
    null,       -- failure reason
    null,       -- original path
    null,       -- original_width
    null,
    null,       -- original_filesize
    null,       -- thumb_path
    null,
    null,       -- thumb_height
    null,       -- fingerprint
    null,       -- metadata
    null,       -- loaded_at
    null,
    null);

insert into image values (
    uuid_short() MOD 100000000000,
    1,              -- owner
    '514548138.0.jpg',   -- name
    'image/jpg',
    'web',
    'https://s3-us-west-2.amazonaws.com/imgcat-dev/samples/514548138.0.jpg',
    'identified',
    null,       -- failure reason
    null,       -- original path
    null,       -- original_width
    null,
    null,       -- original_filesize
    null,       -- thumb_path
    null,
    null,       -- thumb_height
    null,       -- fingerprint
    null,       -- metadata
    null,       -- loaded_at
    null,
    null);

insert into image values (
    uuid_short() MOD 100000000000,
    1,              -- owner
    'CinvQlJUgAAF0PI.jpg',   -- name
    'image/jpg',
    'web',
    'https://s3-us-west-2.amazonaws.com/imgcat-dev/samples/CinvQlJUgAAF0PI.jpg',
    'identified',
    null,       -- failure reason
    null,       -- original path
    null,       -- original_width
    null,
    null,       -- original_filesize
    null,       -- thumb_path
    null,
    null,       -- thumb_height
    null,       -- fingerprint
    null,       -- metadata
    null,       -- loaded_at
    null,
    null);

insert into image values (
    uuid_short() MOD 100000000000,
    1,              -- owner
    'CinwOshXIAAoG6C.jpg',   -- name
    'image/jpg',
    'web',
    'https://s3-us-west-2.amazonaws.com/imgcat-dev/samples/CinwOshXIAAoG6C.jpg',
    'identified',
    null,       -- failure reason
    null,       -- original path
    null,       -- original_width
    null,
    null,       -- original_filesize
    null,       -- thumb_path
    null,
    null,       -- thumb_height
    null,       -- fingerprint
    null,       -- metadata
    null,       -- loaded_at
    null,
    null);

insert into image values (
    uuid_short() MOD 100000000000,
    1,              -- owner
    'CipPyvIU4AInASw.jpg',   -- name
    'image/jpg',
    'web',
    'https://s3-us-west-2.amazonaws.com/imgcat-dev/samples/CipPyvIU4AInASw.jpg',
    'identified',
    null,       -- failure reason
    null,       -- original path
    null,       -- original_width
    null,
    null,       -- original_filesize
    null,       -- thumb_path
    null,
    null,       -- thumb_height
    null,       -- fingerprint
    null,       -- metadata
    null,       -- loaded_at
    null,
    null);

insert into image values (
    uuid_short() MOD 100000000000,
    1,              -- owner
    'CiwY5Q2XEAElDI7.jpg',   -- name
    'image/jpg',
    'web',
    'https://s3-us-west-2.amazonaws.com/imgcat-dev/samples/CiwY5Q2XEAElDI7.jpg',
    'identified',
    null,       -- failure reason
    null,       -- original path
    null,       -- original_width
    null,
    null,       -- original_filesize
    null,       -- thumb_path
    null,
    null,       -- thumb_height
    null,       -- fingerprint
    null,       -- metadata
    null,       -- loaded_at
    null,
    null);

insert into image values (
    uuid_short() MOD 100000000000,
    1,              -- owner
    'CiwZDpkXIAAHyxv.jpg',   -- name
    'image/jpg',
    'web',
    'https://s3-us-west-2.amazonaws.com/imgcat-dev/samples/CiwZDpkXIAAHyxv.jpg',
    'identified',
    null,       -- failure reason
    null,       -- original path
    null,       -- original_width
    null,
    null,       -- original_filesize
    null,       -- thumb_path
    null,
    null,       -- thumb_height
    null,       -- fingerprint
    null,       -- metadata
    null,       -- loaded_at
    null,
    null);


--
-- Table fingerprint words -- record image identification fingerprint
--
create table fingerprint_word (
   image_uuid bigint(20) NOT NULL,
   fp_word_position int not null,
   fp_word char(10) not null,
     PRIMARY KEY (`image_uuid`, fp_word_position, fp_word)
)  ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER  TABLE fingerprint_word add index words (fp_word_position, fp_word);

create table image_action (
   image_uuid bigint(20) NOT NULL,
   load_action varchar(32) NOT NULL,
   completed_at datetime

)  ENGINE=InnoDB DEFAULT CHARSET=latin1;
