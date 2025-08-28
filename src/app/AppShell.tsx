import { Box } from "@mui/material";
import { PropsWithChildren } from "react";

export default function AppShell({ children }: PropsWithChildren) {
  return (
    <Box sx={{ p: 2, height: '100vh', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 1 }}>
      {children}
    </Box>
  );
}