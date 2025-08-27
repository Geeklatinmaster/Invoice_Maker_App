import { Box } from "@mui/material";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ 
      px: 2, 
      pr: 4, 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {children}
    </Box>
  );
}