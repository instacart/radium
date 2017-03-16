/* @flow */

import getStateKey from './get-state-key';

const getState = function(
  state: {_radiumStyleState: {[key: string]: {[value: string]: boolean}}},
  elementKey: string,
  value: string,
): any {
  const key = getStateKey(elementKey);

  return !!state &&
    !!state._radiumStyleState &&
    !!state._radiumStyleState[key] &&
    state._radiumStyleState[key][value];
};

export default getState;
