import { NextRequest, NextResponse } from 'next/server';
import { verifySignatureAppRouter } from '@upstash/qstash/nextjs';
import { Storage } from '@/lib/storage';

async function handler(request: NextRequest) {
  const { fixtureId } = await request.json();
  
  try {
    const fixtures = await Storage.getFixtures();
    const fixture = fixtures.find(f => f.id === fixtureId);
    
    if (fixture && !fixture.homeScore && !fixture.awayScore) {
      console.log(`Reminder: Match ${fixture.homeTeam} vs ${fixture.awayTeam} on ${fixture.date}`);
      // Add notification logic here
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process reminder' }, { status: 500 });
  }
}

export const POST = verifySignatureAppRouter(handler);