DROP TABLE `vuln`;

CREATE TABLE `vuln`
(
    `vuln_id`    INTEGER(8) NOT NULL
 COMMENT '취약점순번',
    `vuln_type`    VARCHAR(255) NOT NULL
 COMMENT '취약점유형',
    `project_id`    INTEGER(8) NOT NULL
 COMMENT '프로젝트순번',
    `vuln_url`    VARCHAR(255) NOT NULL
 COMMENT '취약점대상',
    `vuln_comment`    VARCHAR(2048) NOT NULL
 COMMENT '상세내용',
    `vuln_poc`    VARCHAR(2048) NOT NULL
 COMMENT '공격코드',
    `vuln_informer`    VARCHAR(48) NOT NULL
 COMMENT '제보자',
    `vuln_date`    DATETIME NOT NULL
 COMMENT '날짜'
)
 COMMENT = '취약점';

ALTER TABLE `vuln`
 ADD CONSTRAINT `vul_pk` PRIMARY KEY ( `vuln_id` );

SELECT 
    vuln_id,
    vuln_type,
    project_id,
    vuln_url,
    vuln_comment,
    vuln_poc,
    vuln_informer,
    vuln_date
FROM vuln;

DROP TABLE `project`;

CREATE TABLE `project`
(
    `project_id`    INTEGER(8) NOT NULL
 COMMENT '프로젝트순번',
    `project_name`    VARCHAR(255) NOT NULL
 COMMENT '프로젝트명'
)
 COMMENT = '프로젝트';

ALTER TABLE `project`
 ADD CONSTRAINT `project_pk` PRIMARY KEY ( `project_id` );

SELECT 
    project_id,
    project_name
FROM project;