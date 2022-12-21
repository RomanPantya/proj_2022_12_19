import type * as types from '@jest/types';

export default async (): Promise<types.Config.InitialOptions> => ({
    verbose: true,
    testEnvironment: 'node',
    detectOpenHandles: true,
    detectLeaks: true,
    preset: 'ts-jest',
    rootDir: '.',
    globalSetup: '<rootDir>/__tests__/jest.global-setup.ts',
    testRegex: '.+\\.(test|spec|e2e)\\.ts$',
});
