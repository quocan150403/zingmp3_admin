import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';

import Icon from './Icon';

// ----------------------------------------------------------------------
const StyledRoot = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100%',
  padding: '40px',
  border: '1px dashed',
  borderColor: 'rgba(145, 158, 171, 0.4)',
  backgroundColor: 'rgba(145, 158, 171, 0.08)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '8px',
  transition: theme.transitions.create('opacity', {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': {
    opacity: 0.72,
    cursor: 'pointer',
  },
}));

export default function Upload() {
  return (
    <StyledRoot>
      <Icon width={200} height={150} />
      <Typography variant="h5" mt={2}>
        Tải lên tệp
      </Typography>
      <Typography gutterBottom>Thả tệp vào đây hoặc nhấp để tải lên</Typography>
    </StyledRoot>
  );
}
