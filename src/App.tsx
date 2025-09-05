import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import LiveCustomizer from "@/features/invoice/components/LiveCustomizer";
import PreviewPane from "@/features/invoice/components/PreviewPane";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

const theme = createTheme({ palette: { mode: "light" } });

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{ flex: '0 0 auto', width: { xs: '100%', md: '40%' } }}>
            <LiveCustomizer />
          </Box>
          <Box sx={{ flex: 1 }}>
            <PreviewPane />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
