import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import axios from 'axios';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Chip,
  Divider,
  Alert
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { gql } from '@apollo/client';

const ChatInterface = () => {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const [executeQuery] = useLazyQuery(gql`query { __typename }`, {
    fetchPolicy: 'network-only'
  });

  const handleSendQuery = async () => {
    if (!query.trim()) return;

    const userMessage = query;
    setQuery('');
    setLoading(true);

    // Add user message to history
    setChatHistory(prev => [...prev, {
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    }]);

    try {
      // Call LLM service
      const llmResponse = await axios.post(
        process.env.REACT_APP_LLM_SERVICE_URI + '/query',
        { query: userMessage }
      );

      const { graphql_query } = llmResponse.data;

      // Add LLM response
      setChatHistory(prev => [...prev, {
        type: 'llm',
        content: graphql_query,
        timestamp: new Date()
      }]);

      // Execute GraphQL query
      try {
        const dynamicQuery = gql`${graphql_query}`;
        const result = await executeQuery({ query: dynamicQuery });

        // Add results
        setChatHistory(prev => [...prev, {
          type: 'result',
          content: result.data,
          timestamp: new Date()
        }]);
      } catch (execError) {
        setChatHistory(prev => [...prev, {
          type: 'error',
          content: 'GraphQL execution error: ' + execError.message,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      setChatHistory(prev => [...prev, {
        type: 'error',
        content: 'LLM service error: ' + error.message,
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ flex: 1, p: 2, mb: 2, overflow: 'auto', bgcolor: 'grey.50' }}>
        {chatHistory.length === 0 && (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Ask me anything about alumni, events, or photos
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Examples: "Find all alumni at Google", "Show upcoming events", "Get photos from gala"
            </Typography>
          </Box>
        )}

        {chatHistory.map((message, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            {message.type === 'user' && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Paper sx={{ p: 2, maxWidth: '70%', bgcolor: 'primary.main', color: 'white' }}>
                  <Typography>{message.content}</Typography>
                </Paper>
              </Box>
            )}

            {message.type === 'llm' && (
              <Box sx={{ mb: 1 }}>
                <Chip label="Generated GraphQL Query" size="small" sx={{ mb: 1 }} />
                <Paper sx={{ p: 2, bgcolor: 'info.light' }}>
                  <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                    {message.content}
                  </Typography>
                </Paper>
              </Box>
            )}

            {message.type === 'result' && (
              <Box sx={{ mb: 1 }}>
                <Chip label="Results" size="small" color="success" sx={{ mb: 1 }} />
                <Paper sx={{ p: 2, bgcolor: 'success.light' }}>
                  <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                    {JSON.stringify(message.content, null, 2)}
                  </Typography>
                </Paper>
              </Box>
            )}

            {message.type === 'error' && (
              <Alert severity="error" sx={{ mb: 1 }}>
                {message.content}
              </Alert>
            )}
          </Box>
        ))}

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
      </Paper>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask about alumni, events, or photos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendQuery()}
          disabled={loading}
        />
        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={handleSendQuery}
          disabled={loading || !query.trim()}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatInterface;

