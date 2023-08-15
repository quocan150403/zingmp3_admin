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
export default function UserEditPage() {
  const [status, setStatus] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [image, setImage] = useState('');
  const [oldImage, setOldImage] = useState('');

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
        setImage(res.imageUrl);
        setOldImage(res.imageUrl);
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
    formData.append('image', image);
    formData.append('oldImage', oldImage);
    return formData;
  };

  const updateData = async (formData) => {
    try {
      await toast.promise(userApi.update(id, formData), {
        pending: 'Đang cập nhật người dùng...',
        success: 'Cập nhật người dùng thành công!',
        error: 'Cập nhật người dùng thất bại!',
      });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Đã xảy ra lỗi');
      }
    }
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
