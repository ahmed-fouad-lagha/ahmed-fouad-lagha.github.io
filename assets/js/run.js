---
---

/* RUN DIALOG BACKEND JS - specify run box aliases and the functions they execute */
/*      this file gets loaded dynamically whenever the run dialog is opened      */

// we should eventually replace the hardcoded aliases here with a database-type system
// loaded dynamically
function aliasRun(rawCommand) {
    var command = rawCommand.trim().toLowerCase(); // for case insensitivity
    if(command == "debug") {
        windowsError(1, "Unavailable", "The debug command is not available.");
    } else if (command == "winver") {
        winverStart();
    } else if (command == "winmine") {
        window.location.href = "{{ '/games/minesweeper/' | relative_url }}";
    } else if (command == "pacman") {
        window.location.href = "{{ '/games/pacman/' | relative_url }}";
    } else if (command == "tetris") {
        window.location.href = "{{ '/games/tetris/' | relative_url }}";
    } else if (command == "") {
        return;
    } else {
        windowsError(1, "Error", "Command not found!");
    }
}