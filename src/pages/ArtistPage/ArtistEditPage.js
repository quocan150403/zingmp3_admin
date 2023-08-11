import { Link, useNavigate, useParams } from 'react-router-dom';
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
export default function ArtistEditPage() {
  const [status, setStatus] = useState(true);
  const [name, setName] = useState('');
  const [stageName, setStageName] = useState('');
  const [bio, setBio] = useState('');
  const [genres, setGenres] = useState([]);
  const [roles, setRoles] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState('');

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenre = async () => {
      try {
        const res = await artistApi.getById(id);
        setName(res.name);
        setStageName(res.stageName);
        setBio(res.bio);
        setGenres(res.genres);
        setRoles(res.roles);
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
      navigate('/dashboard/artist');
    } catch (error) {
      console.log(error);
    }
  };

  const createFormData = () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('stageName', stageName);
    formData.append('bio', bio);
    formData.append('genres', JSON.stringify(genres));
    formData.append('roles', JSON.stringify(roles));
    formData.append('status', status);
    formData.append('avatarUrl', avatarUrl);
    return formData;
  };

  const updateData = async (formData) => {
    await toast.promise(artistApi.update(id, formData), {
      pending: 'Đang cập nhật nghệ sĩ...',
      success: 'Cập nhật nghệ sĩ thành công!',
      error: 'Cập nhật nghệ sĩ thất bại!',
    });
  };

  return (
    <>
      <Helmet>
        <title> Cập Nhật Nghệ Sĩ | ZingMp3 </title>
      </Helmet>

      <Container>
        <ToastContainer />
        <Typography variant="h4" mb={5}>
          Cập Nhật Nghệ Sĩ
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
                    limitTags={3}
                    autoHighlight
                    options={GENGRES}
                    onChange={(event, newValue) => {
                      setGenres(newValue);
                    }}
                    value={genres}
                    renderInput={(params) => <TextField {...params} label="Thể loại" variant="outlined" />}
                  />
                  <Autocomplete
                    id="roles"
                    fullWidth
                    multiple
                    limitTags={3}
                    autoHighlight
                    options={JOBS}
                    isOptionEqualToValue={(option, value) => option === value}
                    onChange={(event, newValue) => {
                      setRoles(newValue);
                    }}
                    value={roles.map((role) => role)}
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
                  Cập nhật
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
