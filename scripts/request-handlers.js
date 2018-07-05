"use strict";
const mysql = require("mysql");
const options = require("./connectionOptions.json");

/* Endpoint - GET */

/**
 * Gets a list of countries from the database.
 */
function getCountries(request, response) {
    var connection = mysql.createConnection(options);
    var query = "SELECT id, name, short_name FROM country";
    connection.query(query, function (error, rows) {
        if (error) {
            response.json({ "Message": "Error" });
        } else {
            response.json({ "Message": "OK", "Countries": rows });
        }
    });
}
module.exports.getCountries = getCountries;

/**
 * Gets a list of user types from the database.
 */
function getUserType(request, response) {
    var connection = mysql.createConnection(options);
    var query = "SELECT id, user_type FROM userType";
    connection.query(query, function (err, rows) {
        if (err) {
            response.json({ "Message": "Error" });
        } else {
            response.json({ "Message": "OK", "UserType": rows });
        }
    });
}
module.exports.getUserType = getUserType;

/**
 * Gets a list of users from the database.
 */
function getUsers(request, response) {
    var connection = mysql.createConnection(options);
    var query = "SELECT id, username, password, birth_date, country_id, profile_pic_url, user_type_id FROM user";
    connection.query(query, function (err, rows) {
        if (err) {
            response.json({ "Message": "Error" });
        } else {
            response.json({ "Message": "OK", "Users": rows });
        }
    });
}
module.exports.getUsers = getUsers;

/**
 * Gets a list of players from the database.
 */
function getPlayers(request, response) {
    var connection = mysql.createConnection(options);
    var query = "SELECT id, username, password, birth_date, country_id, registration_date, user_type_id FROM player";
    connection.query(query, function (err, rows) {
        if (err) {
            response.json({ "Message": "Error" });
        } else {
            response.json({ "Message": "OK", "Players": rows });
        }
    });
}
module.exports.getPlayers = getPlayers;

/**
 * Gets a list of levels from the database.
 */
function getLevels(request, response) {
    var connection = mysql.createConnection(options);
    var query = "SELECT id, name FROM level";
    connection.query(query, function (err, rows) {
        if (err) {
            response.json({ "Message": "Error" });
        } else {
            response.json({ "Message": "OK", "Levels": rows });
        }
    });
}
module.exports.getLevels = getLevels;

/**
 * Gets a list of characters from the database.
 */
function getCharacters(request, response) {
    var connection = mysql.createConnection(options);
    var query = "SELECT id, name, endurance, strength, speed FROM character";
    connection.query(query, function (err, rows) {
        if (err) {
            response.json({ "Message": "Error" });
        } else {
            response.json({ "Message": "OK", "Characters": rows });
        }
    });
}
module.exports.getCharacters = getCharacters;

/**
 * Gets a list of sessions from the database.
 */
function getSessions(request, response) {
    var connection = mysql.createConnection(options);
    var query = "SELECT id, start_date, player_id, level_id, character_id FROM gameSession";
    connection.query(query, function (err, rows) {
        if (err) {
            response.json({ "Message": "Error" });
        } else {
            response.json({ "Message": "OK", "Sessions": rows });
        }
    });
}
module.exports.getSessions = getSessions;

/**
 * Gets a list of statistic types from the database.
 */
function getStatisticType(request, response) {
    var connection = mysql.createConnection(options);
    var query = "SELECT id, name, description FROM statisticType";
    connection.query(query, function (err, rows) {
        if (err) {
            response.json({ "Message": "Error" });
        } else {
            response.json({ "Message": "OK", "StatisticTypes": rows });
        }
    });
}
module.exports.getStatisticType = getStatisticType;

/**
 * Gets a list of statistics from the database.
 */
function getStatistics(request, response) {
    var connection = mysql.createConnection(options);
    var query = "SELECT id, value, registration_date, statistic_type_id, game_session_id FROM statistic";
    connection.query(query, function (err, rows) {
        if (err) {
            response.json({ "Message": "Error" });
        } else {
            response.json({ "Message": "OK", "Statistics": rows });
        }
    });
}
module.exports.getStatistics = getStatistics;


/* Endpoint - POST / PUT */

/**
 * Adds or updates a country in the database, based on the request method ("POST" or "PUT").
 */
