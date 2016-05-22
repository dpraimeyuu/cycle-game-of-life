import { Observable } from 'rx';
import { div } from '@cycle/dom';
import Board from './Board';
import {
  updateCells,
  createMatrix,
  initializeMatrix,
} from '../utils/utils';

const boardSize = 30;
const initMatrix = initializeMatrix(createMatrix(boardSize, boardSize));

function App({DOM, Model}) {
  const time$ = Observable.timer(0, 1000);
  const model$ = Model
    .startWith(initMatrix);

  const boardComponent = Board({model$});
  const boardVTree$ = boardComponent.DOM;
  const vTree$ = boardVTree$.map((boardVTree) =>
            div({className: 'app'}, [
              boardVTree
            ])
        );

  const sinks = {
    DOM: vTree$,
    Model: time$
      .withLatestFrom(model$, (t, model) => model)
      .scan((acc, item) => updateCells({model: item}))
  };

  return sinks;
}

export default App;
