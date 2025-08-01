'use client';

import { useState, useRef, useEffect } from 'react';

type Message = {
  sender: 'user' | 'bot';
  text: string;
};

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const chatButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    // Fetch profile info to get profileImage URL
    async function fetchProfilePic() {
      try {
        const res = await fetch('/api/admin/profile',{
          method: 'GET'
        });
        const data = await res.json();
        if (data && data.profileImage) {
          setProfilePic(data.profileImage);
        }
      } catch {
        setProfilePic(null);
      }
    }
    fetchProfilePic();
  }, []);

  const sendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);
    try {
      const res = await fetch('/api/personal-chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage: userMsg }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: data.reply || data.error || 'No reply.' },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Error fetching reply.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        chatBoxRef.current &&
        !chatBoxRef.current.contains(event.target as Node) &&
        chatButtonRef.current &&
        !chatButtonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  // SVGs for avatars
  const aiAvatar = profilePic ? (
    <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={profilePic}
        alt="AI Avatar"
        className="rounded-full w-8 h-8 object-cover border"
      />
    </span>
  ) : (
    <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
      <div className="rounded-full bg-gray-100 border p-1 flex items-center justify-center">
        <svg
          stroke="none"
          fill="black"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          aria-hidden="true"
          height="20"
          width="20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
          ></path>
        </svg>
      </div>
    </span>
  );
  const userAvatar = (
    <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
      <div className="rounded-full bg-gray-100 border p-1 flex items-center justify-center">
        <svg
          stroke="none"
          fill="black"
          strokeWidth="0"
          viewBox="0 0 16 16"
          height="20"
          width="20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"></path>
        </svg>
      </div>
    </span>
  );

  return (
    <>
      {/* Floating Chat Button */}
      <button
        ref={chatButtonRef}
        className="fixed bottom-4 right-4 inline-flex items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 border rounded-full w-16 h-16 bg-black hover:bg-gray-700 m-0 cursor-pointer border-gray-200 bg-none p-0 normal-case leading-5 hover:text-gray-900 z-50"
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        data-state={open ? 'open' : 'closed'}
        onClick={() => setOpen((o) => !o)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white block border-gray-200 align-middle"
        >
          <path
            d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"
            className="border-gray-200"
          ></path>
        </svg>
      </button>

      {/* Chat Window */}
      {open && (
        <div
          ref={chatBoxRef}
          style={{
            boxShadow:
              '0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0 0 0 / 0.05)',
          }}
          className="fixed bottom-[calc(4rem+1.5rem)] right-0 left-0 mx-auto bg-white p-3 sm:p-6 rounded-lg border border-[#e5e7eb] w-full max-w-xs sm:max-w-md md:max-w-lg lg:w-[440px] h-[70vh] max-h-[634px] z-50 flex flex-col"
        >
          {/* Heading */}
          <div className="flex flex-col space-y-1.5 pb-4 sm:pb-6">
            <div className="flex items-center justify-between w-full">
              <div>
                <h2 className="font-semibold text-base sm:text-lg tracking-tight">Chatbot</h2>
                <p className="text-xs sm:text-sm text-[#6b7280] leading-3">
                  Powered by Gemini &amp; Vercel
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMessages([])}
                className="ml-2 px-2 sm:px-3 py-1 rounded-md text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300"
                aria-label="Clear chat"
              >
                Clear Chat
              </button>
            </div>
          </div>
          {/* Chat Container */}
          <div
            className="pr-2 sm:pr-4 flex-1 overflow-y-auto break-words"
            style={{ minWidth: '100%', display: 'flex', flexDirection: 'column', wordBreak: 'break-word', overflowWrap: 'break-word' }}
          >
            <div className="flex-1 flex flex-col justify-end">
              {messages.length === 0 && (
                <div className="flex gap-3 my-4 text-gray-600 text-xs sm:text-sm flex-1">
                  {aiAvatar}
                  <p className="leading-relaxed">
                    <span className="block font-bold text-gray-700">AI </span>Hi, I
                    am Akshay&apos;s personal AI assistant. How can I help you today?
                  </p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 my-4 text-gray-600 text-xs sm:text-sm flex-1 ${
                    msg.sender === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  {msg.sender === 'user' ? userAvatar : aiAvatar}
                  <p className="leading-relaxed">
                    <span className="block font-bold text-gray-700">
                      {msg.sender === 'user' ? 'You' : 'AI'}{' '}
                    </span>
                    {msg.text}
                  </p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          {/* Input box  */}
          <div className="flex items-center pt-0">
            <form
              className="flex items-center justify-center w-full space-x-2"
              onSubmit={sendMessage}
            >
              <input
                className="flex h-10 w-full rounded-md border border-[#e5e7eb] px-3 py-2 text-xs sm:text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
                placeholder={
                  loading ? 'Waiting for reply...' : 'Type your message'
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
              <button
                className="inline-flex items-center justify-center rounded-md text-xs sm:text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-black hover:bg-[#111827E6] h-10 px-3 sm:px-4 py-2"
                type="submit"
                disabled={loading || !input.trim()}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
