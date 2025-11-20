import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '@/theme/theme';
import Home from '@/pages/Home';
import Chat from '@/pages/Chat';
import Search from '@/pages/Search';
import Bookings from '@/pages/Bookings';
import ApiTest from '@/pages/ApiTest';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/search" element={<Search />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/api-test" element={<ApiTest />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
