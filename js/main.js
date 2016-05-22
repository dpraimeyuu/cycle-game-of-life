import { run } from '@cycle/core';
import { makeDOMDriver } from '@cycle/dom';
import { isolate } from '@cycle/isolate';
import { restart, restartable } from 'cycle-restart';
import { Observable } from 'rx';
import App from './components/App';
import makeModelDriver from './drivers/model-driver';

const drivers = {
  DOM: restartable(makeDOMDriver('#root'), {pauseSinksWhileReplaying: false}),
  Model: makeModelDriver()
};

const {sinks, sources} = run( App, drivers );

if (module.hot) {
  module.hot.accept('./components/App', () => {
    const app = require('./components/App' ).default;
    restart(app, drivers, {sinks, sources}, isolate);
  });

}
