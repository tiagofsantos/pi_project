var selectedSessionId;

// Holds the information of the sessions currently being shown 
var currentSessions = [];

// Holds information of the username related to a certain player id. Key = id, Value = username
var playerNames = {}

var levelNames = {}

var characterNames = {}

var statistics = []

var statisticTypes = {}
/******************************************************************** */

function getSessions(filter){
    currentSessions = []

    var endpoint = "/session";
    switch(filter.timespan){
        case "This month": endpoint += "/month"; break;
        case "This week": endpoint += "/week"; break;
        case "Today": endpoint += "/today"; break;
    }

    getSessionsFilter(endpoint);
    
    var aux = [];

    if(filter.search){
        currentSessions.forEach(function(current){
            if(playerNames[current.player_id] === filter.search){
                aux.push(current);
                return;
            }
        });
        currentSessions = aux;
    }
}

function getSessionsFilter(endpoint){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", endpoint, false);
    xhr.onreadystatechange = function(){
        if(this.status === 200 && this.readyState === 4){
            JSON.parse(this.responseText).sessions.forEach(function(r){
                currentSessions.push(r);
            });
        }
    }
    xhr.send();
}

function getLastSessionId(){
    var id;
    
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/session", false);
    xhr.onreadystatechange = function(){
        if(this.status === 200 && this.readyState === 4){

            var max = JSON.parse(this.responseText).sessions[0].id;
            JSON.parse(this.responseText).sessions.forEach(function(r){
                if(r.id > max){
                    max = r.id;
                }
            });

            id = max;
        }
    }
    xhr.send();
    return id;
}

function getPlayerNames(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/player", false);
    xhr.onreadystatechange = function(){
        if(this.status === 200 && this.readyState === 4){
            JSON.parse(this.responseText).players.forEach(function(r){
                playerNames[r.id] = r.username;
            });
        }
    }
    xhr.send();
}

function getLevelNames(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/level", false);
    xhr.onreadystatechange = function(){
        if(this.status === 200 && this.readyState === 4){
            JSON.parse(this.responseText).levels.forEach(function(r){
                levelNames[r.id] = r.name;
            });
        }
    }
    xhr.send();
}

function getCharacterNames(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/character", false);
    xhr.onreadystatechange = function(){
        if(this.status === 200 && this.readyState === 4){
            JSON.parse(this.responseText).characters.forEach(function(r){
                characterNames[r.id] = r.name;
            });
        }
    }
    xhr.send();
}

function getSessionStatistics(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/statistic", false);
    xhr.onreadystatechange = function(){
        if(this.status === 200 && this.readyState === 4){
            JSON.parse(this.responseText).statistics.forEach(function(r){
                statistics.push(r);
            });
        }
    }
    xhr.send();
}

function getSessionStatisticsTypes(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/statisticType", false);
    xhr.onreadystatechange = function(){
        if(this.status === 200 && this.readyState === 4){
            JSON.parse(this.responseText).statisticTypes.forEach(function(r){
                statisticTypes[r.id] = r.name;
            });
        }
    }
    xhr.send();
}

function sendAddSessionRequest(username, level, character, time){
    var playerId = getPlayerIdByName(username);
    var characterId = getCharacterIdByName(character);
    
    //Converts given time (mm:ss) to seconds
    var minutes = parseInt(time.split(":")[0]);
    var seconds = parseInt(time.split(":")[1]);

    minutes = minutes * 60;
    seconds = seconds + minutes;
    
    var dateString = getStartDateByTime(seconds);

    var success = true;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/session", false);
    xhr.onreadystatechange = function(){
        if(this.status === 200 && this.readyState === 4){
            if("message" in JSON.parse(this.responseText) && JSON.parse(this.responseText).message === "error")
                success = false;
        }
    }
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({"startDate": dateString, "playerId": playerId, "levelId": level, "characterId": characterId}));

    if(!success){
        return false;
    }
    //Send request to add statistic about time.
    var statisticTypeId = getStatisticTypeIdByName("time");
    var gameSessionId = getLastSessionId();

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/statistic", false);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({"value": seconds, "registrationDate": dateString, "statisticTypeId": statisticTypeId, "gameSessionId": gameSessionId}));

    return true;
}

