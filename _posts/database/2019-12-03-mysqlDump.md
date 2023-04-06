---
layout: post
title:  "MySqlDump 使用"
crawlertitle: "MySqlDump 使用"
subtitle: "MySqlDump Mysql"
ext: ""
date:  2019-12-03
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['DATABASE', '原创']
musicUri: 96087
musicTitle: 爱情诺曼底
musicFrom: 黄征
author: gomyck
openPay: true
---

Mysql 数据泵的使用方法方式说明

<style>
  table  th:nth-of-type(1) {width: 30%;text-align: center}
  table  th:nth-of-type(2) {width: 70%;text-align: center}
  table  td:nth-of-type(1) {width: 30%;text-align: left;font-size:7px}
  table  td:nth-of-type(2) {width: 70%;text-align: left;font-size:8px}
</style>

### mysqldump 简介

> The mysqldump client utility performs logical backups, producing a set of SQL statements that can be executed to reproduce the original database object definitions and table data. It dumps one or more MySQL databases for backup or transfer to another SQL server. The mysqldump command can also generate output in CSV, other delimited text, or XML format.

> mysqldump 在备份对应表和对应视图\|触发器的时候, 需要对应的权限

#### 最常用的导出语句:

```bash
$ mysqldump -h192.168.x.x -uroot -p123123 db_name [table_name1, table_name2] > gomyck.sql

```

**Some mysqldump options are shorthand for groups of other options:**
> Use of --opt is the same as specifying --add-drop-table, --add-locks, --create-options, --disable-keys, --extended-insert, --lock-tables, --quick, and --set-charset. All of the options that --opt stands for also are on by default because --opt is on by default.

> Use of --compact is the same as specifying --skip-add-drop-table, --skip-add-locks, --skip-comments, --skip-disable-keys, and --skip-set-charset options.

简单翻译: 使用 --opt --compact 可以代表一些选项默认开启, 不需要在额外的声明

#### sql 还原

```bash

# A common use of mysqldump is for making a backup of an entire database
$ mysqldump db_name > backup-file.sql

# You can load the dump file back into the server like this:
$ mysql db_name < backup-file.sql

# Or like this:
$ mysql -e "source /path-to-backup/backup-file.sql" db_name

```

#### Table 4.13 mysqldump Options

