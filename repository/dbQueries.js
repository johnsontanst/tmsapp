//INIT
var create_user_table_query = "CREATE TABLE IF NOT EXISTS accounts (id INT(11) PRIMARY KEY AUTO_INCREMENT, username VARCHAR(50) NOT NULL, password VARCHAR(255) NOT NULL, email VARCHAR(100) NOT NULL);"

var alter_user_table_query = "ALTER TABLE accounts MODIFY int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2"

var create_group_table_query = "CREATE TABLE IF NOT EXISTS accGroups (id INT PRIMARY KEY AUTO_INCREMENT, groupName VARCHAR(255) NOT NULL, createAt DATETIME);"

var create_accountGroupRelation_table_query = "CREATE TABLE IF NOT EXISTS accountGroupRelation (accountId INT NOT NULL, accGroupId INT NOT NULL, FOREIGN KEY (accountId) REFERENCES accounts(id), FOREIGN KEY (accGroupId) REFERENCES accGroups(id));"


//Account queries
var create_account_query = "INSERT INTO accounts (username, password, email) VALUES(?,?,?);"

var get_account_by_email_query = "SELECT * FROM accounts where email=?;"

var get_account_by_username_query = "SELECT * FROM accounts where username=?;"

var get_all_users_query = "SELECT accounts.*, accountsGroup.fk_groupName from accounts JOIN accountsGroup ON accounts.username = accountsGroup.fk_username;"

//Group queries
var create_group_query = "INSERT INTO accGroups (groupName) VALUES(?);"

var get_group_by_groupName = "SELECT * FROM accGroups WHERE groupName=?;"

var add_user_into_group_query = "INSERT INTO accountsGroup (fk_username, fk_groupName) VALUES(?,?);"

var get_all_group_by_username_query = "SELECT accGroups.groupName FROM accGroups JOIN accountsGroup ON accGroups.groupName = accountsGroup.fk_groupName WHERE accountsGroup.fk_username = ?;"

var get_all_groups_query = "SELECT * FROM accGroups;"

var get_all_account_by_groupName_query = "SELECT accounts.username FROM accounts JOIN accountsGroup ON accounts.username = accountsGroup.fk_username WHERE accountsGroup.fk_groupName = ?;"

var get_all_username_by_application_open_query = "SELECT accountsGroup.fk_username from accountsGroup JOIN application ON accountsGroup.fk_groupName = application.App_permit_Open WHERE application.App_Acronym = ?"

var get_all_username_by_application_todo_query = "SELECT accountsGroup.fk_username from accountsGroup JOIN application ON accountsGroup.fk_groupName = application.App_permit_toDoList WHERE application.App_Acronym = ?"

module.exports = {
    "create_user_table_query" :create_user_table_query,
    "alter_user_table_query" : alter_user_table_query,
    "create_group_table_query" : create_group_table_query,
    "create_accountGroupRelation_table_query" : create_accountGroupRelation_table_query,
    "create_account_query" : create_account_query,
    "get_account_by_email_query" : get_account_by_email_query,
    "get_account_by_username_query" : get_account_by_username_query,
    "create_group_query" : create_group_query,
    "add_user_into_group_query" : add_user_into_group_query,
    "get_group_by_groupName" : get_group_by_groupName,
    "get_all_group_by_username_query" : get_all_group_by_username_query,
    "get_all_groups_query" : get_all_groups_query,
    "get_all_username_by_application_open_query" : get_all_username_by_application_open_query,
    "get_all_account_by_groupName_query" : get_all_account_by_groupName_query,
    "get_all_username_by_application_todo_query" : get_all_username_by_application_todo_query,
    "get_all_users_query" : get_all_users_query,

}