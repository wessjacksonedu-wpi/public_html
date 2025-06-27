const boards = [
    {
        cells: [
            ["E", "L", "W", "Y", "C"],
            ["Y", "L", "O", "A", "N"],
            ["U", "B", "L", "E", "E"],
            ["E", "L", "P", "M", "V"],
            ["P", "U", "R", "A", "U"]],
        words: ["CYAN", "YELLOW", "PURPLE", "MAUVE", "BLUE"]
    },
    {
        cells: [
            ["E", "K", "O", "A", "P"],
            ["A", "W", "L", "I", "R"],
            ["N", "S", "F", "A", "T"],
            ["L", "E", "E", "R", "A"],
            ["A", "G", "G", "U", "J"]],
        words: ["TAPIR", "EAGLE", "JAGUAR", "SNAKE", "WOLF"]
    },
    {
        cells: [
            ["H", "C", "N", "A", "N"],
            ["Y", "R", "A", "A", "A"],
            ["R", "E", "A", "Y", "B"],
            ["F", "P", "P", "E", "R"],
            ["I", "G", "A", "P", "A"]],
        words: ["CHERRY", "PAPAYA", "BANANA", "PEAR", "FIG"]
    }, 
    {
        cells: [
            ["L", "E", "J", "E", "K"],
            ["M", "X", "E", "P", "I"],
            ["E", "U", "S", "H", "A"],
            ["R", "D", "E", "O", "N"],
            ["C", "E", "S", "A", "D"]],
        words: ["LEXUS", "HONDA", "JEEP", "KIA", "MERCEDES"]
    },
    {
        cells: [
            ["V", "E", "S", "H", "I"],
            ["A", "J", "E", "K", "I"],
            ["N", "N", "F", "F", "U"],
            ["A", "O", "L", "E", "A"],
            ["H", "H", "E", "N", "K"]],
        words: ["EVAN", "KAUSHIKI", "HELEN", "NOAH", "JEFF"]
    }
]

let counter = 0;
let currentGame = 0;
let CX = 0; 
let CY = 0; 
let selected_x = -1;
let selected_y = -1;

const CELLS = make_cell_list();
ChangeGame(0);

function make_cell_list() {
    let cells = [...document.getElementById("cell-holder").children];
    let cell_board = [];
    for (let i = 0; i < 25; i += 5) {
        cell_board.push(cells.slice(i, i + 5));
    }
    return cell_board;
}

function setup_game(starting_cells) {
    for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
            CELLS[y][x].innerHTML = starting_cells[y][x];
            checkAndChangeCellColor(CELLS[y][x]);
        }
    }
}

function checkAndChangeCellColor(cell) {
    const currentWord = cell.innerHTML;
    const wordsList = boards[currentGame].words;
    
    if (wordsList.includes(currentWord)) {
        cell.style.backgroundColor = 'white';
        cell.style.border = '10px solid rgb(255, 215, 0)';
        cell.classList.add("inactive");
        unselect(CX,CY)
    } else {
        cell.style.backgroundColor = ""; 
        cell.classList.remove("inactive"); 
    }
}


function ChangeGame(GameID) {
    currentGame = GameID;
    unselect(CX, CY);
    counter = 0;
    setup_game(boards[GameID].cells);
    document.getElementById("words").innerHTML = "Words to spell: " + boards[GameID].words.join(", ");
}

function move(x, y) {
    const currentword = CELLS[selected_y][selected_x].innerHTML + CELLS[y][x].innerHTML;
    CELLS[y][x].innerHTML = CELLS[selected_y][selected_x].innerHTML + CELLS[y][x].innerHTML;
    CELLS[selected_y][selected_x].innerHTML = "";
    select(x, y);
    counter++;
    checkAndChangeCellColor(CELLS[selected_y][selected_x]);
    checkAndChangeCellColor(CELLS[y][x]);
}

function unselect(x, y) {
    CELLS[y][x].classList.remove("selected");
    selected_x = -1;
    selected_y = -1;
}

function select(x, y) {
    if (CELLS[y][x].innerHTML.length > 0 && !CELLS[y][x].classList.contains("inactive")) {
        if (selected_x >= 0 && selected_y >= 0)
            CELLS[selected_y][selected_x].classList.remove("selected");
        CELLS[y][x].classList.add("selected");
        selected_y = y;
        selected_x = x;
    }
}

function is_close(a, b) {
    return Math.abs(a - b) <= 1;
}

function can_move(x, y) {
    let can_move = is_close(selected_x, x) && selected_y == y || is_close(selected_y, y) && selected_x == x;
    return selected_x >= 0 && selected_y >= 0 && can_move && CELLS[y][x].innerHTML.length > 0 && !CELLS[y][x].classList.contains("inactive");
}

function on_click(x, y) {
    CX = x;
    CY = y;
    if (selected_x == x && selected_y == y) {
        unselect(x, y);
    } else if (can_move(x, y)) {
        move(x, y);
    } else {
        select(x, y);
    }
}

function displayCounter() {
    const counterDisplay = document.getElementById("counter");
    counterDisplay.innerHTML = counter;
}

function reset() {
    ChangeGame(currentGame);
}

let currentHue = 0; 

function changeBackgroundColor() {
    currentHue = (currentHue + 1) % 360; 
    document.body.style.background = `linear-gradient(45deg, hsl(${currentHue}, 100%, 50%), hsl(${(currentHue + 120) % 360}, 100%, 50%))`;
}

setInterval(changeBackgroundColor, 20);
