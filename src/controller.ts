import './externalService';

import instance from './axios';
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

    // Maybe not so 'nice' but reduces execution time
    const finalResp = contextData.data
      .sort((a, b) => b.probability - a.probability)
      .reduce((res, ctx) => {
        if (ctx.context === 'none') {
          return res;
        }

        const { id, mimeType } = mediaData.data.find(media => media.id === ctx.mediaId) || {};
        const key = `document-${ctx.context}`;

        if (!res[key]) {
          res[key] = [];
        }

        res[key].push({
          id: ctx.id,
          context: key,
          probability: ctx.probability,
          media: { 
            id,
            mimeType,
          },
        });

        return res;
      }, {});


    return res.status(200).json(finalResp);
  } catch (error: any) {
    console.error('Error happened', error);
    return res.status(error.response?.status || error.status).json({ message: error.response?.data || error.message });
  }
}
