import { range, prop } from 'ramda';
import { div } from '@cycle/dom';

const directions = getDirections();

function fitsInMatrixSize(size, index){
  return ((index < size) && (index > -1))
}

/* RULES:
* if cell has N(eighbours) < 2 then it dies
* if cell has N === 2 || N === 3 then it survives
* if cell has N > 3 then it dies
* if cell has N === 3 then it becomes live
*/

function willLive(neighboursCount) {
  if(neighboursCount < 2) return false;
  if(neighboursCount > 3) return false;
  if(neighboursCount === 2 || neighboursCount === 3) return true;
}

function getAliveNeighbourCount(matrix, {x, y}) {
  const size = matrix.length - 1;

  const neighbours = Object.keys(directions)
    .map((key) => directions[key])
    .reduce((neighbours, {dx, dy}) => {
      const isNeighbourAvailable = fitsInMatrixSize(size, x + dx) && fitsInMatrixSize(size, y + dy);
        if(isNeighbourAvailable){
          let neighbour = matrix[x + dx][y + dy];

          return [...neighbours, neighbour];
        }

        return [...neighbours];
    }, []);

    const count = neighbours
    .filter((cell) => cell.isAlive)
    .length;

    return count;
}

function updateCells ({model: cells, t}) {
  const newCells = cells.map((column) => column.map((currentCell) => {
    const count = getAliveNeighbourCount(cells, currentCell);
    const {x, y} = currentCell;
    const willAlive = willLive(count);
    const className = willAlive? 'cell--alive' : 'cell--dead';
    const updatedCell = {x, y, cell: createCell(x, y, className), isAlive: willAlive};

    return updatedCell;
  }));

  return newCells;
}

function getTotalAliveCells(cells) {
  const total = cells.reduce((total, column) =>
          total + column.filter(({isAlive}) => !isAlive).length, 0);

   return total;
}

function createCell(x, y, stateClassName){
  return div(`#cell-${x}-${y}`, {
    className: `cell ${stateClassName}`
  });
}

function createMatrix(rows, columns){
  const rowsList = range(0, rows);
  const singleColumn = range(0, columns);
  const matrix = rowsList
    .map((row) => [...singleColumn]);

  return matrix;
}

function initializeMatrix(matrix, aliveProbability = 0.4){
  return matrix
    .map((column, rowIndex) => column
      .map((columnIndex) => {
        const isAlive = Math.random() < aliveProbability;

        return ({
        isAlive,
        cell: createCell(rowIndex, columnIndex, isAlive? 'cell--dead' : 'cell--alive'),
        x: rowIndex,
        y: columnIndex
      })}
    ));
}

function getDirections(){
  return {
    N: {
      dx: 0,
      dy: -1
    },
    S: {
      dx: 0,
      dy: 1
    },
    W: {
      dx: -1,
      dy: 0
    },
    E: {
      dx: 1,
      dy: 0
    },
    NE: {
      dx: 1,
      dy: -1
    },
    NW: {
      dx: -1,
      dy: -1
    },
    SE: {
      dx: 1,
      dy: 1
    },
    SW: {
      dx: -1,
      dy: 1
    }
  }
}

const tappableLog = (x) => !console.log(x) && x;

export {
  fitsInMatrixSize,
  willLive,
  getAliveNeighbourCount,
  updateCells,
  getTotalAliveCells,
  createCell,
  createMatrix,
  initializeMatrix,
  getDirections,
  tappableLog
}
