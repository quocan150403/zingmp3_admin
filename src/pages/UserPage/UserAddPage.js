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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import Avatar from '../../components/avatar';

const TYPES = ['Basic', 'Standard', 'Premium'];
const ROLES = ['Admin', 'User'];
// ----------------------------------------------------------------------
export default function ArtistAddPage() {
  const [checked, setChecked] = useState(true);
  const [role, setRole] = useState(ROLES[0]);
  const [type, setType] = useState(TYPES[0]);
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <>
      <Helmet>
        <title> Thêm Người dùng | BeeCine </title>
      </Helmet>

      <Container>
        <Typography variant="h4" mb={5}>
          Thêm Người dùng
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 4, pt: 10 }}>
              <Avatar />
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <TextField fullWidth label="Tên đầy đủ" variant="outlined" name="name" />
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} mt={3} mb={3}>
                <TextField fullWidth type="email" label="Email" variant="outlined" name="name" />
                <TextField
                  fullWidth
                  id="outlined-password-input"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                />
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} mb={3}>
                <FormControl fullWidth>
                  <InputLabel id="role">Loại tài khoản</InputLabel>
                  <Select
                    labelId="role"
                    id="demo-simple-select"
                    value={type}
                    label="Age"
                    onChange={(e) => setType(e.target.value)}
                  >
                    {TYPES.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id="role">Vai trò</InputLabel>
                  <Select
                    labelId="role"
                    id="demo-simple-select"
                    value={role}
                    label="Age"
                    onChange={(e) => setRole(e.target.value)}
                  >
                    {ROLES.map((role) => (
                      <MenuItem key={role} value={role}>
                        {role}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={3}>
                <FormControlLabel
                  control={<Switch checked={checked} onChange={handleChange} name="checked" color="primary" />}
                  label="Trạng thái"
                />

                <Button size="large" variant="contained" color="inherit">
                  Thêm người dùng mới
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
