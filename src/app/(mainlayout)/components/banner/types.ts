export interface Product {
  id: string;
  name: string;
  image: string;
  price?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
