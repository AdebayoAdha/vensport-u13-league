import { Client } from '@upstash/qstash';

export const qstash = new Client({
  token: process.env.QSTASH_TOKEN!,
});

export async function scheduleFixtureReminder(fixtureId: string, delay: number) {
  return await qstash.publishJSON({
    url: `${process.env.VERCEL_URL || 'http://localhost:3000'}/api/jobs/fixture-reminder`,
    delay,
    body: { fixtureId }
  });
}

export async function scheduleNewsNotification(newsId: string) {
  return await qstash.publishJSON({
    url: `${process.env.VERCEL_URL || 'http://localhost:3000'}/api/jobs/news-notification`,
    body: { newsId }
  });
}