function addUpdateCountry(request, response) {
    var connection = mysql.createConnection(options);

    var id = request.body.id;
    var name = request.body.name;
    var shortName = request.body.shortName;

    var sql;

    if (request.method === "POST")
        sql = mysql.format("INSERT INTO country (name, short_name) " + 
                           "VALUES (?, ?);", [name, shortName]);
    else
        sql = mysql.format("UPDATE country SET name = ?, short_name = ? WHERE id = ?",
                           [name, shortName, id]);

    connection.query(sql, function(err, rows){
        if(err)
            response.json({"Message": "Error"});
        else
            response.send(rows);
    })
}
module.exports.addUpdateCountry = addUpdateCountry;

/**
 * Adds or updates a user type in the database, based on the request method ("POST" or "PUT").
 */
function addUpdateUserType(request, response) {
    var connection = mysql.createConnection(options);

    var id = request.body.id;
    var userType = request.body.userType;

    var sql;

    if (request.method === "POST")
        sql = mysql.format("INSERT INTO userType (user_type) " + 
                           "VALUES (?);", [userType]);
    else
        sql = mysql.format("UPDATE userType SET user_type = ? WHERE id = ?", 
                          [userType, id]);

    connection.query(sql, function (err, rows) {
        if (err) {
            response.json({ "Message": "Error" });
        } else {
            response.send(rows);
        }
    });
}
module.exports.addUpdateUserType = addUpdateUserType;

/**
 * Adds or updates a user in the database, based on the request method ("POST" or "PUT").
 */
function addUpdateUser(rerequestq, response) {
    var connection = mysql.createConnection(options);

    var id = request.body.id;
    var username = request.body.username;
    var password = request.body.password;
    var birthDate = request.body.birthDate;
    var countryId = request.body.countryId;
    var profilePicUrl = request.body.profilePicUrl;
    var userTypeId = request.body.userTypeId;

    var sql;

    if (request.method === "POST")
        sql = mysql.format("INSERT INTO user (username, password, birth_date, country_id, profile_pic_url, user_type_id) " + 
                           "VALUES (?,?,?,?,?,?);", [username, password, birthDate, countryId, profilePicUrl, userTypeId]);
    else
        sql = mysql.format("UPDATE user SET username = ?, password = ?, birth_date = ?, country_id = ?, profile_pic_url = ?, user_type_id = ? WHERE id = ?", 
                            [username, password, birthDate, countryId, profilePicUrl, userTypeId, id]);

    connection.query(sql, function (err, rows) {
        if (err) {
            response.json({ "Message": "Error" });
        } else {
            response.send(rows);
        }
    });
}
module.exports.addUpdateUser = addUpdateUser;

/**
 * Adds or updates a player in the database, based on the request method ("POST" or "PUT").
 */
function addUpdatePlayer(request, response) {
    var connection = mysql.createConnection(options);

    var id = request.body.id;
    var username = request.body.username;
    var password = request.body.password;
    var birthDate = request.body.birthDate;
    var countryId = request.body.countryId;
    var registrationDate = request.body.registrationDate;
    var userTypeId = request.body.userTypeId;

    var sql;

    if (request.method === "POST")
        sql = mysql.format("INSERT INTO player (username, password, birth_date, country_id, registration_date, user_type_id) " +  
                           "VALUES (?,?,?,?,?,?);", [username, password, birthDate, countryId, registrationDate, userTypeId]);
    else
        sql = mysql.format("UPDATE player SET username = ?, password = ?, birth_date = ?, country_id = ?, registration_date = ?, user_type_id = ? WHERE id = ?", 
                            [username, password, birthDate, countryId, registrationDate, userTypeId, id]);

    connection.query(sql, function (err, rows) {
        if (err) {
            response.json({ "Message": "Error" });
        } else {
            response.send(rows);
        }
    });
}
module.exports.addUpdatePlayer = addUpdatePlayer;

/**
 * Adds or updates a level in the database, based on the request method ("POST" or "PUT").
 */
