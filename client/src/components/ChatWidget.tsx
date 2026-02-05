import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isArabic } = useLanguage();

  useEffect(() => {
    // Initial greeting message
    if (messages.length === 0) {
      const greeting: Message = {
        id: '1',
        text: isArabic 
          ? 'أهلاً بك. أنا "هادي"، وكيل التواصل الذكي لشركة انفِراد. هل تبحث عن شريك تقني لمشروعك القادم؟'
          : 'Hello. I am "Hadi", INFIRAD\'s smart communication agent. Are you looking for a technical partner for your next project?',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages([greeting]);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: isArabic
          ? 'شكراً لتواصلك. لقد تم استلام طلبك وتصنيفه كـ "أولوية هندسية". سيقوم مدير مشاريعنا بالتواصل معك عبر البيانات المسجلة لدينا.'
          : 'Thank you for reaching out. Your request has been received and categorized as an "Engineering Priority". Our project manager will contact you via the details provided.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1500);
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
                <p className="text-[10px] text-secondary">
                  <span className="ar-content">مرحباً بك في عالم اليقين</span>
                  <span className="en-content">Welcome to the world of certainty</span>
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
                  <span className="ar-content">جاري التحليل...</span>
                  <span className="en-content">Analyzing...</span>
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
              placeholder={isArabic ? 'اكتب استفسارك هنا...' : 'Type your query here...'}
              className="flex-1 bg-white border-2 border-border text-xs"
            />
            <Button 
              onClick={handleSend}
              size="sm"
              className="bg-primary text-white hover:bg-primary/90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
