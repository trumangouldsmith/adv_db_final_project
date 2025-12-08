import React, { useState } from 'react';
import { useApolloClient } from '@apollo/client';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Chip,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { gql } from '@apollo/client';

const ChatInterface = () => {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const apolloClient = useApolloClient();
  const { user } = useAuth();

  const renderTable = (data) => {
    if (!data) return null;
    
    // Get the first key (the query/mutation name)
    const queryKey = Object.keys(data)[0];
    const results = data[queryKey];
    
    if (!results) {
      return <Typography>No results found</Typography>;
    }
    
    // Handle single object (mutations often return single item)
    const resultsArray = Array.isArray(results) ? results : [results];
    
    if (resultsArray.length === 0) {
      return <Typography>No results found</Typography>;
    }
    
    // Get column headers from first item, exclude __typename and objects
    const columns = Object.keys(resultsArray[0]).filter(key => 
      key !== '__typename' && typeof resultsArray[0][key] !== 'object'
    );
    
    return (
      <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map(col => (
                <TableCell key={col} sx={{ fontWeight: 'bold' }}>{col}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {resultsArray.map((row, idx) => (
              <TableRow key={idx}>
                {columns.map(col => (
                  <TableCell key={col}>{String(row[col] || 'N/A')}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

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
      // Call LLM service with conversation history
      const llmResponse = await axios.post(
        process.env.REACT_APP_LLM_SERVICE_URI + '/query',
        { 
          query: userMessage,
          history: chatHistory
        }
      );

      const { graphql_query } = llmResponse.data;

      // Check if LLM is asking for more information
      if (graphql_query.includes('NEED_INFO:') || graphql_query.includes('Please provide')) {
        const message = graphql_query.replace('NEED_INFO:', '').trim();
        setChatHistory(prev => [...prev, {
          type: 'assistant',
          content: message,
          timestamp: new Date()
        }]);
        setLoading(false);
        return;
      }

      // Add LLM response
      setChatHistory(prev => [...prev, {
        type: 'llm',
        content: graphql_query,
        timestamp: new Date()
      }]);

      // Execute GraphQL query or mutation
      try {
        // Remove all newlines and extra whitespace
        let cleanQuery = graphql_query.replace(/\s+/g, ' ').trim();
        
        // Inject user's Alumni_id for event creation and reservations
        if (user && user.Alumni_id) {
          cleanQuery = cleanQuery.replace(/"CURRENT_USER"/g, `"${user.Alumni_id}"`);
          cleanQuery = cleanQuery.replace(/Organizer_id:\s*"[^"]*"/g, `Organizer_id: "${user.Alumni_id}"`);
          cleanQuery = cleanQuery.replace(/Alumni_id:\s*"[^"]*"/g, `Alumni_id: "${user.Alumni_id}"`);
        }
        
        const dynamicQuery = gql`${cleanQuery}`;
        
        // Determine if it's a query or mutation
        const isMutation = cleanQuery.toLowerCase().startsWith('mutation');
        
        let result;
        if (isMutation) {
          result = await apolloClient.mutate({ mutation: dynamicQuery });
        } else {
          result = await apolloClient.query({ query: dynamicQuery, fetchPolicy: 'network-only' });
        }

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
              Ask me anything about alumni and events in natural language
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Examples: "Find all alumni at Google", "Show upcoming events", "Who graduated in 2024?"
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

            {message.type === 'assistant' && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Paper sx={{ p: 2, maxWidth: '70%', bgcolor: '#2a2a2a' }}>
                  <Typography sx={{ color: '#F1B82D' }}>{message.content}</Typography>
                </Paper>
              </Box>
            )}

            {message.type === 'llm' && (
              <Box sx={{ mb: 1 }}>
                <Chip label="Generated GraphQL Query" size="small" sx={{ mb: 1 }} />
                <Paper sx={{ p: 2, bgcolor: '#2a2a2a' }}>
                  <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', color: '#f1f1f1' }}>
                    {message.content}
                  </Typography>
                </Paper>
              </Box>
            )}

            {message.type === 'result' && (
              <Box sx={{ mb: 1 }}>
                <Chip label="Results" size="small" color="success" sx={{ mb: 1 }} />
                <Box sx={{ mt: 1 }}>
                  {renderTable(message.content)}
                </Box>
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
          placeholder="Ask about alumni and events..."
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

