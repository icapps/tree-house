// Overwrite error console.logs
console.log = jest.fn(() => { });
console.error = jest.fn(() => { });
