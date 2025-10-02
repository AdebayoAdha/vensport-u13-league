import { kv } from '@vercel/kv';
import { Team, Fixture, NewsStory, User } from './types';

export class Storage {
  static async getTeams(): Promise<Team[]> {
    return await kv.get('teams') || [];
  }

  static async setTeams(teams: Team[]): Promise<void> {
    await kv.set('teams', teams);
  }

  static async getFixtures(): Promise<Fixture[]> {
    return await kv.get('fixtures') || [];
  }

  static async setFixtures(fixtures: Fixture[]): Promise<void> {
    await kv.set('fixtures', fixtures);
  }

  static async getNews(): Promise<NewsStory[]> {
    return await kv.get('newsStories') || [];
  }

  static async setNews(news: NewsStory[]): Promise<void> {
    await kv.set('newsStories', news);
  }

  static async getUsers(): Promise<User[]> {
    return await kv.get('users') || [];
  }

  static async setUsers(users: User[]): Promise<void> {
    await kv.set('users', users);
  }

  static async getDefaultRound(): Promise<string> {
    return await kv.get('defaultRound') || '1';
  }

  static async setDefaultRound(round: string): Promise<void> {
    await kv.set('defaultRound', round);
  }
}