import axios from 'axios';

const baseURL: string = 'https://web2markdown-api.vercel.app/api/convert';

export interface Content {
  url: string;
  data: string;
  title?: string;
  domain?: string;
}

export async function scrapContent(url: string): Promise<Content> {
  try {
    const response = await axios.post(baseURL, {
      url: url
    })
    return response.data as Content;
  } catch (err) {
    console.error(err);
    throw err;
  }
}