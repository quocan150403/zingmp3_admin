import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
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
  Autocomplete,
} from '@mui/material';
// toast
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { userApi } from '../../api';
import { AvatarPreview } from '../../components/image-preview';

const ROLES = ['User', 'Admin'];

// ----------------------------------------------------------------------
export default function UserEditPage() {
  const [status, setStatus] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenre = async () => {
      try {
        const res = await userApi.getById(id);
        setFullName(res.fullName);
        setEmail(res.email);
        setRole(res.role);
        setStatus(res.status);
        setAvatarUrl(res.avatarUrl);
      } catch (error) {
        console.log(error);
      }
    };
    fetchGenre();
  }, [id]);

  const handleFormSubmit = async () => {
    try {
      const formData = createFormData();
      await updateData(formData);
      navigate('/dashboard/user');
    } catch (error) {
      console.log(error);
    }
  };

  const createFormData = () => {
    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('role', role);
    formData.append('status', status);
    formData.append('avatarUrl', avatarUrl);
    return formData;
  };

  const updateData = async (formData) => {
    await toast.promise(userApi.update(id, formData), {
      pending: 'Đang cập nhật người dùng...',
      success: 'Cập nhật người dùng thành công!',
      error: 'Cập nhật người dùng thất bại!',
    });
  };

  return (
    <>
      <Helmet>
        <title> Cập Nhật Người Dùng | ZingMp3 </title>
      </Helmet>

      <Container>
        <ToastContainer />
        <Typography variant="h4" mb={5}>
          Cập Nhật Người Dùng
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 4, pt: 10 }}>
              <AvatarPreview image={avatarUrl} setImage={setAvatarUrl} />
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
                  <Autocomplete
                    fullWidth
                    id="role"
                    options={ROLES}
                    value={role}
                    onChange={(e, newValue) => setRole(newValue)}
                    renderInput={(params) => <TextField {...params} label="Vai trò" />}
                  />
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
                  Lưu Người dùng
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