option|describe
---|---
--add-drop-database|Add DROP DATABASE statement before each CREATE DATABASE statement
--add-drop-table|Add DROP TABLE statement before each CREATE TABLE statement
--add-locks|Surround each table dump with LOCK TABLES and UNLOCK TABLES statements
--all-databases|Dump all tables in all databases
--allow-keywords|Allow creation of column names that are keywords
--apply-slave-statements|Include STOP SLAVE prior to CHANGE MASTER statement and START SLAVE at end of output
--bind-address|Use specified network interface to connect to MySQL Server
--character-sets-dir|Directory where character sets are installed
--comments|Add comments to dump file
--compact|Produce more compact output
--compatible|Produce output that is more compatible with other database systems or with older MySQL servers
--complete-insert|Use complete INSERT statements that include column names
--compress|Compress all information sent between client and server
--create-options|Include all MySQL-specific table options in CREATE TABLE statements
--databases|Interpret all name arguments as database names
--debug|Write debugging log
--debug-check|Print debugging information when program exits
--debug-info|Print debugging information, memory, and CPU statistics when program exits
--default-auth|Authentication plugin to use
--default-character-set|Specify default character set
--defaults-extra-file|Read named option file in addition to usual option files
--defaults-file|Read only named option file
--defaults-group-suffix|Option group suffix value
--delayed-insert|Write INSERT DELAYED statements rather than INSERT statements
--delete-master-logs|On a master replication server, delete the binary logs after performing the dump operation
--disable-keys|For each table, surround INSERT statements with statements to disable and enable keys
--dump-date|Include dump date as "Dump completed on" comment if --comments is given
--dump-slave|Include CHANGE MASTER statement that lists binary log coordinates of slave's master
--enable-cleartext-plugin|Enable cleartext authentication plugin
--events|Dump events from dumped databases
--extended-insert|Use multiple-row INSERT syntax
--fields-enclosed-by|This option is used with the --tab option and has the same meaning as the corresponding clause for LOAD DATA
--fields-escaped-by|This option is used with the --tab option and has the same meaning as the corresponding clause for LOAD DATA
--fields-optionally-enclosed-by|This option is used with the --tab option and has the same meaning as the corresponding clause for LOAD DATA
--fields-terminated-by|This option is used with the --tab option and has the same meaning as the corresponding clause for LOAD DATA
--first-slave|Deprecated; use --lock-all-tables instead
--flush-logs|Flush MySQL server log files before starting dump
--flush-privileges|Emit a FLUSH PRIVILEGES statement after dumping mysql database
--force|Continue even if an SQL error occurs during a table dump
--help|Display help message and exit
--hex-blob|Dump binary columns using hexadecimal notation
--host|Host on which MySQL server is located
--ignore-table|Do not dump given table
--include-master-host-port|Include MASTER_HOST/MASTER_PORT options in CHANGE MASTER statement produced with --dump-slave	5.5.3
--insert-ignore|Write INSERT IGNORE rather than INSERT statements
--lines-terminated-by|This option is used with the --tab option and has the same meaning as the corresponding clause for LOAD DATA
--lock-all-tables|Lock all tables across all databases
--lock-tables|Lock all tables before dumping them
--log-error|Append warnings and errors to named file
--master-data|Write the binary log file name and position to the output
--max-allowed-packet|Maximum packet length to send to or receive from server
--net-buffer-length|Buffer size for TCP/IP and socket communication
--no-autocommit|Enclose the INSERT statements for each dumped table within SET autocommit = 0 and COMMIT statements
--no-create-db|Do not write CREATE DATABASE statements
--no-create-info|Do not write CREATE TABLE statements that re-create each dumped table
--no-data|Do not dump table contents
--no-defaults|Read no option files
--no-set-names|Same as --skip-set-charset
--no-tablespaces|Do not write any CREATE LOGFILE GROUP or CREATE TABLESPACE statements in output
--opt|Shorthand for --add-drop-table --add-locks --create-options --disable-keys --extended-insert --lock-tables --quick --set-charset.
--order-by-primary|Dump each table's rows sorted by its primary key, or by its first unique index
--password|Password to use when connecting to server
--pipe|Connect to server using named pipe (Windows only)
--plugin-dir|Directory where plugins are installed
--port|TCP/IP port number for connection
--print-defaults|Print default options
--protocol|Connection protocol to use
--quick|Retrieve rows for a table from the server a row at a time
--quote-names|Quote identifiers within backtick characters
--replace|Write REPLACE statements rather than INSERT statements
--result-file|Direct output to a given file
--routines|Dump stored routines (procedures and functions) from dumped databases
--set-charset|Add SET NAMES default_character_set to output
--shared-memory-base-name|Name of shared memory to use for shared-memory connections
--single-transaction|Issue a BEGIN SQL statement before dumping data from server
--skip-add-drop-table|Do not add a DROP TABLE statement before each CREATE TABLE statement
--skip-add-locks|	Do not add locks
--skip-comments|	Do not add comments to dump file
--skip-compact|	Do not produce more compact output
--skip-disable-keys|	Do not disable keys
--skip-extended-insert|	Turn off extended-insert
--skip-opt|	Turn off options set by --opt
--skip-quick|	Do not retrieve rows for a table from the server a row at a time
--skip-quote-names|	Do not quote identifiers
--skip-set-charset|	Do not write SET NAMES statement
--skip-triggers|	Do not dump triggers
--skip-tz-utc|	Turn off tz-utc
--socket|	Unix socket file or Windows named pipe to use
--ssl|	Enable connection encryption
--ssl-ca|	File that contains list of trusted SSL Certificate Authorities
--ssl-capath|	Directory that contains trusted SSL Certificate Authority certificate files
--ssl-cert|	File that contains X.509 certificate
--ssl-cipher|	Permissible ciphers for connection encryption
--ssl-key|	File that contains X.509 key
--ssl-mode|	Desired security state of connection to server	5.5.49
--ssl-verify-server-cert|	Verify host name against server certificate Common Name identity
--tab|	Produce tab-separated data files
--tables|	Override --databases or -B option
--triggers|	Dump triggers for each dumped table
--tz-utc|	Add SET TIME_ZONE='+00:00' to dump file
--user|	MySQL user name to use when connecting to server
--verbose|	Verbose mode
--version|	Display version information and exit
--where|	Dump only rows selected by given WHERE condition
--xml|	Produce XML output
