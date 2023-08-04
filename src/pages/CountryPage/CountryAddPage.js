import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import { Card, Typography, TextField, FormControlLabel, Switch, Container, Stack, Button } from '@mui/material';
// toast
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// API
import { countryApi } from '../../api';

// ----------------------------------------------------------------------

export default function CountryAddPage() {
  const [status, setStatus] = useState(true);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('');
  const [telephone, setTelephone] = useState('');
  const [currency, setCurrency] = useState('');

  const resetForm = () => {
    setName('');
    setCode('');
    setLanguage('');
    setTelephone('');
    setCurrency('');
    setStatus(true);
  };

  const handleSubmit = async () => {
    const data = {
      name,
      code,
      language,
      telephone,
      currency,
      status,
    };

    try {
      await toast.promise(countryApi.add(data), {
        pending: 'Thêm quốc gia...',
        success: 'Thêm quốc gia thành công!',
        error: 'Thêm quốc gia thất bại!',
      });
      resetForm();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Helmet>
        <title> Thêm Quốc Gia | BeeCine </title>
      </Helmet>

      <Container>
        <Typography variant="h4" mb={5}>
          Thêm Quốc Gia
        </Typography>

        <Card sx={{ p: 3 }}>
          <TextField
            fullWidth
            label="Tên quốc gia"
            variant="outlined"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} mt={3} mb={3}>
            <TextField
              fullWidth
              label="Code"
              variant="outlined"
              name="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <TextField
              fullWidth
              label="Ngôn ngữ"
              variant="outlined"
              name="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            />
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} mb={3}>
            <TextField
              fullWidth
              label="Đầu số điện thoại"
              variant="outlined"
              name="phone"
              type="tel"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
            />
            <TextField
              fullWidth
              label="Đơn vị tiền tệ"
              variant="outlined"
              name="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            />
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={3}>
            <FormControlLabel
              control={
                <Switch checked={status} onChange={(e) => setStatus(e.target.checked)} name="checked" color="primary" />
              }
              label="Trạng thái"
            />

            <Button onClick={handleSubmit} size="large" variant="contained" color="inherit">
              Thêm quốc gia
            </Button>
          </Stack>
        </Card>
      </Container>

      <ToastContainer />
    </>
  );
}
