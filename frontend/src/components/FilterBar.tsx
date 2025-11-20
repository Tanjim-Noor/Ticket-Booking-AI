import { Box, FormControl, InputLabel, Select, MenuItem, Button, Typography } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';

interface FilterBarProps {
  providers: string[];
  selectedProvider: string;
  onProviderChange: (provider: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onClearFilters: () => void;
  totalResults: number;
}

export default function FilterBar({
  providers,
  selectedProvider,
  onProviderChange,
  sortBy,
  onSortChange,
  onClearFilters,
  totalResults,
}: FilterBarProps) {
  const hasFilters = selectedProvider !== 'all' || sortBy !== 'default';

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        mb: 3,
        p: 2,
        bgcolor: 'grey.50',
        borderRadius: 1,
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
      }}
    >
      {/* Results Count */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
        <FilterListIcon color="action" />
        <Typography variant="body1" fontWeight="medium">
          {totalResults} {totalResults === 1 ? 'route' : 'routes'} found
        </Typography>
      </Box>

      {/* Provider Filter */}
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel>Provider</InputLabel>
        <Select
          value={selectedProvider}
          label="Provider"
          onChange={(e) => onProviderChange(e.target.value)}
        >
          <MenuItem value="all">All Providers</MenuItem>
          {providers.map((provider) => (
            <MenuItem key={provider} value={provider}>
              {provider}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Sort */}
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel>Sort By</InputLabel>
        <Select value={sortBy} label="Sort By" onChange={(e) => onSortChange(e.target.value)}>
          <MenuItem value="default">Default</MenuItem>
          <MenuItem value="fare-asc">Price: Low to High</MenuItem>
          <MenuItem value="fare-desc">Price: High to Low</MenuItem>
          <MenuItem value="provider-asc">Provider: A-Z</MenuItem>
        </Select>
      </FormControl>

      {/* Clear Filters */}
      {hasFilters && (
        <Button
          variant="outlined"
          size="small"
          startIcon={<ClearIcon />}
          onClick={onClearFilters}
          sx={{ minWidth: 120 }}
        >
          Clear
        </Button>
      )}
    </Box>
  );
}