function sendEditSessionRequest(username, level, character, time){
    var currentSession;

    currentSessions.forEach(function(current){
        if(current.id == selectedSessionId){
            currentSession = current;
        }
    });

    var playerId = getPlayerIdByName(username);
    var characterId = getCharacterIdByName(character);
    
    //Converts given time (mm:ss) to seconds
    var minutes = parseInt(time.split(":")[0]);
    var seconds = parseInt(time.split(":")[1]);

    minutes = minutes * 60;
    seconds = seconds + minutes;

    var startDate = currentSession.start_date.split("T")[0];

    var success = true;

    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "/session", false);
    xhr.onreadystatechange = function(){
        if(this.status === 200 && this.readyState === 4){
            if("message" in JSON.parse(this.responseText) && JSON.parse(this.responseText).message === "error")
                success = false;
        }
    }
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({"id": selectedSessionId, "startDate": startDate, "playerId": playerId, "levelId": level, "characterId": characterId}));

    if(!success){
        return false;
    }
    //Send request to edit statistic.
    var statisticTypeId = getStatisticTypeIdByName("time");
    var statistic = getStatisticByTypeSession(statisticTypeId, selectedSessionId);
    
    var registrationDate = statistic.registration_date.split("T")[0];

    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "/statistic", false);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({"id": statistic.id, "value": seconds, "registrationDate": registrationDate, "statisticTypeId": statisticTypeId, "gameSessionId": selectedSessionId}));

    return true;
}

function sendDeleteSessionRequest(){
    var success = true;
    
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", "/session", false);
    xhr.onreadystatechange = function(){
        if(this.status === 200 && this.readyState === 4){
            if("message" in JSON.parse(this.responseText) && JSON.parse(this.responseText).message === "error")
                success = false;
        }
    }
    
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({"id": selectedSessionId}));

    return success;
}
/*********************************************************************** */
function getStatisticByTypeSession(typeId, sessionId){
    var statistic;
    statistics.forEach(function(current){
        if(current.game_session_id == sessionId  && current.statistic_type_id == typeId){
            statistic = current;
        }
    });
    return statistic;
}

function getStatisticTypeIdByName(type){
    var id;
    for (var key in statisticTypes) {
        if (statisticTypes.hasOwnProperty(key)) {
            if(statisticTypes[key] == type){
                id = key;
            }
        }
    }
    return id;
}

function getPlayerIdByName(username){
    var id;
    for (var key in playerNames) {
        if (playerNames.hasOwnProperty(key)) {
            if(playerNames[key] == username){
                id = key;
            }
        }
    }
    return id;
}

function getCharacterIdByName(character){
    var id;

    for (var key in characterNames) {
        if (characterNames.hasOwnProperty(key)) {
            if(characterNames[key] == character){
                id = key;
            }
        }
    }
    return id;
}

function getStartDateByTime(seconds){
    var startDate = new Date(Date.now() - seconds);

    var month = startDate.getMonth() +1;
    var day = startDate.getDate();

    if(day<10) {
        day = '0'+day
    } 

    if(month<10) {
        month = '0'+month
    } 
    return startDate.getFullYear() + "-" + month + "-" + day;
}

function getSessionUsername(session){
    var userId = session.player_id;

    return playerNames[userId];
}

function getSessionLevelName(session){
    var levelId = session.level_id;

    return levelNames[levelId];
}

function getSessionCharacterName(session){
    var characterId = session.character_id;

    return characterNames[characterId];
}

function getSessionTime(session){
    var sessionId = session.id;
    var typeId;

    for( var key in statisticTypes ) {
        if( statisticTypes.hasOwnProperty( key ) ) {
             if( statisticTypes[ key ] == "time" )
                 typeId = key;
        }
    }

    var timeInSeconds;

    statistics.forEach(function(current){
        if(current.game_session_id == sessionId){
            if(current.statistic_type_id == typeId){
                timeInSeconds = current.value;
            }
        }
    });

    var minutes = Math.floor(timeInSeconds / 60);
    var seconds = timeInSeconds - minutes * 60;

    var minutesString = (minutes < 10) ? "0" + minutes : "" + minutes;
    var secondsString = (seconds < 10) ? "0" + seconds : "" + seconds;

    return minutesString + ":" + secondsString;
}

function usernameExists(username){
    var res = false;

    for (var key in playerNames) {
        if (playerNames.hasOwnProperty(key)) {
            if(playerNames[key] == username){
                res = true;
            }
        }
    }

    return res;
}

function levelExists(level){
    if(level in levelNames)
        return true;
    
    return false;
}

function characterExists(character){
    var res = false;

    for (var key in characterNames) {
        if (characterNames.hasOwnProperty(key)) {
            if(characterNames[key] == character){
                res = true;
            }
        }
    }

    return res;
}

/**
 * Builds the add session form.
 */
function buildAddSession() {
    var pane = buildBaseForm("Add a new game session", "javascript: addSession()");
    var form = pane.children[0];

    form.appendChild(buildBasicInput("session_username", "Username"));
    form.appendChild(buildBasicInput("session_level", "Level"));
    form.appendChild(buildBasicInput("session_character", "Character"));
    form.appendChild(buildBasicInput("session_time", "Time (mm:ss)"));
    form.appendChild(buildBasicSubmit("Add"));
}

