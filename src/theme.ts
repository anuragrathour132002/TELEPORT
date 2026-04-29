import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#00bcd4" },
    background: { default: "#0b1020", paper: "#111827" },
  },
  shape: {
    borderRadius: 10,
  },
});
