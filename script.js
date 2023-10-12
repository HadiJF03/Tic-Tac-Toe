const GameBoard = (function() {
    const gameBoard = [];


    for(let i = 0; i<3;i++){
        gameBoard[i] = [];
        for(let j = 0; j<3;j++){
            gameBoard[i].push(cell())
        }
        
    }
    const getBoard = ()=>gameBoard;

    const boardDiv = ()=>{
        const div = document.querySelector(".gameboard");
        return div;
    }
    
    return {getBoard,boardDiv};
});

function cell() {
    let value = " ";
    const div = document.createElement("div");
    div.innerHTML = value;
    div.classList.add("cell");
    const getValue = ()=>value;

    const setValue = (symbol)=> {
        if(value==" "){
            value = symbol;
            div.innerHTML = value;
        }
    }
    const getDiv = ()=>div;

    return {getValue,getDiv,setValue};
}
function screenController(){
    let game;
    const gameB = GameBoard();
    const board = gameB.getBoard();
    const boardDiv = gameB.boardDiv();
    const start = document.querySelector(".submit");
    const reset = document.querySelector(".reset");
    const menuContainer = document.querySelector(".menu");
    const player1 = document.querySelector("#p-one");
    const player2 = document.querySelector("#p-two");
    const resetGame = ()=>{
        boardDiv.innerHTML = "";
        boardDiv.classList.add("hidden");
        reset.classList.add("hidden");
        menuContainer.classList.remove('hidden');
        screenController();
        
    }
    reset.addEventListener('click',resetGame);

    const menuControl = ()=>{
        menuContainer.classList.add("hidden");
        boardDiv.classList.remove("hidden");
        reset.classList.remove("hidden");
        game = gameController(player1.value,player2.value);
        
    }
    start.addEventListener('click',menuControl);

    const updateScreen = ()=>{
        for(let i = 0; i<3;i++){
            for(let j = 0 ; j<3;j++){
                board[i][j].getDiv().addEventListener('click', ()=>{
                    const footer = document.querySelector('.footer');
                    let activeSymbol = game.getSymbol();
                    board[i][j].setValue(activeSymbol);
                    if(checkForDraw(board)) footer.textContent = "It's A Draw!!!!";
                    if(checkForWin(board)) footer.textContent = game.getActivePlayer().playerName + " WINS!!!!";
                    game.switchActive();
                })
                boardDiv.appendChild(board[i][j].getDiv());
            }
        }
    }
    updateScreen();

}
function gameController(playerOneName, playerTwoName){
    
    let board = GameBoard().getBoard();
    let winner = false;
    const player=[{
        playerName: playerOneName,
        symbol: "X",
    },{
        playerName: playerTwoName,
        symbol:"O"
    }];
    let activePlayer = player[0];
    const getActivePlayer = ()=> activePlayer;
    const getSymbol = ()=> activePlayer.symbol;

    const switchActive = ()=> activePlayer = activePlayer == player[0] ? player[1]:player[0];
    
    return {getActivePlayer,switchActive,getSymbol};
}
function checkForWin(board){
    const rowWin = ()=>{
        for(let i = 0; i<3;i++){
            if(board[i].every((e) =>e.getValue()=="X") || board[i].every((e) =>e.getValue()=="O")) return true;
        }
        return false;
    }
    const colWin = ()=>{
        for(let i =0; i<3;i++){
            let column = [];
            for(let j = 0; j<3;j++){
                column.push(board[j][i]);
            }
            if(column.every((e)=>e.getValue()=="X") || column.every((e)=>e.getValue()=="O")) return true;
        }
        return false;
    }
    const diagonalWin = ()=>{
        let diagonal1 = [];
        let diagonal2 = [];
        for(let i = 0; i<3;i++){
            diagonal1.push(board[i][i]);
            diagonal2.push(board[i][2-i]);
        }
        if(diagonal1.every((e)=>e.getValue()=="X") || diagonal1.every((e)=>e.getValue()=="O")) return true;
        if(diagonal2.every((e)=>e.getValue()=="X") || diagonal2.every((e)=>e.getValue()=="O")) return true;
        return false;
    }
    
    return diagonalWin() || rowWin() || colWin();
}
function checkForDraw(board){
    let full = true;
    for(let i = 0; i<3;i++){
        for(let j =0;j<3;j++){
            if(board[i][j].getValue()==" ") full=false;
        }
    }
    return full;
}
screenController();