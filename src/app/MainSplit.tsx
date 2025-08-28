import { Box } from "@mui/material";
import { PropsWithChildren } from "react";

export default function MainSplit({ left, right }: { left: React.ReactNode; right: React.ReactNode; }) {
  return (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', lg: '420px 1fr' }, // 👈 SIEMPRE panel a la izquierda
      gap: 2,
      minHeight: 0,
      flex: 1
    }}>
      <Box sx={{ minHeight: 0, overflow: 'auto' }}>{left}</Box>
      <Box sx={{ minHeight: 0, overflow: 'auto', pr: 2 }}>{right}</Box>
    </Box>
  );
}