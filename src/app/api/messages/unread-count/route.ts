import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import { Conversation } from '@/models/Message';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const conversations = await Conversation.find({
      participants: session.user.id
    });

    const totalUnread = conversations.reduce((count, conversation) => {
      return count + (conversation.unreadCount.get(session.user.id) || 0);
    }, 0);

    return NextResponse.json({ count: totalUnread });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}