import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
	return (
		<button
			className="square"
			onClick={() => props.onClick()}
		>
			{props.value}
		</button>
	);
}

function Board(props) {
	function renderSquare(i) {
		return (
			<Square
				value={props.squares[i]}
				onClick={() => props.onClick(i)}
			/>
		);
	}

	return (
		<div>
			{
				Array(3).fill(null).map((valueOuter, indexOuter) => {
					return (
						<div className="board-row">
							{
								Array(3).fill(null).map((valueInner, indexInner) => {
									return renderSquare(indexOuter * 3 + indexInner);
								})
							}
						</div>
					);
				})
			}
		</div>
	);
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill(null),
				coordinate: {
					column: null,
					row: null,
				},
			},],
			stepNumber: 0,
			xIsNext: true,
		}
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if (calculateWinner(squares) || squares[i]) return;
		squares[i] = this.state.xIsNext
			? 'X'
			: 'O';
		this.setState({
			history: history.concat([{
				squares: squares,
				coordinate: {
					column: Math.floor(i / 3) + 1,
					row: (i % 3) + 1,
				},
			}]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
		})

	}

	jumpTo(move) {
		this.setState({
			stepNumber: move,
			xIsNext: move % 2 === 0,
		})
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);
		const status = winner
			? `Winner: ${winner}`
			: `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
		const moves = history.map((step, move) => {
			const desc = move
				? `Go to move #${move} ( ${history[move].coordinate.column}, ${history[move].coordinate.row} )`
				: 'Go to game start';
			return (
				<li key={move}>
					<button style={{color: this.state.stepNumber === move ? 'blue' : 'black'}}
					        onClick={() => this.jumpTo(move)}>{desc}</button>
				</li>
			);
		})

		return (
			<div className="game">
				<div className="game-board">
					<Board squares={current.squares} onClick={(i) => this.handleClick(i)}/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}

// ========================================

ReactDOM.render(
	<Game/>,
	document.getElementById('root')
);

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];

	for (const [a, b, c] of lines) {
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	return null;
}
