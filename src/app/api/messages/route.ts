import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import { Message, Conversation } from '@/models/Message';
import User from '@/models/User';

// Get conversations for current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const conversations = await Conversation.find({
      participants: session.user.id
    })
    .populate('participants', 'name email image')
    .populate('lastMessage')
    .sort({ updatedAt: -1 })
    .lean();

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Send a new message
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { receiverId, content, conversationId } = await request.json();

    if (!receiverId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    let conversation;
    
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
    } else {
      // Create new conversation
      conversation = await Conversation.findOne({
        participants: { $all: [session.user.id, receiverId] }
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [session.user.id, receiverId],
          unreadCount: {
            [receiverId]: 0,
            [session.user.id]: 0
          }
        });
      }
    }

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Create message
    const message = await Message.create({
      sender: session.user.id,
      receiver: receiverId,
      content,
      conversationId: conversation._id,
      messageType: 'text'
    });

    // Update conversation
    conversation.lastMessage = message._id;
    conversation.unreadCount.set(receiverId, (conversation.unreadCount.get(receiverId) || 0) + 1);
    await conversation.save();

    // Populate message with sender info
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email image')
      .lean();

    return NextResponse.json({ 
      message: populatedMessage,
      conversation: conversation 
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}