package com.hancomee.web.domain;

import java.util.Date;

/*
 'CREATE TABLE `secret_gallery` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `user` varchar(255) NOT NULL,
  `datetime` datetime DEFAULT NULL,
  `updateTime` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `favorite` bit(1) NOT NULL DEFAULT b''0'',
  `rotate` smallint(6) NOT NULL DEFAULT 0,
  `blind` tinyint(1) NOT NULL DEFAULT 0,
  `path` varchar(255) NOT NULL,
  `filename` varchar(255) NOT NULL,
  `filetype` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8'

 */
public class MediaFile {

    private long id;
    private String title;
    private String user;
    private Date datetime;
    private Date upadteTime;
    private int favorite;
    private int rotate;
    private boolean blind;
    private String path;
    private String filename;
    private String filetype;

}
