(function() {
  'use strict';
  
  console.log('[RAG Widget] Initializing...');
  
  // Check if widget ID is provided
  if (!window.RAG_CHAT_WIDGET_ID) {
    console.error('[RAG Widget] Error: RAG_CHAT_WIDGET_ID is not defined. Please add it before including widget.js');
    return;
  }
  
  const widgetId = window.RAG_CHAT_WIDGET_ID;
  const projectId = 'ggcuobyzxnmgywvqywnj';
  const publicAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdnY3VvYnl6eG5tZ3l3dnF5d25qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyOTIzNzksImV4cCI6MjA4Mzg2ODM3OX0.5oB6JBH8g45jk5uFQefZNfr4udLsTSa2KHRM3WpcPZo';
  
  console.log('[RAG Widget] Widget ID:', widgetId);
  
  // Check if widget is already initialized
  if (document.getElementById('rag-chat-widget-root')) {
    console.warn('[RAG Widget] Widget already initialized');
    return;
  }
  
  // Create widget container
  const container = document.createElement('div');
  container.id = 'rag-chat-widget-root';
  document.body.appendChild(container);
  
  // Create widget HTML structure
  container.innerHTML = `
    <div id="rag-chat-widget" style="position: fixed; bottom: 20px; right: 20px; z-index: 999999; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div id="rag-chat-window" style="display: none; width: 380px; height: 600px; background: white; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); overflow: hidden; flex-direction: column; margin-bottom: 16px;">
        <div style="background: #0f172a; color: white; padding: 16px; display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span style="font-weight: 600; font-size: 14px;">Chat Support</span>
          </div>
          <button id="rag-close-btn" style="background: none; border: none; color: white; cursor: pointer; padding: 4px; border-radius: 4px; display: flex; align-items: center; justify-content: center;" aria-label="Close chat">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div id="rag-messages" style="flex: 1; overflow-y: auto; padding: 16px; background: #f9fafb; display: flex; flex-direction: column; gap: 12px;">
          <div style="text-align: center; color: #6b7280; font-size: 14px; padding: 40px 20px;">
            Start a conversation by typing a message below
          </div>
        </div>
        <div style="border-top: 1px solid #e5e7eb; padding: 16px; background: white;">
          <div style="display: flex; gap: 8px;">
            <input id="rag-input" type="text" placeholder="Type your message..." style="flex: 1; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; outline: none;" />
            <button id="rag-send-btn" style="background: #0f172a; color: white; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-weight: 500; font-size: 14px;" disabled>
              Send
            </button>
          </div>
        </div>
      </div>
      <button id="rag-toggle-btn" style="width: 60px; height: 60px; border-radius: 50%; background: #0f172a; color: white; border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>
    </div>
  `;
  
  // Get elements
  const chatWindow = document.getElementById('rag-chat-window');
  const toggleBtn = document.getElementById('rag-toggle-btn');
  const closeBtn = document.getElementById('rag-close-btn');
  const input = document.getElementById('rag-input');
  const sendBtn = document.getElementById('rag-send-btn');
  const messagesContainer = document.getElementById('rag-messages');
  
  let isOpen = false;
  let isTyping = false;
  
  // Toggle chat window
  function toggleChat() {
    isOpen = !isOpen;
    chatWindow.style.display = isOpen ? 'flex' : 'none';
    if (isOpen) {
      input.focus();
    }
  }
  
  toggleBtn.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', toggleChat);
  
  // Enable/disable send button based on input
  input.addEventListener('input', () => {
    sendBtn.disabled = !input.value.trim() || isTyping;
  });
  
  // Handle Enter key
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && input.value.trim() && !isTyping) {
      e.preventDefault();
      sendMessage();
    }
  });
  
  // Send message
  sendBtn.addEventListener('click', sendMessage);
  
  function addMessage(content, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.style.display = 'flex';
    messageDiv.style.justifyContent = isUser ? 'flex-end' : 'flex-start';
    
    const bubble = document.createElement('div');
    bubble.style.maxWidth = '80%';
    bubble.style.padding = '12px 16px';
    bubble.style.borderRadius = '12px';
    bubble.style.fontSize = '14px';
    bubble.style.lineHeight = '1.5';
    
    if (isUser) {
      bubble.style.background = '#0f172a';
      bubble.style.color = 'white';
    } else {
      bubble.style.background = 'white';
      bubble.style.color = '#111827';
      bubble.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
    }
    
    bubble.textContent = content;
    messageDiv.appendChild(bubble);
    
    // Remove empty state message if present
    const emptyState = messagesContainer.querySelector('[style*="text-align: center"]');
    if (emptyState) {
      emptyState.remove();
    }
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    return messageDiv;
  }
  
  function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.id = 'rag-typing-indicator';
    typingDiv.style.display = 'flex';
    typingDiv.style.justifyContent = 'flex-start';
    
    const bubble = document.createElement('div');
    bubble.style.background = 'white';
    bubble.style.padding = '12px 16px';
    bubble.style.borderRadius = '12px';
    bubble.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
    bubble.textContent = '...';
    
    typingDiv.appendChild(bubble);
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  function hideTypingIndicator() {
    const indicator = document.getElementById('rag-typing-indicator');
    if (indicator) {
      indicator.remove();
    }
  }
  
  async function sendMessage() {
    const message = input.value.trim();
    if (!message || isTyping) return;
    
    // Add user message
    addMessage(message, true);
    input.value = '';
    sendBtn.disabled = true;
    isTyping = true;
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
      // Call chat API
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c52f905e/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          message: message,
          widgetId: widgetId,
          conversationId: `conv-${Date.now()}`
        })
      });
      
      hideTypingIndicator();
      
      if (!response.ok) {
        throw new Error('Failed to get response');
      }
      
      const data = await response.json();
      addMessage(data.message || 'Sorry, I couldn\'t process that request.', false);
      
    } catch (error) {
      console.error('[RAG Widget] Error:', error);
      hideTypingIndicator();
      addMessage('Sorry, I encountered an error. Please try again.', false);
    } finally {
      isTyping = false;
      sendBtn.disabled = !input.value.trim();
    }
  }
  
  console.log('[RAG Widget] Initialized successfully');
})();
