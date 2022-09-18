import './externalService';

import instance from './axios';
import { groupBy } from './utils';
import { MediaContext, Media } from './types';

const SERVICE_API = process.env.API;

export const mediaContextController = async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Promise.all works in my case because I added retry mechanism
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
          ...(mimeType && { metadata: { mimeType } }),
        };
      })
      .sort((a, b) => b.probability - a.probability);

    return res.status(200).json(groupBy(finalResp, 'context'));
  } catch (error: any) {
    console.error('Error happened', error);
    return res.status(error.response.status).json({ message: error.response.data });
  }
}