function addUpdateLevel(request, response) {
    var connection = mysql.createConnection(options);

    var id = request.body.id;
    var name = request.body.name;

    var sql;

    if (request.method === "POST")
        sql = mysql.format("INSERT INTO level (name) VALUES (?);", [name]);
    else
        sql = mysql.format("UPDATE level SET name = ? WHERE id = ?",  [name, id]);

    connection.query(sql, function (err, rows) {
        if (err) {
            response.json({ "Message": "Error" });
        } else {
            response.send(rows);
        }
    });
}
module.exports.addUpdateLevel = addUpdateLevel;

/**
 * Adds or updates a character in the database, based on the request method ("POST" or "PUT").
 */
function addUpdateCharacter(request, response) {
    var connection = mysql.createConnection(options);

    var id = request.body.id;
    var name = request.body.name;
    var endurance = request.body.endurance;
    var strength = request.body.strength;
    var speed = request.body.speed;

    var sql;

    if (request.method === "POST")
        sql = mysql.format("INSERT INTO character (name, endurance, strength, speed) " + 
                           "VALUES (?,?,?,?);", [name, endurance, strength, speed]);
    else
        sql = mysql.format("UPDATE character SET name = ?, endurance = ?, strength = ?, speed = ? WHERE id = ?", 
                          [name, endurance, strength, speed, id]);

    connection.query(sql, function (err, rows) {
        if (err) {
            response.json({ "Message": "Error" });
        } else {
            response.send(rows);
        }
    });
}
module.exports.addUpdateCharacter = addUpdateCharacter;

/**
 * Adds or updates a session in the database, based on the request method ("POST" or "PUT").
 */
function addUpdateSession(request, response) {
    var connection = mysql.createConnection(options);

    var id = request.body.id;
    var startDate = request.body.startDate;
    var playerId = request.body.playerId;
    var levelId = request.body.levelId;
    var characterId = request.body.characterId;

    var sql;

    if (request.method === "POST")
        sql = mysql.format("INSERT INTO gameSession (start_date, player_id, level_id, character_id)" + 
                           "VALUES (?,?,?,?);", [startDate, playerId, levelId, characterId]);
    else
        sql = mysql.format("UPDATE gameSession SET start_date = ?, player_id = ?, level_id = ?, character_id = ? WHERE id = ?",  
                           [startDate, playerId, levelId, characterId, id]);

    connection.query(sql, function (err, rows) {
        if (err) {
            response.json({ "Message": "Error" });
        } else {
            response.send(rows);
        }
    });
}
module.exports.addUpdateSession = addUpdateSession;

/**
 * Adds or updates a statistic type in the database, based on the request method ("POST" or "PUT").
 */
function addUpdateStatisticType(request, response) {
    var connection = mysql.createConnection(options);

    var id = request.body.id;
    var name = request.body.name;
    var description = request.body.description;

    var sql;

    if (request.method === "POST")
        sql = mysql.format("INSERT INTO statisticType (name, description)" + 
                           "VALUES (?,?);", [name, description]);
    else
        sql = mysql.format("UPDATE statisticType SET name = ?, description = ? WHERE id = ?",  
                          [name, description, id]);

    connection.query(sql, function (err, rows) {
        if (err) {
            response.json({ "Message": "Error" });
        } else {
            response.send(rows);
        }
    });
}
module.exports.addUpdateStatisticType = addUpdateStatisticType;

/**
 * Adds or updates a statistic in the database, based on the request method ("POST" or "PUT").
 */
function addUpdateStatistic(request, response) {
    var connection = mysql.createConnection(options);

    var id = request.body.id;
    var value = request.body.value;
    var registrationDate = request.body.registrationDate;
    var statisticTypeId = request.body.statisticTypeId;
    var gameSessionId = request.body.gameSessionId;

    var sql;

    if (request.method === "POST")
        sql = mysql.format("INSERT INTO statistic (value, registration_date, statistic_type_id, game_session_id)" +  
                           "VALUES (?,?,?,?);", [value, registrationDate, statisticTypeId, gameSessionId]);
    else
        sql = mysql.format("UPDATE statistic SET value = ?, registration_date = ?, statistic_type_id = ?, game_session_id = ? WHERE id = ?", 
                         [value, registrationDate, statisticTypeId, gameSessionId, id]);

    connection.query(sql, function (err, rows) {
        if (err) {
            response.json({ "Message": "Error" });
        } else {
            response.send(rows);
        }
    });
}
module.exports.addUpdateStatistic = addUpdateStatistic;