/**
 * Builds the edit session form.
 */
function buildEditSession() {

    var session;
    currentSessions.forEach(function(current){
        if(current.id == selectedSessionId){
            session = current;
        }
    });

    var pane = buildBaseForm("Edit a game session", "javascript: editSession()");
    var form = pane.children[0];

    var username = buildBasicInput("session_username", "Username");
    var level = buildBasicInput("session_level", "Level");
    var character = buildBasicInput("session_character", "Character");
    var time = buildBasicInput("session_time", "Time (mm:ss)");

    username.value = getSessionUsername(session);
    level.value = getSessionLevelName(session);
    character.value = getSessionCharacterName(session);
    time.value = getSessionTime(session);

    form.appendChild(username);
    form.appendChild(level);
    form.appendChild(character);
    form.appendChild(time);
    form.appendChild(buildBasicSubmit("Confirm"));
}

/**
 * Builds the remove session dialog.
 */
function buildRemoveSession() {
    if (confirm("Are you sure? This session will be permanently removed.")) {
        removeSession();
    }
}

/**
 * Adds a new game session.
 * This method verifies the user inputs and makes a add session
 * request to the server.
 */
function addSession() {

    var username = document.getElementById("session_username").value;
    var level = document.getElementById("session_level").value;
    var character = document.getElementById("session_character").value;
    var time = document.getElementById("session_time").value;

    if (username.length == 0) {
        alert("That username is not valid");
        return;
    }

    if (!usernameExists(username)) { 
        alert("That username does not exist.");
        return;
    }

    if (level.length == 0 || !isInt(level)) {
        alert("That level is not valid");
        return;
    }

    if (!levelExists(level)) {
        alert("That level does not exist");
        return;
    }

    if (character.length == 0) {
        alert("That character is not valid");
        return;
    }

    if (!characterExists(character)) {
        alert("That character does not exist.");
        return;
    }

    if (time.length == 0 || !isTime(time)) {
        alert("That time is not valid (mm:ss)");
        return;
    }

    requestOk = sendAddSessionRequest(username, level, character, time);

    if (requestOk) { 
        alert("Session added");
        closeForm();
        updateSessionsTable();
    } else {
        alert("Session failed to add")
    }
}


/**
 * Edits a game session.
 * This method verifies the user inputs and makes a edit session
 * request to the server.
 */
function editSession() {

    var username = document.getElementById("session_username").value;
    var level = document.getElementById("session_level").value;
    var character = document.getElementById("session_character").value;
    var time = document.getElementById("session_time").value;

    if (username.length == 0) {
        alert("That username is not valid");
        return;
    }

    if (!usernameExists(username)) { //TROCAR POR VERIFICAÇÃO REAL
        alert("That username does not exist.");
        return;
    }

    if (level.length == 0 || !isInt(level)) {
        alert("That level is not valid");
        return;
    }

    if (!levelExists(level)) {
        alert("That level does not exist");
        return;
    }

    if (character.length == 0) {
        alert("That character is not valid");
        return;
    }

    if (!characterExists(character)) { 
        alert("That character does not exist.");
        return;
    }

    if (time.length == 0 || !isTime(time)) {
        alert("That time is not valid (mm:ss)");
        return;
    }

    requestOk = sendEditSessionRequest(username, level, character, time);

    if (requestOk) { //trocar pela variavel que diz se o pedido foi bem sucedido
        alert("Session edited");
        closeForm();
        updateSessionsTable();
    } else {
        alert("Session failed to edit")
    }
}


/**
 * Makes a server request to remove a session.
 */
function removeSession() {

    requestOk = sendDeleteSessionRequest();

    if (requestOk) { //trocar pela variavel que diz se o pedido foi bem sucedido
        alert("Session removed");
        updateSessionsTable();
    } else {
        alert("Session failed to remove")
    }
}

/**
 * Updates the filters with the value of the 
 * filter selector and input. Then calls for a table update.
 */
function updateSessionsFilters() {
    var search = document.getElementById("sessions_search");
    var selector = document.getElementById("sessions_timespan");

    var filters = new Object();
    filters.timespan = selector.value;

    if (search.value.length > 0)
        filters.search = search.value;

    updateSessionsTable(filters);
}

/**
 * Updates the table, deleting the outdated one, recreating
 * a new and updated table, using the filters given by parameter.
 */
function updateSessionsTable(filters) {
    var parent = document.getElementById("sessions").children[0];
    parent.removeChild(document.getElementById("sessions_table"));
    parent.appendChild(buildSessionsTable(filters));

    selectedSessionId = -1;
    prepareSessionSelectionEvents();
}

/**
 * Fetches and builds a data table with given filters.
 */
