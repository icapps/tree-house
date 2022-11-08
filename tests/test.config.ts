// Overwrite error console.logs
console.log = jest.fn(() => <unknown>{});
console.error = jest.fn(() => <unknown>{});
