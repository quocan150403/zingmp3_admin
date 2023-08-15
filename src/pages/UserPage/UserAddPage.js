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
// toast
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { userApi } from '../../api';
import { AvatarPreview } from '../../components/image-preview';

const ROLES = ['User', 'Admin'];

// ----------------------------------------------------------------------
export default function UserAddPage() {
  const [status, setStatus] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(ROLES[0]);
  const [image, setImage] = useState('');

  const handleFormSubmit = async () => {
    try {
      const formData = createFormData();
      await addData(formData);
      resetForm();
    } catch (error) {
      console.log(error);
    }
  };

  const createFormData = () => {
    const formData = new FormData();
    formData.append('UID', '2');
    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('role', role);
    formData.append('status', status);
    formData.append('image', image);
    return formData;
  };

  const addData = async (formData) => {
    try {
      await toast.promise(userApi.add(formData), {
        pending: 'Đang thêm người dùng...',
        success: 'Thêm người dùng thành công!',
      });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Đã xảy ra lỗi');
      }
    }
  };

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setRole('');
    setPassword('');
    setImage('');
    setStatus(true);
  };

  return (
    <>
      <Helmet>
        <title> Thêm Người Dùng | ZingMp3 </title>
      </Helmet>

      <Container>
        <ToastContainer />
        <Typography variant="h4" mb={5}>
          Thêm người dùng
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 4, pt: 10 }}>
              <AvatarPreview image={image} setImage={setImage} />
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mb={3} width="100%">
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                  <TextField
                    fullWidth
                    label="Tên đầy đủ"
                    variant="outlined"
                    name="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                  <FormControl fullWidth>
                    <InputLabel id="role-label">Vai trò</InputLabel>
                    <Select
                      labelId="role-label"
                      id="role"
                      value={role}
                      label="Vai trò"
                      onChange={(e) => setRole(e.target.value)}
                    >
                      {ROLES.map((item, index) => (
                        <MenuItem key={index} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                  <TextField
                    fullWidth
                    type="email"
                    label="Email"
                    variant="outlined"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    type="password"
                    label="Mật khẩu"
                    variant="outlined"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Stack>
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={status}
                      onChange={(e) => setStatus(e.target.checked)}
                      name="checked"
                      color="primary"
                    />
                  }
                  label="Trạng thái"
                />

                <Button onClick={handleFormSubmit} size="large" variant="contained" color="inherit">
                  Thêm Người dùng
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
