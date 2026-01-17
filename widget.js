(function() {
  'use strict';
  
  console.log('[RAG Widget] Initializing...');
  
  if (!window.RAG_CHAT_WIDGET_ID) {
    console.error('[RAG Widget] Error: RAG_CHAT_WIDGET_ID is not defined');
    console.error('[RAG Widget] Please set window.RAG_CHAT_WIDGET_ID before loading this script');
    return;
  }
  
  const widgetId = window.RAG_CHAT_WIDGET_ID;
  const projectId = 'ggcuobyzxnmgywvqywnj';
  const publicAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdnY3VvYnl6eG5tZ3l3dnF5d25qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNjk4MTgsImV4cCI6MjA1MTg0NTgxOH0.RzI4Wq2RrLjGiGsRlO4k64VFnFtSh7aPb6_TfY4i5-4';
  
  console.log('[RAG Widget] Widget ID:', widgetId);
  
  if (document.getElementById('rag-chat-widget-root')) {
    console.warn('[RAG Widget] Widget already initialized');
    return;
  }
  
  const container = document.createElement('div');
  container.id = 'rag-chat-widget-root';
  document.body.appendChild(container);
  
  container.innerHTML = `
    <div id="rag-chat-widget" style="position: fixed; bottom: 20px; right: 20px; z-index: 999999; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div id="rag-chat-window" style="display: none; width: 380px; height: 600px; background: white; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); overflow: hidden; flex-direction: column; margin-bottom: 16px;">
        <div style="background: #0f172a; color: white; padding: 16px; display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
            </svg>
            <span style="font-weight: 600; font-size: 14px;">Chat Support</span>
          </div>
          <button id="rag-close-btn" style="background: none; border: none; color: white; cursor: pointer; padding: 4px; border-radius: 4px;" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div id="rag-messages" style="flex: 1; overflow-y: auto; padding: 16px; background: #f9fafb;"></div>
        <div style="padding: 16px; border-top: 1px solid #e5e7eb; background: white;">
          <div style="display: flex; gap: 8px;">
            <input id="rag-input" type="text" placeholder="Type your message..." style="flex: 1; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px;" />
            <button id="rag-send-btn" style="background: #0f172a; color: white; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500;">Send</button>
          </div>
        </div>
      </div>
      <button id="rag-toggle-btn" style="width: 60px; height: 60px; border-radius: 50%; background: #0f172a; color: white; border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center;" aria-label="Toggle chat">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
        </svg>
      </button>
    </div>
  `;
  
  const chatWindow = document.getElementById('rag-chat-window');
  const toggleBtn = document.getElementById('rag-toggle-btn');
  const closeBtn = document.getElementById('rag-close-btn');
  const input = document.getElementById('rag-input');
  const sendBtn = document.getElementById('rag-send-btn');
  const messagesContainer = document.getElementById('rag-messages');
  
  if (!chatWindow || !toggleBtn || !closeBtn || !input || !sendBtn || !messagesContainer) {
    console.error('[RAG Widget] Failed to initialize: required elements not found');
    return;
  }
  
  let isOpen = false;
  let conversationId = 'conv-' + Date.now() + '-' + Math.random().toString(36).substring(7);
  
  function toggleChat() {
    isOpen = !isOpen;
    chatWindow.style.display = isOpen ? 'flex' : 'none';
    if (isOpen && input) {
      input.focus();
      // Show welcome message on first open
      if (messagesContainer.children.length === 0) {
        addMessage('Hello! How can I help you today?', false);
      }
    }
  }
  
  function addMessage(text, isUser) {
    const div = document.createElement('div');
    div.style.cssText = 'max-width: 70%; padding: 10px 14px; border-radius: 12px; font-size: 14px; line-height: 1.4; margin: 8px ' + (isUser ? '0 0 auto' : 'auto 0 0') + '; ' + (isUser ? 'background: #0f172a; color: white;' : 'background: white; border: 1px solid #e5e7eb; color: #1f2937;');
    div.textContent = text;
    messagesContainer.appendChild(div);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  function addLoadingMessage() {
    const div = document.createElement('div');
    div.id = 'rag-loading-message';
    div.style.cssText = 'max-width: 70%; padding: 10px 14px; border-radius: 12px; font-size: 14px; line-height: 1.4; margin: 8px auto 0 0; background: white; border: 1px solid #e5e7eb; color: #6b7280;';
    div.textContent = 'Typing...';
    messagesContainer.appendChild(div);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return div;
  }
  
  function removeLoadingMessage() {
    const loading = document.getElementById('rag-loading-message');
    if (loading) loading.remove();
  }
  
  async function sendMessage() {
    const message = input.value.trim();
    if (!message) return;
    
    addMessage(message, true);
    input.value = '';
    input.disabled = true;
    sendBtn.disabled = true;
    
    const loadingDiv = addLoadingMessage();
    
    try {
      console.log('[RAG Widget] Sending message to chat endpoint...');
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c52f905e/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ 
          message, 
          widgetId, 
          conversationId 
        })
      });
      
      removeLoadingMessage();
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        console.error('[RAG Widget] Chat API error:', response.status, errorText);
        addMessage('Sorry, I encountered an error. Please try again.', false);
        return;
      }
      
      const data = await response.json();
      console.log('[RAG Widget] Received response:', data);
      
      addMessage(data.message || 'Sorry, I could not process your request.', false);
      
      if (data.conversationId) {
        conversationId = data.conversationId;
      }
    } catch (error) {
      removeLoadingMessage();
      console.error('[RAG Widget] Network error:', error);
      addMessage('Error: Could not connect to server. Please check your connection.', false);
    } finally {
      input.disabled = false;
      sendBtn.disabled = false;
      input.focus();
    }
  }
  
  // Event listeners
  toggleBtn.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', toggleChat);
  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keypress', (e) => { 
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(); 
    }
  });
  
  console.log('[RAG Widget] Initialized successfully');
})();
