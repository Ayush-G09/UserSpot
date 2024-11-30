import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import styled, { ThemeProvider } from "styled-components";
import { generateTheme } from "./theme";
import { RootState } from "./store/store";
import { useSelector } from "react-redux";
import { Mode, NotificationCard } from "./types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Notifications from "./components/Notifications";

function App() {
  const mode = useSelector((state: RootState) => state.mode) as Mode;
  const notifications = useSelector((state: RootState) => state.notifications) as NotificationCard[];
  const currentTheme = generateTheme(mode);
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={currentTheme}>
        <Root>
          <RouterProvider router={router} />
          <Notifications cards={notifications}/>
        </Root>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

const Root = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: ${(p) => p.theme.primary};
  transition: background-color 0.3s, transform 0.3s;

  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;  
  scrollbar-width: none;
`;

export default App;