/* Endpoint - DELETE */

/**
 * Removes a certain country from the database.
 */
function deleteCountry(request, response) {
    var connection = mysql.createConnection(options);

    var id = request.body.id;

    var sql;

    sql = mysql.format("DELETE FROM country WHERE id = ?", [id]);

    connection.query(sql, function(err, rows){
        if(err)
            response.json({"Message": "Error"});
        else
            response.send(rows);
    })
}
module.exports.deleteCountry = deleteCountry;

/**
 * Removes a certain user type from the database.
 */
function deleteUserType(request, response) {
    var connection = mysql.createConnection(options);

    var id = request.body.id;

    var sql;

    sql = mysql.format("DELETE FROM userType WHERE id = ?", [id]);

    connection.query(sql, function (err, rows) {
        if (err) {
            response.json({ "Message": "Error" });
        } else {
            response.send(rows);
        }
    });
}
module.exports.deleteUserType = deleteUserType;

/**
 * Removes a certain user from the database.
 */
function deleteUser(request, response) {
    var connection = mysql.createConnection(options);

    var id = request.body.id;

    var sql;

    sql = mysql.format("DELETE FROM user WHERE id = ?", [id]);

    connection.query(sql, function (err, rows) {
        if (err) {
            response.json({ "Message": "Error" });
        } else {
            response.send(rows);
        }
    });
}
module.exports.deleteUser = deleteUser;

/**
 * Removes a certain player from the database.
 */
function deletePlayer(request, response) {
    var connection = mysql.createConnection(options);

    var id = request.body.id;

    var sql;

    sql = mysql.format("DELETE FROM player WHERE id = ?", [id]);

    connection.query(sql, function (err, rows) {
        if (err) {
            response.json({ "Message": "Error" });
        } else {
            response.send(rows);
        }
    });
}
module.exports.deletePlayer = deletePlayer;

/**
 * Removes a certain level from the database.
 */
function deleteLevel(request, response) {
    var connection = mysql.createConnection(options);

    var id = request.body.id;

    var sql;

    sql = mysql.format("DELETE FROM level WHERE id = ?",  [id]);

    connection.query(sql, function (err, rows) {
        if (err) {
            response.json({ "Message": "Error" });
        } else {
            response.send(rows);
        }
    });
}
module.exports.deleteLevel = deleteLevel;

/**
 * Removes a certain character from the database.
 */
function deleteCharacter(request, response) {
    var connection = mysql.createConnection(options);

    var id = request.body.id;

    var sql;

    sql = mysql.format("DELETE FROM character WHERE id = ?", [id]);

    connection.query(sql, function (err, rows) {
        if (err) {
            response.json({ "Message": "Error" });
        } else {
            response.send(rows);
        }
    });
}
module.exports.deleteCharacter = deleteCharacter;

/**
 * Removes a certain session from the database.
 */
function deleteSession(request, response) {
    var connection = mysql.createConnection(options);

    var id = request.body.id;

    var sql;

    sql = mysql.format("DELETE FROM gameSession WHERE id = ?", [id]);

    connection.query(sql, function (err, rows) {
        if (err) {
            response.json({ "Message": "Error" });
        } else {
            response.send(rows);
        }
    });
}
module.exports.deleteSession = deleteSession;

/**
 * Removes a certain statistic type from the database.
 */
function deleteStatisticType(request, response) {
    var connection = mysql.createConnection(options);

    var id = request.body.id;

    var sql;

    sql = mysql.format("DELETE FROM statisticType WHERE id = ?", [id]);

    connection.query(sql, function (err, rows) {
        if (err) {
            response.json({ "Message": "Error" });
        } else {
            response.send(rows);
        }
    });
}
module.exports.deleteStatisticType = deleteStatisticType;

/**
 * Removes a certain statistic from the database.
 */
function deleteStatistic(request, response) {
    var connection = mysql.createConnection(options);

    var id = request.body.id;
    var sql;

    sql = mysql.format("DELETE FROM statistic WHERE id = ?", [id]);

    connection.query(sql, function (err, rows) {
        if (err) {
            response.json({ "Message": "Error" });
        } else {
            response.send(rows);
        }
    });
}
module.exports.deleteStatistic = deleteStatistic;