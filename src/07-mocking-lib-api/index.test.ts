import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
jest.mock('lodash', () => ({
  __esModule: true,
  ...jest.requireActual('lodash'),
  throttle: jest.fn((fn) => fn),
}));

const axiosMock = jest.mocked(axios);

describe('throttledGetDataFromApi', () => {
  beforeEach(() => {
    axiosMock.create.mockReturnValue(axiosMock);
    axiosMock.get.mockResolvedValue({ data: null });
  });

  test('should create instance with provided base url', async () => {
    await throttledGetDataFromApi('path');
    expect(axiosMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: 'https://jsonplaceholder.typicode.com',
      }),
    );
  });

  test('should perform request to correct provided url', async () => {
    const urlPath = 'path';
    await throttledGetDataFromApi(urlPath);
    expect(axiosMock.get).toHaveBeenCalledWith(urlPath);
  });

  test('should return response data', async () => {
    const data = { someData: '123' };
    axiosMock.get.mockResolvedValueOnce({ data });
    await expect(throttledGetDataFromApi('path')).resolves.toEqual(data);
  });
});
