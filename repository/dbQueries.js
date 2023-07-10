//INIT
var create_user_table_query = "CREATE TABLE IF NOT EXISTS accounts (id INT(11) PRIMARY KEY AUTO_INCREMENT, username VARCHAR(50) NOT NULL, password VARCHAR(255) NOT NULL, email VARCHAR(100) NOT NULL);"

var alter_user_table_query = "ALTER TABLE accounts MODIFY int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2"

var create_group_table_query = "CREATE TABLE IF NOT EXISTS accGroups (id INT PRIMARY KEY AUTO_INCREMENT, groupName VARCHAR(255) NOT NULL, createAt DATETIME);"

var create_accountGroupRelation_table_query = "CREATE TABLE IF NOT EXISTS accountGroupRelation (accountId INT NOT NULL, accGroupId INT NOT NULL, FOREIGN KEY (accountId) REFERENCES accounts(id), FOREIGN KEY (accGroupId) REFERENCES accGroups(id));"


//Account queries
var create_account_query = "INSERT INTO accounts (username, password, email, status) VALUES(?,?,?,?);"

var create_account_without_email_query = "INSERT INTO accounts (username, password, status) VALUES(?,?,?);"

var get_account_by_email_query = "SELECT * FROM accounts where email=?;"

var get_account_by_username_query = "SELECT * FROM accounts where username=?;"

var get_all_users_group_query = "SELECT accounts.*, accountsGroup.fk_groupName from accounts LEFT JOIN accountsGroup ON accounts.username = accountsGroup.fk_username;"

var update_account_emailPassword_query = "UPDATE accounts SET password=?, email=? WHERE username=?;"

var admin_update_user_account_query = "UPDATE accounts SET password=?, email=?, status=? WHERE username=?;"

var get_all_users_query = "SELECT * FROM accounts;"
//END Account QUERY
//Group queries
var create_group_query = "INSERT INTO accGroups (groupName) VALUES(?);"

var get_group_by_groupName = "SELECT * FROM accGroups WHERE groupName=?;"

var add_user_into_group_query = "INSERT INTO accountsGroup (fk_username, fk_groupName) VALUES(?,?);"

var get_all_group_by_username_query = "SELECT accGroups.groupName FROM accGroups JOIN accountsGroup ON accGroups.groupName = accountsGroup.fk_groupName WHERE accountsGroup.fk_username = ?;"

var get_all_groups_by_username = "SELECT * FROM accountsgroup WHERE fk_groupName =?;"

var get_all_groups_query = "SELECT * FROM accgroups;"

var get_all_account_by_groupName_query = "SELECT accounts.username FROM accounts JOIN accountsGroup ON accounts.username = accountsGroup.fk_username WHERE accountsGroup.fk_groupName = ?;"

var get_all_user_email_by_groupName_query = "SELECT accounts.email FROM accounts JOIN accountsGroup ON accounts.username = accountsGroup.fk_username WHERE accountsGroup.fk_groupName = ?;"

var get_all_username_by_application_open_query = "SELECT accountsGroup.fk_username from accountsGroup JOIN application ON accountsGroup.fk_groupName = application.App_permit_Open WHERE application.App_Acronym = ?"

var get_all_username_by_application_todo_query = "SELECT accountsGroup.fk_username from accountsGroup JOIN application ON accountsGroup.fk_groupName = application.App_permit_toDoList WHERE application.App_Acronym = ?"

var delete_all_groupsWOadmin_by_username_query = "DELETE FROM accountsgroup WHERE fk_groupName != 'admin' AND fk_username=?;"

var delete_all_groups_by_username = "DELETE FROM accountsgroup WHERE fk_username =?;"

var check_user_in_group_query = "SELECT * FROM accountsgroup WHERE fk_groupName = ? AND fk_username = ?;"

var get_pivot_groupsNusers_query = "SELECT * FROM accountsgroup;"

//END Group QUERY
//Application
var create_application_query = "INSERT INTO application (App_Acronym, App_Description, App_Rnumber, App_startDate, App_endDate, App_permit_Open, App_permit_toDoList, App_permit_Doing, App_permit_Done) VALUES(?,?,?,?,?,?,?,?,?);"

var get_all_application_query = "SELECT * FROM application;"

var get_app_by_app_acronym_query = "SELECT * FROM application WHERE App_Acronym=?;"

var update_app_Rnumber_query = "UPDATE application SET App_Rnumber = ? WHERE App_Acronym = ?;"

