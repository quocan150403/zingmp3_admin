import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { MuiFileInput } from 'mui-file-input';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Card,
  Typography,
  TextField,
  Container,
  Stack,
  Grid,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  InputAdornment,
  FormControlLabel,
  Switch,
  Button,
} from '@mui/material';
// toast
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { songApi, artistApi, albumApi } from '../../api';
import { ThumbnailPreview } from '../../components/image-preview';

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
  };
}

// ----------------------------------------------------------------------
export default function SongAddPage() {
  const theme = useTheme();
  const [artistList, setArtistList] = useState([]);
  const [albumList, setAlbumList] = useState([]);

  const [status, setStatus] = useState(true);
  const [name, setName] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  const [albumId, setAlbumId] = useState('');
  const [artists, setArtists] = useState([]);
  const [composers, setComposers] = useState([]);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const artistData = await artistApi.getQuery();
        setArtistList(artistData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchArtist();
  }, []);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const albumData = await albumApi.getQuery();
        setAlbumList(albumData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAlbum();
  }, []);

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
    formData.append('thumbnailUrl', thumbnailUrl);

    formData.append('albumId', albumId);
    formData.append('artists', JSON.stringify(artists));
    formData.append('composers', JSON.stringify(composers));
    formData.append('duration', duration);
    formData.append('audioUrl', audioUrl);

    formData.append('status', status);
    return formData;
  };

  const addData = async (formData) => {
    await toast.promise(songApi.add(formData), {
      pending: 'Đang thêm bài hát...',
      success: 'Thêm bài hát thành công!',
      error: 'Thêm bài hát thất bại!',
    });
  };

  const resetForm = () => {
    setName('');
    setThumbnailUrl('');
    setAlbumId('');
    setArtists([]);
    setComposers([]);
    setDuration(0);
    setAudioUrl('');
  };

  const handleChangeArtist = (event) => {
    const { value } = event.target;
    setArtists(typeof value === 'string' ? value.split(',') : value);
  };

  const handleChangeComposer = (event) => {
    const { value } = event.target;
    setComposers(typeof value === 'string' ? value.split(',') : value);
  };

  const handleChangeAudio = (newValue) => {
    setAudioUrl(newValue);
  };

  return (
    <>
      <Helmet>
        <title> Thêm Bài Hát | ZingMp3 </title>
      </Helmet>

      <Container>
        <ToastContainer />
        <Typography variant="h4" mb={5}>
          Thêm Bài Hát
        </Typography>

        {/* Info Basic */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Chi tiết bài hát</Typography>
            <Typography variant="caption">Nhập tên bài hát, hình ảnh</Typography>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} width="100%">
                <TextField
                  fullWidth
                  label="Tên bài hát"
                  variant="outlined"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Stack>
                  <Typography variant="subtitle2" mb={2}>
                    Hình ảnh
                  </Typography>
                  <ThumbnailPreview image={thumbnailUrl} setImage={setThumbnailUrl} />
                </Stack>
              </Stack>
            </Card>
          </Grid>
        </Grid>

        {/* Properties */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Thuộc tính</Typography>
            <Typography variant="caption">Nhập thời lượng,chủ đề,...</Typography>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2} mb={3} direction="row" justifyContent="space-between" width="100%">
                <FormControl fullWidth>
                  <InputLabel id="album-label">Album</InputLabel>
                  <Select
                    labelId="album-label"
                    id="album"
                    value={albumId}
                    label="Album"
                    onChange={(e) => setAlbumId(e.target.value)}
                  >
                    {albumList.map((item) => (
                      <MenuItem value={item._id} key={item._id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  type="number"
                  label="Thời lượng"
                  variant="outlined"
                  name="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">Phút</InputAdornment>,
                  }}
                />
              </Stack>

              <Stack spacing={2} mb={3} direction="row" justifyContent="space-between" width="100%">
                <FormControl fullWidth>
                  <InputLabel id="artist-label">Nghệ sĩ trình bày</InputLabel>
                  <Select
                    labelId="artist-label"
                    id="artist"
                    multiple
                    value={artists}
                    onChange={handleChangeArtist}
                    input={<OutlinedInput label="Nghệ sĩ trình bày" />}
                  >
                    {artistList.map((item) => (
                      <MenuItem key={item._id} value={item._id} style={getStyles(item._id, item.name, theme)}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id="composer-label">Sáng tác</InputLabel>
                  <Select
                    labelId="composer-label"
                    id="composer"
                    multiple
                    value={composers}
                    onChange={handleChangeComposer}
                    input={<OutlinedInput label="Sáng tác" />}
                  >
                    {artistList.map((item) => (
                      <MenuItem key={item._id} value={item._id} style={getStyles(item._id, item.name, theme)}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </Card>
          </Grid>
        </Grid>

        {/* File */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Upload bài hát</Typography>
            <Typography variant="caption">Chọn file bài hát</Typography>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <MuiFileInput fullWidth value={audioUrl} onChange={handleChangeAudio} />
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3} justifyContent="flex-end" mb={3}>
          <Grid item xs={12} md={8}>
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
                Thêm bài hát mới
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
