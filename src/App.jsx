import { useState } from 'react';
import confetti from 'canvas-confetti';
import { checkEndGame, checkWinnerFrom } from './logic/board';
import { WinnerModal } from './components/WinnerModal';
import { Square } from './components/Square';
import { Board } from './components/Board';
import { TURNS } from './constants';
import { resetGameStorage, saveGameToStorage } from './logic/storage';

function App() {
	const [board, setBoard] = useState(() => {
		const boardFromStorage = localStorage.getItem('board');
		return boardFromStorage
			? JSON.parse(boardFromStorage)
			: Array(9).fill(null);
	});
	const [turn, setTurn] = useState(() => {
		const turnFromStorage = localStorage.getItem('turn');
		return turnFromStorage ?? TURNS.X;
	});
	const [winner, setWinner] = useState(null); //null no hay ganador, false es un empate

	const resetGame = () => {
		setBoard(Array(9).fill(null));
		setTurn(TURNS.X);
		setWinner(null);
		resetGameStorage();
	};

	const updateBoard = index => {
		//no actualizamos esta posición si ya tiene algo
		if (board[index] || winner) return;

		//Actualizar el tablero
		const newBoard = [...board];
		newBoard[index] = turn;
		setBoard(newBoard);

		//Cambiar el turno
		const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
		setTurn(newTurn);

		//guardar partida
		saveGameToStorage(newBoard, newTurn);

		//revisar si hay ganador
		const newWinner = checkWinnerFrom(newBoard);
		if (newWinner) {
			confetti();
			setWinner(newWinner);
		} else if (checkEndGame(newBoard)) {
			setWinner(false);
		}
	};

	return (
		<main className="board">
			<h1>Tic Tac Toe</h1>
			<button onClick={resetGame}>Reset del juego</button>
			<Board board={board} updateBoard={updateBoard} />
			<section className="turn">
				<Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
				<Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
			</section>
			<WinnerModal winner={winner} resetGame={resetGame} />
		</main>
	);
}

export default App;