function buildSessionsTable(filters) {

    if (filters != null) {
        getSessions(filters);
    }

    // TODO ir buscar o tempo a partir das estatisticas
    // array global comas statistics e statistictype, e quando se for a construir a tabela itera-se esses arrays

    var table = document.createElement("table");
    table.id = "sessions_table";
    table.cellSpacing = "0";

    var columns = ["Id", "Date", "Username", "Level", "Character", "Time"];
    var thead = document.createElement("thead");
    var headRow = document.createElement("tr");
    columns.forEach(function (c) {
        var column = document.createElement("th");
        column.textContent = c;
        headRow.appendChild(column);
    })
    thead.appendChild(headRow);

    var tbody = document.createElement("tbody");
    currentSessions.forEach(function (row) {
        var tableRow = document.createElement("tr");
        Object.keys(row).forEach(function (field) {
            var td = document.createElement("td");
            td.textContent = row[field];
            tableRow.appendChild(td);
        })
        tbody.appendChild(tableRow);
    })

    table.appendChild(thead);
    table.appendChild(tbody);

    return table;
}

/**
 * Builds the entire sessions page with its title, subtitle, table filters,
 * table actions and data table.
 */
function buildSessions() {

    var createActionButton = function (id, event, text) {
        var btn = document.createElement("button");
        btn.id = id;
        btn.onclick = event;
        btn.textContent = text;
        return btn;
    }

    var pageContent = document.getElementById("page_content");

    var section = document.createElement("section");
    section.id = "sessions";

    var sectionContainer = document.createElement("div");
    sectionContainer.className = "section_container";

    var sectionTitle = document.createElement("div");
    sectionTitle.className = "section_title";

    var header = document.createElement("h1");
    header.textContent = "Sessions";

    var subheader = document.createElement("h2");
    subheader.textContent = "Manage and browse through all of our game sessions.";

    sectionTitle.appendChild(header);
    sectionTitle.appendChild(subheader);

    var tableFilter = document.createElement("div");
    tableFilter.className = "table_filter";

    var searchContainer = document.createElement("div");
    searchContainer.id = "search_bar";

    var searchImg = document.createElement("img");
    searchImg.src = "images/icons/search.png";

    var input = document.createElement("input");
    input.id = "sessions_search";
    input.type = "text";
    input.addEventListener("keyup", function (event) {
        // Update filters when the Enter key is pressed up.
        if (event.keyCode === 13) {
            updateSessionsFilters();
        }
    });

    searchContainer.appendChild(searchImg);
    searchContainer.appendChild(input);

    var selector = document.createElement("select");
    selector.id = "sessions_timespan";
    selector.onchange = updateSessionsFilters;

    const options = ["All time", "This month", "This week", "Today"];

    for (var option in options) {
        var opt = document.createElement('option');
        opt.value = options[option];
        opt.innerHTML = options[option];
        selector.appendChild(opt);
    }

    var buttonsContainer = document.createElement("div");
    buttonsContainer.className = "table_actions";

    buttonsContainer.appendChild(createActionButton("sessions_add", buildAddSession, "Add"));
    buttonsContainer.appendChild(createActionButton("sessions_edit", buildEditSession, "Edit"));
    buttonsContainer.appendChild(createActionButton("sessions_remove", buildRemoveSession, "Remove"));

    tableFilter.appendChild(searchContainer);
    tableFilter.appendChild(selector);
    tableFilter.appendChild(buttonsContainer);

    sectionContainer.appendChild(sectionTitle);
    sectionContainer.appendChild(tableFilter);
    sectionContainer.appendChild(buildSessionsTable());

    section.appendChild(sectionContainer);
    pageContent.appendChild(section);

    toggleSessionActions(false);
    prepareSessionSelectionEvents();

    getPlayerNames();
    getLevelNames();
    getCharacterNames();
    getSessionStatistics();
    getSessionStatisticsTypes();
}

/**
 * Sets up the table row selection events.
 */
function prepareSessionSelectionEvents() {
    $("table tbody tr").click(function () {

        var row = $(this);

        if (row.hasClass("selected_table_row")) {
            row.removeClass('selected_table_row');
            toggleSessionActions(false);
        } else {
            row.addClass('selected_table_row');
            row.siblings().removeClass('selected_table_row');
            toggleSessionActions(true);
        }

        selectedSessionId = row.find('td:first').html();
    });
}

/**
 * Toggles the specified buttons depending on the
 * value of selected.
 */
function toggleSessionActions(selected) {
    var toggle = function (id) {
        var btn = document.getElementById(id);
        btn.disabled = !selected;
        btn.className = selected ? "" : "disabled_button";
    }

    toggle("sessions_edit");
    toggle("sessions_remove");
}