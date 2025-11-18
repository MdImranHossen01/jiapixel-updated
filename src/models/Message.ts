import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  content: string;
  conversationId: mongoose.Types.ObjectId;
  messageType: 'text' | 'file' | 'system';
  read: boolean;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  lastMessage: mongoose.Types.ObjectId;
  unreadCount: { [userId: string]: number };
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    sender: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    receiver: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    content: { 
      type: String, 
      required: true 
    },
    conversationId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Conversation', 
      required: true 
    },
    messageType: { 
      type: String, 
      enum: ['text', 'file', 'system'], 
      default: 'text' 
    },
    read: { 
      type: Boolean, 
      default: false 
    },
    attachments: [{ 
      type: String 
    }],
  },
  { 
    timestamps: true 
  }
);

const ConversationSchema = new Schema<IConversation>(
  {
    participants: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    }],
    lastMessage: { 
      type: Schema.Types.ObjectId, 
      ref: 'Message' 
    },
    unreadCount: {
      type: Map,
      of: Number,
      default: {}
    }
  },
  { 
    timestamps: true 
  }
);

// Indexes for better performance
MessageSchema.index({ conversationId: 1, createdAt: -1 });
ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ updatedAt: -1 });

export const Message = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);
export const Conversation = mongoose.models.Conversation || mongoose.model<IConversation>('Conversation', ConversationSchema);