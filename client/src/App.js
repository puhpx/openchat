import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      const response = await axios.get('/messages');
      setMessages(response.data);
      setLoading(false);
    };
    fetchMessages();
  }, []);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const response = await axios.post('/messages', { text: inputText });
    setMessages([...messages, response.data]);
    setInputText('');
    setLoading(false);
  };

  return (
    <div className="App">
      <div className="sidebar">
        <div className="sidebar-top">
          <button>New Chat</button>
        </div>
        <div className="sidebar-bottom">
          <p>Account</p>
          <p>Contact Us</p>
          <button>Login</button>
        </div>
      </div>
      <header className="App-header">
        <h1>Open Chat</h1>
        <p>This is private message between you and Assistant</p>
      </header>
      <div className="subscribe-window">
        <div className="subscribe-content">
          <h3>Subscribe and Enjoy Full Features</h3>
          <p>With subscription, get over 500,000 words every month</p>
          <button>Subscribe Now</button>
        </div>
      </div>
      <div className="chat-container">
        {loading ? (
          <p></p>
        ) : (
          <>
            {messages.map((message, index) => (
              <div key={index} className="message-container">
                <p className="user-message">{message.text}</p>
                {message.response && <p className="bot-message">{message.response}</p>}
              </div>
            ))}
          </>
        )}
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            placeholder="Ask Assistant Something"
            value={inputText}
            onChange={handleInputChange}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}

export default App;
