import { useState } from 'react';
import { MessageSquare, Send, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface VideoAIChatProps {
  videoTitle: string;
  transcript?: string;
  summary: string;
  keyPoints: string[];
  language: 'hu' | 'en';
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const VideoAIChat = ({ 
  videoTitle, 
  transcript, 
  summary, 
  keyPoints, 
  language,
  onClose 
}: VideoAIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await supabase.functions.invoke('video-chat', {
        body: {
          messages: [...messages, userMessage],
          context: {
            title: videoTitle,
            transcript: transcript || '',
            summary,
            keyPoints,
          },
          language,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || 'AI error');
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.data.response,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('AI Chat error:', error);
      toast.error(
        language === 'hu' 
          ? 'Hiba történt a válasz generálásakor' 
          : 'Error generating response'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground">
                {language === 'hu' ? 'Kérdezz a videóról' : 'Ask about the video'}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-1">{videoTitle}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">
                {language === 'hu' 
                  ? 'Tegyél fel kérdést a videóval kapcsolatban!' 
                  : 'Ask a question about the video!'}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {[
                  language === 'hu' ? 'Mi a videó fő mondanivalója?' : 'What is the main message?',
                  language === 'hu' ? 'Milyen kriptókat említenek?' : 'What cryptos are mentioned?',
                  language === 'hu' ? 'Van benne befektetési tanács?' : 'Any investment advice?',
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(suggestion)}
                    className="text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-secondary rounded-2xl px-4 py-2.5">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={language === 'hu' ? 'Írd be a kérdésed...' : 'Type your question...'}
              className="min-h-[44px] max-h-32 resize-none"
              rows={1}
            />
            <Button 
              onClick={sendMessage} 
              disabled={!input.trim() || isLoading}
              className="shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