var update_app_query = "UPDATE application SET App_endDate = ?, App_permit_Open=?, App_permit_toDoList=?,App_permit_Doing=?, App_permit_Done=?, App_Description=? WHERE App_Acronym = ?;"

var check_create_group_query = "SELECT * FROM application WHERE App_permit_Create = ?;"

var check_open_group_query = "SELECT * FROM application WHERE App_permit_Open = ?;"

var check_todo_group_query = "SELECT * FROM application WHERE App_permit_toDoList = ?;"

var check_doing_group_query = "SELECT * FROM application WHERE App_permit_Doing = ?;"

var check_done_group_query = "SELECT * FROM application WHERE App_permit_Done = ?;"

//END Apllication QUERY
//Plan

var create_plan_query = "INSERT INTO plan (Plan_MVP_name, Plan_startDate, Plan_endDate, Plan_app_acronym, colour) VALUES(?,?,?,?,?);"

var get_all_plan_by_app_query = "SELECT * FROM plan WHERE Plan_app_acronym = ?;"

var get_plan_by_plan_name_query = "SELECT * FROM plan WHERE Plan_MVP_name = ?;"

var get_plan_by_planName_app_query = "SELECT * FROM plan WHERE Plan_MVP_name=? AND Plan_app_Acronym =?;"


//END Plan QUERY
//Task
var create_task_query = "INSERT INTO task (Task_name, Task_description, Task_notes, Task_id, Task_plan, Task_app_Acronym, Task_state, Task_creator, Task_owner, Task_createDate) VALUES(?,?,?,?,?,?,?,?,?,?);"

var get_task_by_app_query = "SELECT * FROM task WHERE Task_app_Acronym = ?;"

var get_task_by_plan_query = "SELECT * FROM task WHERE Task_plan = ?;"

var get_task_by_task_name_query = "SELECT * FROM task WHERE Task_name = ?;"

var get_task_by_task_id_query = "SELECT * FROM task WHERE Task_id=?;"

var update_task_query = "UPDATE task SET Task_state=?, Task_notes=?, Task_plan=?, Task_owner=? WHERE Task_id=?;"

var update_task_state_query = "UPDATE task SET Task_state=? WHERE Task_name=?;"


//END Task QUERY

module.exports = {
    "create_user_table_query" :create_user_table_query,
    "alter_user_table_query" : alter_user_table_query,
    "create_account_without_email_query" : create_account_without_email_query,
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
    "get_all_users_group_query" : get_all_users_group_query,
    "update_account_emailPassword_query" : update_account_emailPassword_query,
    "delete_all_groupsWOadmin_by_username_query" : delete_all_groupsWOadmin_by_username_query,
    "admin_update_user_account_query" : admin_update_user_account_query,
    "check_user_in_group_query" : check_user_in_group_query,
    "get_all_users_query" : get_all_users_query,
    "get_pivot_groupsNusers_query" : get_pivot_groupsNusers_query,
    "delete_all_groups_by_username" : delete_all_groups_by_username,
    "create_application_query" : create_application_query,
    "get_all_application_query" : get_all_application_query,
    "create_plan_query" : create_plan_query,
    "get_all_plan_by_app_query" : get_all_plan_by_app_query, 
    "create_task_query" : create_task_query,
    "get_task_by_app_query" : get_task_by_app_query,
    "get_task_by_plan_query" : get_task_by_plan_query,
    "get_task_by_task_name_query": get_task_by_task_name_query,
    "update_task_query" : update_task_query,
    "update_task_state_query" : update_task_state_query,
    "get_app_by_app_acronym_query" : get_app_by_app_acronym_query,
    "get_plan_by_plan_name_query" : get_plan_by_plan_name_query,
    "update_app_Rnumber_query" : update_app_Rnumber_query,
    "get_plan_by_planName_app_query" : get_plan_by_planName_app_query,
    "get_task_by_task_id_query" : get_task_by_task_id_query,
    "update_app_query" : update_app_query,
    "get_all_user_email_by_groupName_query" : get_all_user_email_by_groupName_query,
    "get_all_groups_by_username" : get_all_groups_by_username,
    "check_create_group_query":check_create_group_query,
    "check_open_group_query": check_open_group_query,
    "check_todo_group_query":check_todo_group_query ,
    "check_doing_group_query": check_doing_group_query,
    "check_done_group_query":check_done_group_query ,
}