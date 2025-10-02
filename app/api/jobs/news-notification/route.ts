import { NextRequest, NextResponse } from 'next/server';
import { verifySignatureAppRouter } from '@upstash/qstash/nextjs';
import { Storage } from '@/lib/storage';

async function handler(request: NextRequest) {
  const { newsId } = await request.json();
  
  try {
    const news = await Storage.getNews();
    const article = news.find(n => n.story === newsId);
    
    if (article) {
      console.log(`News notification: ${article.title}`);
      // Add notification logic here
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process notification' }, { status: 500 });
  }
}

export const POST = verifySignatureAppRouter(handler);