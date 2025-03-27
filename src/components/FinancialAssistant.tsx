
import React, { useState } from 'react';
import { BadgeIndianRupee, X, Send, MessageSquare, BarChart3, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';

const FinancialAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{type: 'user' | 'assistant', text: string}[]>([
    {type: 'assistant', text: 'How can I help with your finances today?'}
  ]);
  const { language } = useAppContext();
  
  const translations = {
    financialAssistant: {
      english: "Financial Assistant",
      hindi: "वित्तीय सहायक",
      tamil: "நிதி உதவியாளர்",
      telugu: "ఫైనాన్షియల్ అసిస్టెంట్",
      bengali: "আর্থিক সহকারী"
    },
    typingPlaceholder: {
      english: "Type your question...",
      hindi: "अपना प्रश्न टाइप करें...",
      tamil: "உங்கள் கேள்வியை தட்டச்சு செய்யவும்...",
      telugu: "మీ ప్రశ్నను టైప్ చేయండి...",
      bengali: "আপনার প্রশ্ন টাইপ করুন..."
    },
    send: {
      english: "Send",
      hindi: "भेजें",
      tamil: "அனுப்பு",
      telugu: "పంపు",
      bengali: "পাঠান"
    },
    getNews: {
      english: "Get Indian Currency News",
      hindi: "भारतीय मुद्रा समाचार प्राप्त करें",
      tamil: "இந்திய நாணய செய்திகளைப் பெறுங்கள்",
      telugu: "భారతీయ కరెన్సీ వార్తలను పొందండి",
      bengali: "ভারতীয় মুদ্রা সংবাদ পান"
    },
    close: {
      english: "Close",
      hindi: "बंद करें",
      tamil: "மூடு",
      telugu: "మూసివేయండి",
      bengali: "বন্ধ করুন"
    },
    budgetAdvisor: {
      english: "Budget Advisor",
      hindi: "बजट सलाहकार",
      tamil: "பட்ஜெட் ஆலோசகர்",
      telugu: "బడ్జెట్ సలహాదారు",
      bengali: "বাজেট উপদেষ্টা"
    },
    faqs: {
      english: "FAQs",
      hindi: "अक्सर पूछे जाने वाले प्रश्न",
      tamil: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
      telugu: "తరచుగా అడిగే ప్రశ్నలు",
      bengali: "সচরাচর জিজ্ঞাসিত প্রশ্নাবলী"
    }
  };
  
  const getText = (key: keyof typeof translations) => {
    return translations[key][language as keyof typeof translations[keyof typeof translations]] || translations[key].english;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message to chat
    setChatHistory([...chatHistory, {type: 'user', text: message}]);
    
    // Simulate assistant response
    setTimeout(() => {
      let response = '';
      
      if (message.toLowerCase().includes('currency') || message.toLowerCase().includes('money') || message.toLowerCase().includes('denomination') || message.toLowerCase().includes('rupee')) {
        response = 'I can help identify Indian currency denominations (₹10, ₹20, ₹50, ₹100, ₹200, ₹500, ₹2000) through the scan feature. Would you like to try that now?';
      } else if (message.toLowerCase().includes('budget') || message.toLowerCase().includes('save')) {
        response = 'For budgeting, I recommend tracking your expenses and setting aside 20% of your income for savings when possible. The 50/30/20 rule works well with Indian finances - 50% for needs, 30% for wants, and 20% for savings.';
      } else if (message.toLowerCase().includes('news')) {
        response = 'I can provide you with the latest Indian currency news. Check the button below to get updates.';
      } else {
        response = 'I can provide Indian currency identification, budget advice, and currency news. How can I assist you today?';
      }
      
      setChatHistory(prev => [...prev, {type: 'assistant', text: response}]);
    }, 1000);
    
    // Clear input
    setMessage('');
  };
  
  const handleGetNews = () => {
    setChatHistory(prev => [
      ...prev, 
      {
        type: 'assistant', 
        text: 'Latest Indian Currency News: The Reserve Bank of India (RBI) is considering new security features for banknotes to prevent counterfeiting. These may include holographic strips, color-shifting ink, and embedded microchips. The new series of ₹500 notes is expected to roll out next quarter.'
      }
    ]);
  };
  
  const handleBudgetAdvisor = () => {
    setChatHistory(prev => [
      ...prev, 
      {
        type: 'assistant', 
        text: 'Budget Tips for Indian Consumers:\n\n1. Use the 50/30/20 rule: 50% of income for essentials, 30% for wants, 20% for savings.\n\n2. Consider a Systematic Investment Plan (SIP) for long-term goals.\n\n3. Build an emergency fund covering 3-6 months of expenses.\n\n4. Track expenses using UPI transaction history for better visibility.'
      }
    ]);
  };
  
  const handleFAQs = () => {
    setChatHistory(prev => [
      ...prev, 
      {
        type: 'assistant', 
        text: 'Frequently Asked Questions:\n\n1. How can I identify Indian currency notes? - Use the scan feature for quick identification.\n\n2. What denominations of Indian Rupee exist currently? - ₹10, ₹20, ₹50, ₹100, ₹200, ₹500, and ₹2000 notes are in circulation.\n\n3. How can I check if a note is genuine? - Look for the watermark, security thread, and RBI governor signature.'
      }
    ]);
  };
  
  return (
    <>
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 focus-visible-ring animate-float"
        aria-label="Financial Assistant"
      >
        <BadgeIndianRupee className="h-6 w-6" />
      </button>
      
      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-full max-w-md h-[480px] bg-background shadow-xl rounded-lg border border-border flex flex-col animate-scale-in z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <BadgeIndianRupee className="h-5 w-5 text-primary" />
              <h3 className="font-medium">{getText('financialAssistant')}</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-1.5 rounded-full hover:bg-muted transition-colors"
              aria-label={getText('close')}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {/* Chat messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {chatHistory.map((chat, index) => (
                <div 
                  key={index} 
                  className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-lg ${
                      chat.type === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-br-none' 
                        : 'bg-muted rounded-bl-none'
                    }`}
                  >
                    {chat.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Quick actions */}
          <div className="p-2 border-t border-border">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="whitespace-nowrap"
                onClick={handleGetNews}
              >
                <Newspaper className="h-4 w-4 mr-2" />
                {getText('getNews')}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="whitespace-nowrap"
                onClick={handleBudgetAdvisor}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                {getText('budgetAdvisor')}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="whitespace-nowrap"
                onClick={handleFAQs}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                {getText('faqs')}
              </Button>
            </div>
          </div>
          
          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={getText('typingPlaceholder')}
                className="flex-1 px-4 py-2 bg-muted rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button type="submit" size="icon" className="rounded-full">
                <Send className="h-4 w-4" />
                <span className="sr-only">{getText('send')}</span>
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default FinancialAssistant;
