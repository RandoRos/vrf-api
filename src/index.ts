import express from 'express';
import axios from 'axios';

import './externalService';

import { groupBy } from './utils';
import { MediaContext, Media } from './types';

const SERVICE_API = 'https://api.veriff.internal';

const app = express();
const port = 3000;

app.get('/api/sessions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const { data: contextData } = await axios.get<MediaContext[]>(`${SERVICE_API}/media-context/${sessionId}`);
    const { data: mediaData } = await axios.get<Media[]>(`${SERVICE_API}/sessions/${sessionId}/media`);

    const finalResp = contextData
      .filter(data => data.context !== 'none') // O(n), can also be removed and filter inside map
      .map(context => {
        const { mimeType } = mediaData.find(media => media.id === context.mediaId) || {};
        return {
          ...context,
          context: `document-${context.context}`,
          mimeType,
        };
      })
      .sort((a, b) => b.probability - a.probability);

    return res.status(200).json(groupBy(finalResp, 'context'));
  } catch (error: any) {
    console.error('Error happened', error);
    return res.status(error.response.status).json({ message: error.response.data });
  }
});

app.listen(port, () => {
  console.info(`Service is listening at http://localhost:${port}`);
});
