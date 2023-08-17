import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
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
  OutlinedInput,
} from '@mui/material';
// toast
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { artistApi, albumApi, genreApi } from '../../api';
import { ThumbnailPreview } from '../../components/image-preview';

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
  };
}
// ----------------------------------------------------------------------
export default function AlbumEditPage() {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState(true);
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [oldImage, setOldImage] = useState('');
  const [genres, setGenres] = useState([]);
  const [artists, setArtists] = useState([]);

  const [artistList, setArtistList] = useState([]);
  const [genreList, setGenreList] = useState([]);

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
    const fetchGenre = async () => {
      try {
        const genreData = await genreApi.getQuery();
        setGenreList(genreData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchGenre();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await albumApi.getById(id);
        setName(res.name);
        setImage(res.imageUrl);
        setOldImage(res.imageUrl);
        setGenres(res.genres);
        setArtists(res.artists);
        setStatus(res.status);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [id]);

  const handleFormSubmit = async () => {
    try {
      const formData = createFormData();
      await updateData(formData);
      navigate('/dashboard/album');
    } catch (error) {
      console.log(error);
    }
  };

  const createFormData = () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', image);
    formData.append('oldImage', oldImage);
    genres.forEach((genre, index) => {
      formData.append(`genres[${index}]`, genre);
    });
    artists.forEach((artist, index) => {
      formData.append(`artists[${index}]`, artist);
    });
    formData.append('status', status);
    return formData;
  };

  const updateData = async (formData) => {
    try {
      await toast.promise(albumApi.update(id, formData), {
        pending: 'Đang cập nhật banner...',
        success: 'Cập nhật banner thành công!',
      });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Đã xảy ra lỗi');
      }
    }
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setGenres(typeof value === 'string' ? value.split(',') : value);
  };

  const handleChangeArtist = (event) => {
    const {
      target: { value },
    } = event;
    setArtists(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <>
      <Helmet>
        <title> Cập Nhật Banner | ZingMp3 </title>
      </Helmet>

      <Container>
        <ToastContainer />
        <Typography variant="h4" mb={5}>
          Cập nhật banner
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mb={3} width="100%">
                <TextField
                  fullWidth
                  label="Tên album"
                  variant="outlined"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel id="artist-label">Nghệ sĩ</InputLabel>
                    <Select
                      labelId="artist-label"
                      id="artist"
                      multiple
                      value={artists}
                      onChange={handleChangeArtist}
                      input={<OutlinedInput label="Nghệ sĩ" />}
                    >
                      {artistList.map((item) => (
                        <MenuItem key={item._id} value={item._id} style={getStyles(item._id, item.name, theme)}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel id="genre-label">Thể loại</InputLabel>
                    <Select
                      labelId="genre-label"
                      id="genre"
                      multiple
                      value={genres}
                      onChange={handleChange}
                      input={<OutlinedInput label="Thể loại" />}
                    >
                      {genreList.map((item) => (
                        <MenuItem key={item._id} value={item._id} style={getStyles(item._id, item.name, theme)}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
                <Stack>
                  <Typography variant="subtitle2" mb={2}>
                    Hình ảnh
                  </Typography>
                  <ThumbnailPreview image={image} setImage={setImage} />
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
                  Lưu album
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
