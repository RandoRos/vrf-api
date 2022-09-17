import express from 'express';
import axios from 'axios';

import './environment';
import './externalService';

import { initAxiosMiddleware } from './middleware/axiosMiddleware';

import { groupBy } from './utils';
import { MediaContext, Media } from './types';

const SERVICE_API = process.env.API;

const app = express();
const port = 3000;

const instance = axios.create(<object>{
  retry: Number(process.env.AXIOS_RETRY_COUNT),
});

initAxiosMiddleware(instance);

app.get('/api/sessions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const [ contextData, mediaData ] = await Promise.all([
      instance.get<MediaContext[]>(`${SERVICE_API}/media-context/${sessionId}`),
      instance.get<Media[]>(`${SERVICE_API}/sessions/${sessionId}/media`),
    ]);

    const finalResp = contextData.data
      .filter(data => data.context !== 'none') // O(n), can also be removed and filter inside map
      .map(context => {
        const { mimeType } = mediaData.data.find(media => media.id === context.mediaId) || {};
        return {
          ...context,
          context: `document-${context.context}`,
          metadata: {
            mimeType,
          }
        };
      })
      .sort((a, b) => (b?.probability || 0) - (a?.probability || 0));

    return res.status(200).json(groupBy(finalResp, 'context'));
  } catch (error: any) {
    console.error('Error happened', error);
    return res.status(error.response.status).json({ message: error.response.data });
  }
});

app.listen(port, () => {
  console.info(`Service is listening at http://localhost:${port}`);
});
