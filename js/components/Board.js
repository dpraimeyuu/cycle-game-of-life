import { Observable } from 'rx';
import { div, h1 } from '@cycle/dom';
import { range, prop, map } from 'ramda';

const getCellsDOM = map(prop('cell'));
const getBoard = (model) => div('#board', {
      className: 'board'
    }, [
      model
        .map((column, columnIndex) =>
          {
            return div(`#column-${columnIndex}`, {
            className: 'column'
          },
            getCellsDOM(column)
          )
        }
        )
    ]
  );

function Board({model$}) {
  const boardVTree$ = model$
    .map(getBoard);

  const sinks = {
    DOM: boardVTree$,
  };

  return sinks;
}

export default Board;
