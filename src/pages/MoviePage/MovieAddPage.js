import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { parseISO } from 'date-fns';
// @mui
import {
  Card,
  Stack,
  Button,
  Container,
  Typography,
  TextField,
  FormControlLabel,
  Switch,
  Grid,
  Autocomplete,
  Box,
  InputAdornment,
  Chip,
} from '@mui/material';
// toast
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import { DatePicker } from '@mui/x-date-pickers';
import { ThumbnailPreview } from '../../components/ImagePreview';
// API
import { movieApi, episodeApi, genreApi, ageGroupApi, artistApi, countryApi } from '../../api';

const TAGS = [
  { title: 'Hành động' },
  { title: 'Kinh dị' },
  { title: 'Tình cảm' },
  { title: 'Hài hước' },
  { title: 'Phiêu lưu' },
  { title: 'Viễn tưởng' },
  { title: 'Tâm lý' },
  { title: 'Hình sự' },
  { title: 'Chiến tranh' },
  { title: 'Thần thoại' },
  { title: 'Hoạt hình' },
  { title: 'Âm nhạc' },
  { title: 'Thể thao' },
  { title: 'Tài liệu' },
  { title: 'Gia đình' },
  {
    title: 'Phim lẻ',
  },
];

// ----------------------------------------------------------------------
export default function MovieAddPage() {
  const [genreList, setGenreList] = useState([]);
  const [ageGroupList, setAgeGroupList] = useState([]);
  const [artistList, setArtistList] = useState([]);
  // const [castList, setCastList] = useState([]);
  // const [directorList, setDirectorList] = useState([]);
  const [countryList, setCountryList] = useState([]);

  const [genres, setGenres] = useState([]);
  const [country, setCountry] = useState({});
  const [cast, setCast] = useState([]);
  const [directors, setDirectors] = useState([]);
  const [tags, setTags] = useState([]);
  const [age, setAge] = useState(Number);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [releaseDate, setReleaseDate] = useState(parseISO(new Date().toISOString()));
  const [isSeries, setIsSeries] = useState(false);
  const [duration, setDuration] = useState('');
  const [rating, setRating] = useState();
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [status, setStatus] = useState(true);

  const [more, setMore] = useState(false);

  const [moreInfo, setMoreInfo] = useState({
    title: '',
    description: '',
    season: '',
    number: '',
    duration: '',
    airDate: parseISO(new Date().toISOString()),
  });

  useEffect(() => {
    const fetchGenreList = async () => {
      try {
        const response = await genreApi.getAll();
        setGenreList(response.map((item) => ({ _id: item._id, name: item.name, slug: item.slug })));
      } catch (error) {
        console.log(error);
      }
    };
    fetchGenreList();
  }, []);

  useEffect(() => {
    const fetchCountryList = async () => {
      try {
        const response = await countryApi.getAll();
        setCountryList(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCountryList();
  }, []);

  useEffect(() => {
    const fetchArtistList = async () => {
      try {
        const response = await artistApi.getAll();
        setArtistList(response.map((item) => ({ _id: item._id, name: item.name, slug: item.slug })));
      } catch (error) {
        console.log(error);
      }
    };
    fetchArtistList();
  }, []);

  useEffect(() => {
    const fetchAgeGroupList = async () => {
      try {
        const response = await ageGroupApi.getAll();
        setAgeGroupList(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAgeGroupList();
  }, []);

  const resetForm = () => {
    setGenres([]);
    setCountry({});
    setCast([]);
    setDirectors([]);
    setTags([]);
    setAge(Number);
    setTitle('');
    setDescription('');
    setReleaseDate(parseISO(new Date().toISOString()));
    setIsSeries(false);
    setDuration('');
    setRating();
    setThumbnailUrl(null);
    setTrailerUrl('');
    setVideoUrl('');
    setStatus(true);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('genres', JSON.stringify(genres));
    formData.append('cast', JSON.stringify(cast));
    formData.append('directors', JSON.stringify(directors));
    formData.append('tags', JSON.stringify(tags));
    formData.append('country', JSON.stringify(country));

    formData.append('minimumAge', age);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('releaseDate', releaseDate);
    formData.append('isSeries', isSeries);
    formData.append('duration', duration);
    formData.append('rating', rating);
    formData.append('image', thumbnailUrl);
    formData.append('trailerUrl', trailerUrl);
    formData.append('status', status);

    try {
      toast.loading('Đang thêm phim mới...');
      const response = await movieApi.add(formData);
      const { _id } = response;
      let episodeData = {
        movieId: _id,
        title,
        videoUrl,
      };

      if (more) {
        episodeData = {
          ...episodeData,
          ...moreInfo,
        };
      }

      await episodeApi.addSingle(episodeData);
      toast.dismiss();
      toast.success('Thêm phim mới thành công!');

      resetForm();
    } catch (error) {
      toast.error('Thêm phim mới thất bại!');
      console.log(error);
    }
  };

  return (
    <>
      <Helmet>
        <title> Thêm phim | BeeCine </title>
      </Helmet>

      <Container>
        <ToastContainer />
        <Typography variant="h4" mb={5}>
          Thêm phim
        </Typography>

        {/* Infomation */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Chi tiết phim</Typography>
            <Typography variant="caption">Nhập tên phim,mô tả, thể loại, hình ảnh,...</Typography>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} width="100%">
                <TextField
                  fullWidth
                  label="Tên phim"
                  variant="outlined"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Mô tả"
                  variant="outlined"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
            <Typography variant="h6"> Thuộc tính</Typography>
            <Typography variant="caption">Nhập thời lượng, ngày công chiếu,...</Typography>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2} mb={3} direction="row" justifyContent="space-between" width="100%">
                <Autocomplete
                  id="age-group"
                  fullWidth
                  options={ageGroupList.map((option) => option)}
                  getOptionLabel={(option) => `${option.name} - ${option.minimum} tuổi`}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  onChange={(event, newValue) => setAge(newValue.minimum)}
                  renderInput={(params) => <TextField {...params} label="Độ tuổi" />}
                />

                <Autocomplete
                  id="genre"
                  fullWidth
                  multiple
                  limitTags={2}
                  options={genreList}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  onChange={(event, newValue) => setGenres(newValue)}
                  renderInput={(params) => <TextField {...params} label="Thể loại" />}
                />
              </Stack>

              <Stack spacing={2} mb={3} direction="row" justifyContent="space-between" width="100%">
                {/* <Autocomplete
                  id="cast"
                  fullWidth
                  freeSolo
                  multiple
                  limitTags={5}
                  options={artistList.map((option) => option.name)}
                  // getOptionLabel={(option) => {
                  //   if (typeof option === 'string') {
                  //     return option;
                  //   }
                  //   if (option.inputValue) {
                  //     return option.inputValue;
                  //   }
                  //   return option.name;
                  // }}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  onChange={(event, newValue) => setCast(newValue)}
                  onInputChange={(event, newInputValue) => {
                    setCast(newInputValue);
                  }}
                  value={cast}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="filled"
                        // label={option && option.name ? option.name : option}
                        label={option}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderInput={(params) => <TextField {...params} label="Diễn viên" />}
                /> */}
                <Autocomplete
                  id="cast"
                  fullWidth
                  multiple
                  limitTags={2}
                  autoHighlight
                  options={artistList.map((option) => option)}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  onChange={(event, newValue) => setCast(newValue)}
                  renderInput={(params) => <TextField {...params} label="Chọn diễn viên" />}
                />
                <Autocomplete
                  id="director"
                  fullWidth
                  multiple
                  limitTags={2}
                  options={artistList.map((option) => option)}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  onChange={(event, newValue) => setDirectors(newValue)}
                  renderInput={(params) => <TextField {...params} label="Chọn đạo diễn" />}
                />
              </Stack>

              <Stack spacing={2} mb={3} direction="row" justifyContent="space-between" width="100%">
                <Autocomplete
                  id="country"
                  fullWidth
                  autoHighlight
                  options={countryList}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  onChange={(event, newValue) => setCountry(newValue)}
                  renderOption={(props, option) => (
                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                      <img
                        loading="lazy"
                        width="20"
                        src={`https://flagcdn.com/w20/${option.code.toLowerCase().trim()}.png`}
                        srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase().trim()}.png 2x`}
                        alt={option.code}
                      />
                      {option.name} ({option.code}) +{option.telephone}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Chọn quốc gia"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: 'new-password',
                      }}
                    />
                  )}
                />
                <TextField
                  fullWidth
                  type="number"
                  label="Đánh giá"
                  name="rating"
                  onChange={(e) => setRating(e.target.value)}
                  variant="outlined"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">0 - 10 điểm</InputAdornment>,
                  }}
                />
              </Stack>
              <Stack spacing={2} direction="row" justifyContent="space-between" width="100%">
                <DatePicker
                  sx={{
                    width: '100%',
                  }}
                  value={releaseDate}
                  onChange={(newValue) => setReleaseDate(newValue)}
                />
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
            </Card>
          </Grid>
        </Grid>

        {/* Infomation  other */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Thông tin khác</Typography>
            <Typography variant="caption">Nhập tên phim,mô tả, thể loại, hình ảnh,...</Typography>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} width="100%">
                <FormControlLabel
                  control={
                    <Switch
                      checked={isSeries}
                      onChange={(e) => {
                        setIsSeries(e.target.checked);
                        setMore(false);
                      }}
                      name="checked"
                      color="primary"
                    />
                  }
                  label="Phim bộ"
                />
                <TextField
                  fullWidth
                  label="URL trailer"
                  variant="outlined"
                  name="trailer"
                  value={trailerUrl}
                  onChange={(e) => setTrailerUrl(e.target.value)}
                />

                <Autocomplete
                  id="tags"
                  freeSolo
                  multiple
                  limitTags={5}
                  options={TAGS.map((option) => option.title)}
                  onChange={(event, newValue) => setTags(newValue)}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => <Chip variant="filled" label={option} {...getTagProps({ index })} />)
                  }
                  renderInput={(params) => <TextField {...params} label="Từ khóa liên quan" />}
                />

                {!isSeries && (
                  <Stack spacing={3} width="100%">
                    <TextField
                      fullWidth
                      label="URL phim"
                      variant="outlined"
                      name="video"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={more}
                          onChange={(e) => setMore(e.target.checked)}
                          name="checked"
                          color="primary"
                        />
                      }
                      label="Thêm thông tin về phần phim"
                    />
                  </Stack>
                )}
              </Stack>
            </Card>
          </Grid>
        </Grid>

        {/* More info */}
        <Grid container spacing={3} mb={3} justifyContent="flex-end">
          <Grid item xs={12} md={8}>
            {more && (
              <Card sx={{ p: 3 }}>
                <Stack spacing={3} width="100%">
                  <TextField
                    fullWidth
                    label="Tên tập phim"
                    variant="outlined"
                    name="title"
                    value={moreInfo.title}
                    onChange={(e) => setMoreInfo({ ...moreInfo, title: e.target.value })}
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Mô tả"
                    variant="outlined"
                    name="description"
                    value={moreInfo.description}
                    onChange={(e) => setMoreInfo({ ...moreInfo, description: e.target.value })}
                  />

                  <Stack spacing={2} mb={3} direction="row" justifyContent="space-between" width="100%">
                    <TextField
                      fullWidth
                      type="number"
                      label="Mùa"
                      variant="outlined"
                      name="season"
                      value={moreInfo.season}
                      onChange={(e) => setMoreInfo({ ...moreInfo, season: e.target.value })}
                    />
                    <TextField
                      fullWidth
                      type="number"
                      label="Tập"
                      variant="outlined"
                      name="number"
                      value={moreInfo.number}
                      onChange={(e) => setMoreInfo({ ...moreInfo, number: e.target.value })}
                    />
                  </Stack>

                  <Stack spacing={2} direction="row" justifyContent="space-between" width="100%">
                    <DatePicker
                      sx={{
                        width: '100%',
                      }}
                      value={moreInfo.airDate}
                      onChange={(newValue) => setMoreInfo({ ...moreInfo, airDate: newValue })}
                    />
                    <TextField
                      fullWidth
                      type="number"
                      label="Thời lượng"
                      variant="outlined"
                      name="duration"
                      value={moreInfo.duration}
                      onChange={(e) => setMoreInfo({ ...moreInfo, duration: e.target.value })}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">Phút</InputAdornment>,
                      }}
                    />
                  </Stack>
                </Stack>
              </Card>
            )}
          </Grid>
        </Grid>

        {/* BTN */}
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

              <Button onClick={handleSubmit} size="large" variant="contained" color="inherit">
                Thêm phim mới
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
