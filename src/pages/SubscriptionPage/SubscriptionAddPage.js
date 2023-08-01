import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import {
  Card,
  Typography,
  TextField,
  FormControlLabel,
  Switch,
  Container,
  Stack,
  Button,
  Grid,
  InputAdornment,
  MenuItem,
  Autocomplete,
  Chip,
} from '@mui/material';

const DURATIONS = [
  {
    value: '1 tháng',
    label: '1 tháng',
  },
  {
    value: '3 tháng',
    label: '3 tháng',
  },
  {
    value: '6 tháng',
    label: '6 tháng',
  },
  {
    value: '12 tháng',
    label: '12 tháng',
  },
];

const BENEFITS = [
  { title: 'Full HD' },
  { title: '4K' },
  { title: 'Không quảng cáo' },
  { title: 'Xem phim mới' },
  { title: 'Xem phim cũ' },
  { title: 'Xem phim độc quyền' },
  { title: 'Xem phim chất lượng cao' },
  { title: 'Xem phim không giới hạn' },
];

// ----------------------------------------------------------------------
export default function GenreAddPage() {
  const [checked, setChecked] = useState(true);
  const [value, setValue] = useState([]);
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <>
      <Helmet>
        <title> Thêm Gói | BeeCine </title>
      </Helmet>

      <Container>
        <Typography variant="h4" mb={5}>
          Thêm gói
        </Typography>

        <Grid container>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mb={3} width="100%">
                <TextField
                  fullWidth
                  label="Tên gói"
                  variant="outlined"
                  name="name"
                  // value={name}
                  // onChange={handleChange}
                />
                <TextField
                  label="Giá gói"
                  fullWidth
                  variant="outlined"
                  id="outlined-start-adornment"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">VNĐ</InputAdornment>,
                  }}
                />
                <TextField id="outlined-select-currency" select label="Thời hạn" defaultValue="1 tháng">
                  {DURATIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>

                <Autocomplete
                  multiple
                  id="fixed-tags-demo"
                  value={value}
                  onChange={(event, newValue) => {
                    setValue([...newValue]);
                  }}
                  options={BENEFITS}
                  getOptionLabel={(option) => option.title}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip key={option.title} label={option.title} {...getTagProps({ index })} />
                    ))
                  }
                  fullWidth
                  renderInput={(params) => <TextField {...params} label="Quyền lợi" />}
                />
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={3}>
                <FormControlLabel
                  control={<Switch checked={checked} onChange={handleChange} name="checked" color="primary" />}
                  label="Trạng thái"
                />

                <Button size="large" variant="contained" color="inherit">
                  Thêm gói
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
