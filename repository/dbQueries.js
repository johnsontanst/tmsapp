//INIT
var create_user_table_query = "CREATE TABLE IF NOT EXISTS accounts (id INT(11) PRIMARY KEY AUTO_INCREMENT, username VARCHAR(50) NOT NULL, password VARCHAR(255) NOT NULL, email VARCHAR(100) NOT NULL);"

var alter_user_table_query = "ALTER TABLE accounts MODIFY int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2"

var create_group_table_query = "CREATE TABLE IF NOT EXISTS accGroups (id INT PRIMARY KEY AUTO_INCREMENT, groupName VARCHAR(255) NOT NULL, createAt DATETIME);"

var create_accountGroupRelation_table_query = "CREATE TABLE IF NOT EXISTS accountGroupRelation (accountId INT NOT NULL, accGroupId INT NOT NULL, FOREIGN KEY (accountId) REFERENCES accounts(id), FOREIGN KEY (accGroupId) REFERENCES accGroups(id));"


//Account queries
var create_account_query = "INSERT INTO accounts (username, password, email) VALUES(?,?,?);"

var get_account_by_email_query = "SELECT * FROM accounts where email=?;"

var get_account_by_username_query = "SELECT * FROM accounts where username=?;"

var get_account_by_id_query = "SELECT * FROM accounts where id=?;"


//Group queries
var create_group_query = "INSERT INTO accGroups (groupName, createAt) VALUES(?,?);"

var get_group_by_groupName = "SELECT * FROM accGroups WHERE groupName=?;"

var add_user_into_group_query = "INSERT INTO accountGroupRelation (accountId, accGroupId) VALUES(?,?);"

var get_all_group_by_account_id_query = "SELECT accGroups.groupName FROM accGroups JOIN accountGroupRelation ON accGroups.id = accountGroupRelation.accGroupId WHERE accountGroupRelation.accountId = ?;"

var get_all_groups_query = "SELECT * FROM accGroups;"

var get_all_account_by_group_id_query = "SELECT accounts.id FROM accounts JOIN accountGroupRelation ON accounts.id = accountGroupRelation.accountId WHERE accountGroupRelation.accGroupId = ?;"

module.exports = {
    "create_user_table_query" :create_user_table_query,
    "alter_user_table_query" : alter_user_table_query,
    "create_group_table_query" : create_group_table_query,
    "create_accountGroupRelation_table_query" : create_accountGroupRelation_table_query,
    "create_account_query" : create_account_query,
    "get_account_by_email_query" : get_account_by_email_query,
    "get_account_by_username_query" : get_account_by_username_query,
    "get_account_by_id_query" : get_account_by_id_query,
    "create_group_query" : create_group_query,
    "add_user_into_group_query" : add_user_into_group_query,
    "get_group_by_groupName" : get_group_by_groupName,
    "get_all_group_by_account_id_query" : get_all_group_by_account_id_query,
    "get_all_groups_query" : get_all_groups_query,
    "get_all_account_by_group_id_query" : get_all_account_by_group_id_query,

}