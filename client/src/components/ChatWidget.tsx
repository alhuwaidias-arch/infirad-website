import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [lastMessageCount, setLastMessageCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { isArabic } = useLanguage();

  const createSession = trpc.telegram.createSession.useMutation();
  const sendMessage = trpc.telegram.sendMessage.useMutation();
  const getHistory = trpc.telegram.getHistory.useQuery(
    { session_id: sessionId },
    { 
      enabled: !!sessionId && isOpen,
      refetchInterval: 2000, // Poll every 2 seconds for new messages
    }
  );

  useEffect(() => {
    // Initialize session when widget opens
    if (isOpen && !sessionId) {
      initializeSession();
    }
  }, [isOpen]);

  useEffect(() => {
    // Update messages when history changes
    if (getHistory.data && getHistory.data.messages.length > lastMessageCount) {
      const newMessages = getHistory.data.messages.slice(lastMessageCount);
      
      newMessages.forEach((msg) => {
        if (msg.from === 'telegram') {
          // This is a reply from Telegram
          const telegramMessage: Message = {
            id: `telegram-${Date.now()}-${Math.random()}`,
            text: msg.text,
            isUser: false,
            timestamp: new Date(msg.timestamp),
          };
          
          setMessages(prev => {
            // Avoid duplicates
            if (prev.some(m => m.text === msg.text && !m.isUser)) {
              return prev;
            }
            return [...prev, telegramMessage];
          });
        }
      });
      
      setLastMessageCount(getHistory.data.messages.length);
    }
  }, [getHistory.data, lastMessageCount]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeSession = async () => {
    try {
      const response = await createSession.mutateAsync();
      setSessionId(response.session_id);

      // Add initial greeting
      const greeting: Message = {
        id: '1',
        text: isArabic 
          ? 'أهلاً بك. أنا "هادي"، وكيل التواصل لشركة انفِراد. كيف يمكنني مساعدتك؟'
          : 'Hello. I am "Hadi", INFIRAD\'s communication agent. How can I help you?',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages([greeting]);
      setLastMessageCount(0);
    } catch (error) {
      console.error('Failed to initialize session:', error);
      const fallbackGreeting: Message = {
        id: '1',
        text: isArabic 
          ? 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى لاحقاً.'
          : 'Sorry, there was a connection error. Please try again later.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages([fallbackGreeting]);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || !sessionId) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    const messageText = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      // Send message to Telegram via tRPC
      await sendMessage.mutateAsync({
        session_id: sessionId,
        message: messageText,
      });

      setIsTyping(false);
      
      // Show "waiting for response" message
      const waitingMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: isArabic
          ? 'تم إرسال رسالتك. جاري الانتظار للرد...'
          : 'Message sent. Waiting for response...',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, waitingMessage]);
      
      // Remove waiting message after 3 seconds
      setTimeout(() => {
        setMessages(prev => prev.filter(m => m.id !== waitingMessage.id));
      }, 3000);
      
    } catch (error) {
      console.error('Failed to send message:', error);
      setIsTyping(false);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: isArabic
          ? 'عذراً، حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى.'
          : 'Sorry, there was an error sending your message. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="lg"
        className="w-14 h-14 rounded-full shadow-2xl bg-primary hover:bg-primary/90 text-white hover-scale transition-brutal border-2 border-secondary/20"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 md:w-96 bg-background border-2 border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px] animate-fade-in">
          {/* Header */}
          <div className="bg-primary p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold text-white font-display">
                هـ
              </div>
              <div className="leading-tight">
                <p className="text-xs font-bold text-white font-display">
                  <span className="ar-content">هادي | انفِراد</span>
                  <span className="en-content">Hadi | INFIRAD</span>
                </p>
                <p className="text-[10px] text-secondary flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="ar-content">متصل</span>
                  <span className="en-content">Online</span>
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white opacity-60 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs ${
                    message.isUser
                      ? 'bg-primary text-white rounded-tr-none'
                      : 'bg-accent text-foreground rounded-tl-none border-2 border-border'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-accent text-foreground p-3 rounded-2xl rounded-tl-none text-xs animate-pulse border-2 border-border">
                  <span className="ar-content">جاري الإرسال...</span>
                  <span className="en-content">Sending...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-accent border-t-2 border-border flex gap-2">
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isArabic ? 'اكتب رسالتك هنا...' : 'Type your message here...'}
              className="flex-1 bg-white border-2 border-border text-xs"
              disabled={!sessionId}
            />
            <Button 
              onClick={handleSend}
              size="sm"
              className="bg-primary text-white hover:bg-primary/90"
              disabled={!sessionId || !inputValue.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
