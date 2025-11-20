import { Box, Autocomplete, TextField, IconButton, Button, Paper } from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { DISTRICTS } from '@/constants/districts';

interface SearchFormProps {
  onSearch: (from: string, to: string) => void;
  loading?: boolean;
}

export default function SearchForm({ onSearch, loading = false }: SearchFormProps) {
  const [fromDistrict, setFromDistrict] = useState<string | null>(null);
  const [toDistrict, setToDistrict] = useState<string | null>(null);

  const handleSwap = () => {
    const temp = fromDistrict;
    setFromDistrict(toDistrict);
    setToDistrict(temp);
  };

  const handleSearch = () => {
    if (fromDistrict && toDistrict) {
      onSearch(fromDistrict, toDistrict);
    }
  };

  const canSearch = fromDistrict && toDistrict && !loading;
  const canSwap = fromDistrict || toDistrict;

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'center',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {/* From District */}
        <Autocomplete
          fullWidth
          options={DISTRICTS}
          value={fromDistrict}
          onChange={(_, newValue) => setFromDistrict(newValue)}
          disabled={loading}
          renderInput={(params) => (
            <TextField
              {...params}
              label="From District"
              placeholder="Select departure district"
              required
            />
          )}
        />

        {/* Swap Button */}
        <IconButton
          onClick={handleSwap}
          disabled={!canSwap || loading}
          sx={{
            bgcolor: 'primary.light',
            '&:hover': { bgcolor: 'primary.main', color: 'white' },
            '&.Mui-disabled': { bgcolor: 'action.disabledBackground' },
          }}
        >
          <SwapHorizIcon />
        </IconButton>

        {/* To District */}
        <Autocomplete
          fullWidth
          options={DISTRICTS}
          value={toDistrict}
          onChange={(_, newValue) => setToDistrict(newValue)}
          disabled={loading}
          renderInput={(params) => (
            <TextField
              {...params}
              label="To District"
              placeholder="Select destination district"
              required
            />
          )}
        />

        {/* Search Button */}
        <Button
          variant="contained"
          size="large"
          onClick={handleSearch}
          disabled={!canSearch}
          startIcon={<SearchIcon />}
          sx={{
            minWidth: { xs: '100%', md: 150 },
            height: 56,
          }}
        >
          Search
        </Button>
      </Box>
    </Paper>
  );
}
