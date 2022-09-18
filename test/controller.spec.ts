import '../src/environment';
import axiosMock from '../src/axios';

import { mediaContextController } from '../src/controller';

const mockData = {
  data: [
    { id: '123-abc', context: 'front', probability: 0.2 },
    { id: '999-abc', context: 'front', probability: 0.9 },
    { id: '321-abc', context: 'back', probability: 1 },
  ],
};

describe('mediaContextController', () => {
  beforeEach(() => {
    // This will mock external service
    axiosMock.get = () => new Promise<any>(resolve => resolve(mockData));
  });

  it('should return properly formatted data response', async () => {
    const mockRequest = { params: { sessionId: '123' } };
    const mockResponse = { status: function() { return this; }, json: jest.fn() };

    await mediaContextController(mockRequest, mockResponse);

    const result = mockResponse.json.mock.calls[0][0];

    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(result['document-front']).toBeTruthy();
    expect(result['document-back']).toBeTruthy();

    // sorting
    expect(result['document-front'][0].probability).toBe(0.9);
  })
});
