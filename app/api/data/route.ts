import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@/lib/storage';
import { scheduleFixtureReminder, scheduleNewsNotification } from '@/lib/qstash';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    switch (type) {
      case 'teams':
        return NextResponse.json(await Storage.getTeams());
      case 'fixtures':
        return NextResponse.json(await Storage.getFixtures());
      case 'news':
        return NextResponse.json(await Storage.getNews());
      case 'users':
        return NextResponse.json(await Storage.getUsers());
      case 'defaultRound':
        return NextResponse.json({ value: await Storage.getDefaultRound() });
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { type, data } = await request.json();

  try {
    switch (type) {
      case 'teams':
        await Storage.setTeams(data);
        break;
      case 'fixtures':
        await Storage.setFixtures(data);
        // Schedule reminders for new fixtures
        for (const fixture of data) {
          if (!fixture.homeScore && !fixture.awayScore) {
            const matchDate = new Date(fixture.date + ' ' + fixture.time);
            const reminderTime = matchDate.getTime() - Date.now() - (24 * 60 * 60 * 1000); // 24h before
            if (reminderTime > 0) {
              await scheduleFixtureReminder(fixture.id, reminderTime);
            }
          }
        }
        break;
      case 'news':
        await Storage.setNews(data);
        // Schedule notifications for new articles
        const existingNews = await Storage.getNews();
        const newArticles = data.filter((article: any) => 
          !existingNews.find(existing => existing.story === article.story)
        );
        for (const article of newArticles) {
          await scheduleNewsNotification(article.story);
        }
        break;
      case 'users':
        await Storage.setUsers(data);
        break;
      case 'defaultRound':
        await Storage.setDefaultRound(data);
        break;
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}