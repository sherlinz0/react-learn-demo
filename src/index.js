import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
	return (
		<button
			className="square"
			onClick={() => props.onClick()}
			style={{color: props.isWinnerPiece ? 'red' : 'black'}}
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
				isWinnerPiece={props.winnerPieces.includes(i)}
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
			isAscendingOrder: true,
		}
	}

	handleClick(i) {
		const isAscendingOrder = this.state.isAscendingOrder;
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[isAscendingOrder ? history.length - 1 : 0];
		const squares = current.squares.slice();
		if (getWinner(squares) || squares[i]) return;
		squares[i] = this.state.xIsNext
			? 'X'
			: 'O';
		this.setState({
			history: isAscendingOrder
				? history.concat([{
					squares: squares,
					coordinate: {
						column: Math.floor(i / 3) + 1,
						row: (i % 3) + 1,
					},
				}])
				: [{
					squares: squares,
					coordinate: {
						column: Math.floor(i / 3) + 1,
						row: (i % 3) + 1,
					},
				}].concat(history)
			,
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

	switchOrder() {
		this.setState({
			history: this.state.history.reverse(),
			isAscendingOrder: !this.state.isAscendingOrder,
		})
	}

	render() {
		const isAscendingOrder = this.state.isAscendingOrder;
		const history = this.state.history;
		const stepNumber = this.state.stepNumber;
		const current = history[isAscendingOrder ? stepNumber : history.length - stepNumber - 1];
		const winner = getWinner(current.squares);
		let status;

		if (winner) {
			status = `Winner: ${winner}`;
		} else {
			if (stepNumber === 9) {
				status = 'Level the score!';
			} else {
				status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
			}
		}

		const moves = history.map((step, move) => {
			const desc = step.squares.toString() !== Array(9).fill(null).toString()
				? `Go to move #${isAscendingOrder ? move : history.length - move - 1} ( ${history[move].coordinate.column}, ${history[move].coordinate.row} )`
				: 'Go to game start';
			return (
				<li key={isAscendingOrder ? move : history.length - move - 1}>
					<button
						style={{color: isAscendingOrder ? stepNumber === move ? 'blue' : 'black' : history.length - stepNumber - 1 === move ? 'blue' : 'black'}}
						onClick={() => this.jumpTo(isAscendingOrder ? move : history.length - move - 1)}>{desc}</button>
				</li>
			);
		})

		return (
			<div className="game">
				<div className="game-board">
					<Board squares={current.squares} onClick={(i) => this.handleClick(i)}
					       winnerPieces={getWinnerPieces(current.squares)}/>
				</div>
				<div className="game-info">
					<div style={{color: status.includes('Next') ? 'black' : 'red'}}>{status}</div>
					<button onClick={() => this.switchOrder()}>Current
						order: {isAscendingOrder ? 'Ascending Order' : 'Descending Order'}</button>
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
			return [a, b, c];
		}
	}
	return null;
}

function getWinnerPieces(squares) {
	return calculateWinner(squares) || [, ,];
}

function getWinner(squares) {
	const preData = calculateWinner(squares);
	return preData && squares[preData[0]];
}
