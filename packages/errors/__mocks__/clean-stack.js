const mock = (stack) => {
  if (mock._fail) {
    throw new Error('Clean stack mocked error!');
  }

  return stack;
};

mock._fail = false;
mock.fail = (val) => mock._fail = val;
module.exports = mock;