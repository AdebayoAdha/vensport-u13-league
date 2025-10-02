import { Team, Fixture, NewsStory, User } from './types';

export class API {
  static async get<T>(type: string): Promise<T> {
    const response = await fetch(`/api/data?type=${type}`);
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  }

  static async set(type: string, data: any): Promise<void> {
    const response = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data })
    });
    if (!response.ok) throw new Error('Failed to save');
  }

  static async getTeams(): Promise<Team[]> {
    return this.get<Team[]>('teams');
  }

  static async setTeams(teams: Team[]): Promise<void> {
    return this.set('teams', teams);
  }

  static async getFixtures(): Promise<Fixture[]> {
    return this.get<Fixture[]>('fixtures');
  }

  static async setFixtures(fixtures: Fixture[]): Promise<void> {
    return this.set('fixtures', fixtures);
  }

  static async getNews(): Promise<NewsStory[]> {
    return this.get<NewsStory[]>('news');
  }

  static async setNews(news: NewsStory[]): Promise<void> {
    return this.set('news', news);
  }

  static async getDefaultRound(): Promise<string> {
    const result = await this.get<{ value: string }>('defaultRound');
    return result.value;
  }

  static async setDefaultRound(round: string): Promise<void> {
    return this.set('defaultRound', round);
  }
}