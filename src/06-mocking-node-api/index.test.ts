import fs from 'fs';
import path from 'path';
import fsPromises from 'fs/promises';
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';

jest.mock('fs');
jest.mock('fs/promises');

const fsMock = jest.mocked(fs);
const fsPromisesMock = jest.mocked(fsPromises);

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;
    const timeoutSpy = jest.spyOn(global, 'setTimeout');

    doStuffByTimeout(callback, timeout);

    expect(timeoutSpy).toHaveBeenCalledTimes(1);
    expect(timeoutSpy).toHaveBeenCalledWith(callback, timeout);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;

    doStuffByTimeout(callback, timeout);

    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(timeout);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;
    const timeoutSpy = jest.spyOn(global, 'setInterval');

    doStuffByInterval(callback, timeout);

    expect(timeoutSpy).toHaveBeenCalledTimes(1);
    expect(timeoutSpy).toHaveBeenCalledWith(callback, timeout);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    const timeout = 1000;

    doStuffByInterval(callback, timeout);

    expect(callback).not.toHaveBeenCalled();

    const intervals = 10;
    jest.advanceTimersByTime(timeout * intervals);
    expect(callback).toHaveBeenCalledTimes(intervals);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const pathTo = 'path/to/file';
    const joinSpy = jest.spyOn(path, 'join');
    readFileAsynchronously(pathTo);
    expect(joinSpy).toHaveBeenCalledWith(expect.any(String), pathTo);
  });

  test('should return null if file does not exist', async () => {
    fsMock.existsSync.mockReturnValueOnce(false);
    await expect(readFileAsynchronously('path/to/file')).resolves.toBeNull();
  });

  test('should return file content if file exists', async () => {
    const fileContent = 'content';
    fsMock.existsSync.mockReturnValueOnce(true);
    fsPromisesMock.readFile.mockResolvedValueOnce(Buffer.from(fileContent));
    await expect(readFileAsynchronously('path/to/file')).resolves.toBe(
      fileContent,
    );
  });
});
