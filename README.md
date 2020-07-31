
# Algebraic Effects
Manage your effects in a pure and composible way using algebraic effects with multiple continuations. [https://phenax.github.io/algebraic-effects](https://phenax.github.io/algebraic-effects)

[![CircleCI](https://img.shields.io/circleci/project/github/phenax/algebraic-effects/master.svg?style=for-the-badge)](https://circleci.com/gh/phenax/algebraic-effects)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@algebraic-effects/core.svg?style=for-the-badge)](https://www.npmjs.com/package/@algebraic-effects/core)
[![Codecov](https://img.shields.io/codecov/c/github/phenax/algebraic-effects.svg?style=for-the-badge)](https://codecov.io/gh/phenax/algebraic-effects)


<a href="https://liberapay.com/phenax/donate"><img alt="Donate using Liberapay" src="https://liberapay.com/assets/widgets/donate.svg"></a>

[Documentation](https://phenax.github.io/algebraic-effects)


## Install

### To add the project to your project
```bash
yarn add @algebraic-effects/core
```

If you want effects like Exception, State, Random, etc.
```bash
yarn add @algebraic-effects/core @algebraic-effects/effects
```


## Usage

### Import it to your file
```js
import { createEffect, func } from '@algebraic-effects/core';
import { sleep } from '@algebraic-effects/core/generic';
```


### State effect counter example

```js
import { State } from '@algebraic-effects/effects';
import { call, sleep } from '@algebraic-effects/core/generic';

const countdown = function*() {
  const count = yield State.get();

  if(count > 0) {
    yield State.set(count - 1); // Decrement count
    yield sleep(1000); // Add a delay of 1 second
    yield call(countdown); // Recursively call the program again.
  }
}

State.of(10)(countdown)
  .fork(() => {}, () => alert('HAPPY NEW YEAR!!!!'));
```


### Creating your own effects

* Declare your effects
```js
import { createEffect, func } from '@algebraic-effects/core';

export const ConsoleEffect = createEffect('ConsoleEffect', {
  log: func(['...data']),
});

export const ApiEffect = createEffect('ApiEffect', {
  fetchUser: func(['userid'], 'user'),
  markUserAsViewed: func(['userid']),
});
```
`func` function allows you to document the operation signature.



* Write your program
```js
const fetchProfile = function*(uid) {
  const user = yield ApiEffect.fetchUser(uid);

  yield ConsoleEffect.log('>> Fetched user user', uid);

  if(user.isPublic) {
    yield ApiEffect.markUserAsViewed(user.id);
    yield ConsoleEffect.log('>> Marked', uid, 'as viewed');
    return user;
  }

  return { id: uid, name: user.name, isPrivate: true };
}
```


* Implement effect operation behavior
```js
const logger = ConsoleEffect.handler({
  log: ({ resume }) => (...args) => {
    console.log(...args);
    resume();
  },
});

const api = ApiEffect.handler({
  markUserAsViewed: ({ resume, throwError }) =>
    uid => fetchJson(`/user/${uid}/mark-as-viewed`).then(resume).catch(throwError),
  fetchUser: ({ promise }) => uid => promise(fetchJson(`/user/${uid}`)),
});
```
`promise` is a shorthand for doing `.then(resume).catch(throwError)`


* Calling your program
```js
api.with(logger) // Compose your effect handlers together and run them
  .run(fetchProfile)
  .fork(
    e => { /* Handle error */ },
    user => { /* Handle success */ }
  )
```



### Multiple continuations
You can call resume multiple times from your operation synchronously.

```js
function flipCoins() {
  const isHead1 = yield Random.flipCoin(2);
  const isHead2 = yield Random.flipCoin(2);
  return [isHead1 ? 'H' : 'T', isHead2 ? 'H' : 'T'];
}

// // runMulti method will start your program in multiple continuations mode
Random.seed(10)
  .runMulti(flipCoins)
  .fork(identity, data => {
    console.log(data); // Probably [[H, T], [H, T], [T, H], [T, T]]
  });
```


##### Writing custom effect with multiple continuations

```js
const ListEffect = createEffect('ListEffect', {
  takeItem: func(['list'], '*', { isMulti: true }), // isMulti flag indicates that this operation resumes multiple times
});

// Program will resolve with [3, 4, 6, 7]
function *program() {
  const item1 = yield ListEffect.takeItem([ 1, 4 ]);
  const item2 = yield ListEffect.takeItem([ 2, 3 ]);

  return item1 + item2;
}

const looper = ListEffect.handler({
  takeItem: ({ resume }) => list => list.forEach(resume),
});

// runMulti method will start your program in multiple continuations mode
looper.runMulti(program).fork(
  handleError,
  data => {
    console.log(data); // [3, 4, 6, 7]
  }
);
```


## Contributing

* [Code of Conduct](./CODE_OF_CONDUCT.md)

* [Contributing Guide](./CONTRIBUTING.md)

* [Good first issues/Help wanted](https://github.com/phenax/algebraic-effects/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22+label%3A%22help+wanted%22)


### License
Algebraic effects is under [MIT licensed](./LICENSE).
