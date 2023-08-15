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
  Autocomplete,
} from '@mui/material';
// toast
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { artistApi } from '../../api';
import { AvatarPreview } from '../../components/image-preview';

const GENGRES = ['Trữ tình', 'Nhạc trẻ', 'Rap Việt', 'Nhạc trịnh', 'Pop', 'Rock', 'EDM', 'Indie', 'Khác'];

const JOBS = [
  'Ca sĩ',
  'Nhạc sĩ',
  'Rapper',
  'DJ',
  'Nhóm nhạc',
  'Nhà sản xuất',
  'Nhạc công',
  'Nhà soạn nhạc',
  'Nhà thơ',
  'Nhà văn',
  'Nhà báo',
  'Diễn viên',
  'Người mẫu',
  'Vũ công',
  'Nghệ sĩ đường phố',
  'Người dẫn chương trình',
  'Nhà thiết kế',
  'Họa sĩ',
  'Nhiếp ảnh gia',
  'Giáo viên',
  'Học sinh',
  'Sinh viên',
  'Khác',
];

// ----------------------------------------------------------------------
export default function ArtistAddPage() {
  const [status, setStatus] = useState(true);
  const [name, setName] = useState('');
  const [stageName, setStageName] = useState('');
  const [bio, setBio] = useState('');
  const [genres, setGenres] = useState([]);
  const [roles, setRoles] = useState([]);
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
    formData.append('name', name);
    formData.append('stageName', stageName);
    formData.append('bio', bio);
    formData.append('genres[]', genres);
    formData.append('roles[]', roles);
    formData.append('status', status);
    formData.append('image', image);
    return formData;
  };

  const addData = async (formData) => {
    try {
      await toast.promise(artistApi.add(formData), {
        pending: 'Đang thêm nghệ sĩ...',
        success: 'Thêm nghệ sĩ thành công!',
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
    setName('');
    setStageName('');
    setBio('');
    setGenres([]);
    setRoles([]);
    setStatus(true);
    setImage('');
  };

  return (
    <>
      <Helmet>
        <title> Thêm Nghệ Sĩ | ZingMp3 </title>
      </Helmet>

      <Container>
        <ToastContainer />
        <Typography variant="h4" mb={5}>
          Thêm Nghệ Sĩ
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="Nghệ danh"
                    variant="outlined"
                    name="stageName"
                    value={stageName}
                    onChange={(e) => setStageName(e.target.value)}
                  />
                </Stack>

                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                  <Autocomplete
                    id="genres"
                    fullWidth
                    multiple
                    limitTags={2}
                    autoHighlight
                    options={GENGRES}
                    onChange={(event, newValue) => {
                      setGenres(newValue);
                    }}
                    value={genres}
                    renderInput={(params) => <TextField {...params} label="nghệ sĩ" variant="outlined" />}
                  />
                  <Autocomplete
                    id="roles"
                    fullWidth
                    multiple
                    limitTags={2}
                    autoHighlight
                    options={JOBS}
                    onChange={(event, newValue) => {
                      setRoles(newValue);
                    }}
                    value={roles}
                    renderInput={(params) => <TextField {...params} label="Nghề nghiệp" variant="outlined" />}
                  />
                </Stack>

                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Mô tả"
                  variant="outlined"
                  name="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
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
                  Thêm Nghệ Sĩ
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
