import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import Preview from './Preview';

export default function PreviewPane() {
  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom>
        📄 Live Preview
      </Typography>
      
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          minHeight: '600px',
          backgroundColor: '#fafafa',
          '& > section': {
            backgroundColor: 'white',
            borderRadius: 1,
            border: 'none',
            boxShadow: 1
          }
        }}
      >
        <Preview />
      </Paper>
    </Box>
  );
}