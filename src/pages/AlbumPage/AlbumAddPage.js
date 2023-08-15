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

import { albumApi, artistApi, genreApi } from '../../api';
import { ThumbnailPreview } from '../../components/image-preview';

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
  };
}

// ----------------------------------------------------------------------
export default function AlbumAddPage() {
  const theme = useTheme();

  const [status, setStatus] = useState(true);
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [genres, setGenres] = useState([]);
  const [artistId, setArtistId] = useState('');

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
    formData.append('image', image);
    formData.append('genres[]', genres);
    formData.append('artistId', artistId);
    formData.append('status', status);
    return formData;
  };

  const addData = async (formData) => {
    try {
      await toast.promise(albumApi.add(formData), {
        pending: 'Đang thêm album...',
        success: 'Thêm album thành công!',
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
    setImage('');
    setGenres([]);
    setArtistId('');
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setGenres(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <>
      <Helmet>
        <title> Thêm Album | ZingMp3 </title>
      </Helmet>

      <Container>
        <ToastContainer />
        <Typography variant="h4" mb={5}>
          Thêm Album
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
                    <InputLabel id="demo-simple-select-label">Nghệ sĩ</InputLabel>
                    <Select
                      labelId="artist-label"
                      id="artist"
                      value={artistId}
                      label="Nghệ sĩ"
                      onChange={(e) => setArtistId(e.target.value)}
                    >
                      {artistList.map((item) => (
                        <MenuItem key={item._id} value={item._id}>
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
                  Thêm album
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
