// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const logError = (...error: any) => {
  console.log('%clogError', 'background: red; color: white', error);

  const context = {
    tags: {
      // additional data to be grouped as "tags"
      subscription: 'LogByConsole',
    },
  };
};
