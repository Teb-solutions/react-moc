import React, { useState, useRef, useEffect } from 'react';
import { Paper, TextField, IconButton, Box, Typography, Fab, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import ChatIcon from '@mui/icons-material/Chat';
import axios from 'axios';

interface Message {
  text: string;
  isBot: boolean;
  isLoading?: boolean;
}

const MessageContent: React.FC<{ message: Message }> = ({ message }) => {
  if (message.isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        minHeight: 24  // Ensures consistent height with regular messages
      }}>
        <CircularProgress 
          size={16} 
          thickness={4} 
          sx={{ 
            color: 'primary.main',
            marginRight: 1 
          }} 
        />
        <Typography 
          variant="body2" 
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            color: 'text.secondary',
            fontStyle: 'italic'
          }}
        >
          Thinking...
        </Typography>
      </Box>
    );
  }

  return (
    <Typography variant="body2">{message.text}</Typography>
  );
};

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    const userMessage = inputMessage;
    // Add user message
    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    // Add loading message from bot
    setMessages(prev => [...prev, { text: 'Thinking...', isBot: true, isLoading: true }]);

    setInputMessage('');
    setIsLoading(true);
    await axios.get('http://127.0.0.1:8000/ask/?pdf_name=hira.pdf&question='+userMessage).then(response => {
        console.log(response.data);
        // setMessages(prev => [...prev, { text: response.data, isBot: true }]);
        // Replace loading message with actual response
      setMessages(prev => 
        prev.map((msg, index) => 
          index === prev.length - 1 
            ? { text: response.data as string, isBot: true, isLoading: false }
            : msg
        )
      );
    }).catch(error => {
        console.error('Error fetching data:', error);
        // Handle error by replacing loading message with error message
      setMessages(prev => 
        prev.map((msg, index) => 
          index === prev.length - 1 
            ? { text: "Sorry, I couldn't process your request. Please try again.", isBot: true, isLoading: false }
            : msg
        )
      );
    }).finally(() => {
        setIsLoading(false);
    });


    // TODO: Replace this with your actual chatbot API call
    // setTimeout(() => {
    //   setMessages(prev => [...prev, { 
    //     text: `Bot response to: ${inputMessage}`, 
    //     isBot: true 
    //   }]);
    // }, 1000);

   
  };

  if (!isOpen) {
    return (
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 80, // Increased bottom padding for footer
          right: 20,
          zIndex: 1000,
        }}
        onClick={() => setIsOpen(true)}
      >
        <ChatIcon />
      </Fab>
    );
  }

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 80, // Increased bottom padding for footer
        right: 20,
        width: '350px',
        height: '500px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 3,
        zIndex: 1000,
      }}
    >
      {/* Chat Header */}
      <Box sx={{ 
        p: 2, 
        backgroundColor: 'primary.main', 
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6">Chat Assistant</Typography>
        <IconButton 
          size="small" 
          onClick={() => setIsOpen(false)}
          sx={{ color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Messages Area */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        {messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              alignSelf: message.isBot ? 'flex-start' : 'flex-end',
              backgroundColor: message.isBot ? 'grey.100' : 'primary.main',
              color: message.isBot ? 'text.primary' : 'white',
              p: 1,
              px: 2,
              borderRadius: 2,
              maxWidth: '70%',
            }}
          >
            <MessageContent message={message} />
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Type a message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <IconButton 
            color="primary" 
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default ChatWindow;