import axios from 'axios';

const contextResponse = {
  'document-back': [
    {
      context: 'document-back',
      id: 'a4338068-d99b-416b-9b2d-ee8eae906eea',
      probability: 0.9739324,
      media: {
        id: 'a6c90b4f-ddfc-49eb-89ad-05b7f1274f96',
        mimeType: 'image/png',
      }
    },
  ],
  'document-front': [
    {
      context: 'document-front',
      id: '2ab2e6fe-6727-4a04-bbdf-9f012569bce9',
      probability: 0.9264236,
      media: {
        id: '40851916-3e86-45cd-b8ce-0e948a8a7751',
        mimeType: 'image/png'
      },
    },
    {
      context: 'document-front',
      id: '5da01045-6baf-482c-9913-5ce069bbec96',
      probability: 0.8734357,
      media: {
        id: '7f2dcbd8-5b5f-4f1a-bfa4-016ddf4dd662',
        mimeType: 'image/png'
      },
    },
    {
      context: 'document-front',
      id: '93d1a76b-b133-41cc-ae85-aa8b80d93f57',
      probability: 0.2931033,
      media: {
        id: '40f1e462-6db8-4313-ace3-83e4f5619c56',
        mimeType: 'image/png'
      },
    },
  ],
}

describe('GET http://localhost:3000/api/sessions/:sessionId', () => {
  it('should return session with media', async () => {
    const response = await axios.get('http://localhost:3000/api/sessions/90d61876-b99a-443e-994c-ba882c8558b6');
    expect(response.status).toEqual(200);
    expect(response.data).toMatchObject(contextResponse);
  });
});
