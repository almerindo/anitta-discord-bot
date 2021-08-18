
it('s', () => {
  const warn = jest.spyOn(global.console, 'warn');

  expect.hasAssertions();
  expect(warn).toBeCalled();
});
