import { ArrowLeft, Sparkles, Send, Mic, FlaskConical, Droplets, BarChart3, Bug, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

type Message = { role: 'user' | 'model'; content: string };

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Hello! I'm Gemini, your AI agricultural assistant. How can I help you improve your farm today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    const userMsg: Message = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      // Gather context
      const timeStr = new Date().toLocaleString();
      let locationStr = 'Location permission not granted';
      
      try {
        if ('geolocation' in navigator) {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          locationStr = `Lat: ${pos.coords.latitude}, Lng: ${pos.coords.longitude}`;
        }
      } catch (e) {
        console.warn("Could not get geolocation", e);
      }

      const clientContext = `Current Time: ${timeStr} | User Location: ${locationStr}`;

      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: newMessages,
          context: clientContext
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setMessages([...newMessages, { role: 'model', content: data.text }]);
    } catch (error: any) {
      console.error(error);
      let errorMsg = "Sorry, I'm having trouble connecting right now. Please try again.";
      if (error.message) {
        try {
          const parsed = JSON.parse(error.message);
          if (parsed.error && parsed.error.message) errorMsg = parsed.error.message;
        } catch(e) {
          if (error.message.includes("Quota exceeded") || error.message.includes("429")) {
            errorMsg = "You have exceeded your Gemini AI usage quota. Please wait a bit before trying again, or upgrade your plan.";
          } else {
            errorMsg = `Error: ${error.message}`;
          }
        }
      }
      setMessages([...newMessages, { role: 'model', content: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] md:h-screen bg-background relative">
      <header className="fixed md:absolute top-0 left-0 w-full bg-surface z-30 h-14 flex items-center px-4 border-b border-border">
         <Link to="/" className="w-10 h-10 flex items-center justify-center text-primary -ml-2 rounded-full hover:bg-slate-100 md:hidden">
           <ArrowLeft className="w-5 h-5" />
         </Link>
         <span className="font-bold text-primary text-lg ml-2">DL with Gemini</span>
      </header>

      <main className="flex-grow flex flex-col pt-20 px-4 md:px-8 max-w-3xl mx-auto w-full overflow-y-auto pb-[100px]">
        {/* Messages */}
        <div className="flex flex-col gap-6">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-4 max-w-[90%] animate-fade-in-up ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              {msg.role === 'model' && (
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-sm">
                  <Sparkles className="text-on-primary w-5 h-5" />
                </div>
              )}
              <div className={`px-5 py-4 rounded-2xl shadow-sm border ${
                msg.role === 'user' 
                  ? 'bg-primary text-on-primary rounded-tr-none border-primary' 
                  : 'bg-surface text-text-main rounded-tl-none border-border'
              }`}>
                {msg.role === 'user' ? (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                ) : (
                  <ReactMarkdown
                    components={{
                      a: ({ node, ...props }) => <a {...props} className="text-blue-600 font-bold hover:underline" target="_blank" rel="noopener noreferrer" />,
                      strong: ({ node, ...props }) => <strong {...props} className="font-bold" />,
                      p: ({ node, ...props }) => <p {...props} className="text-sm leading-relaxed whitespace-pre-wrap mb-3 last:mb-0" />,
                      ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-5 mb-3 text-sm" />,
                      ol: ({ node, ...props }) => <ol {...props} className="list-decimal pl-5 mb-3 text-sm" />,
                      li: ({ node, ...props }) => <li {...props} className="mb-1 text-sm" />
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
             <div className="flex items-start gap-4 max-w-[90%] animate-fade-in-up">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-sm">
                <Sparkles className="text-on-primary w-5 h-5" />
              </div>
              <div className="bg-surface px-5 py-4 rounded-2xl rounded-tl-none shadow-sm border border-border flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                <span className="text-sm text-text-muted">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips Grid - Only show if just 1 message (the greeting) */}
        {messages.length === 1 && (
          <div className="w-full space-y-3 mt-8">
            <h2 className="text-xs font-semibold text-text-muted uppercase tracking-widest pl-2 mb-4">Suggested Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: FlaskConical, text: "Analyze my soil report" },
                { icon: Droplets, text: "Optimize irrigation schedule" },
                { icon: BarChart3, text: "Predict harvest yield" },
                { icon: Bug, text: "Organic pest control" }
              ].map((sugg, i) => (
                <button 
                  key={i}
                  onClick={() => handleSend(sugg.text)}
                  className="flex items-center gap-4 p-4 bg-surface border border-border rounded-2xl text-left hover:bg-slate-50 active:scale-[0.98] transition-all shadow-sm group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <sugg.icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-semibold text-text-main">{sugg.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Chat Input Area */}
      <div className="fixed md:absolute bottom-[80px] md:bottom-0 left-0 md:left-64 w-full md:w-[calc(100%-256px)] bg-background border-t border-border px-4 py-4 z-40">
        <div className="max-w-3xl mx-auto flex items-center gap-3 bg-surface border border-border rounded-full p-2 shadow-sm focus-within:border-[#012d1d] focus-within:ring-1 focus-within:ring-[#012d1d] transition-shadow">
          <button className="w-10 h-10 flex items-center justify-center text-text-muted hover:text-primary hover:bg-slate-100 rounded-full transition-all shrink-0">
            <Mic className="w-5 h-5" />
          </button>
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            className="flex-grow bg-transparent border-none focus:ring-0 text-sm font-medium text-text-main placeholder-slate-400 py-2 h-full outline-none"
            placeholder="Ask Gemini about your farm..."
            disabled={isLoading}
          />
          <button 
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 flex items-center justify-center bg-primary text-on-primary rounded-full hover:opacity-90 active:scale-95 transition-all shrink-0 shadow-sm disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
