module.exports = {
    roots: [
        "<rootDir>/"
    ],
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    setupFiles: ["<rootDir>/tests/bootstrap-tests.ts"]
};