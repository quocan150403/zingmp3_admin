import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';

import Icon from './Icon';

// ----------------------------------------------------------------------
const StyledRoot = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyleBox = styled('div')(({ theme }) => ({
  width: '144px',
  height: '144px',
  padding: '8px',
  border: '1px dashed',
  borderColor: 'rgba(145, 158, 171, 0.4)',
  // backgroundColor: 'rgba(145, 158, 171, 0.08)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  transition: theme.transitions.create('opacity', {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': {
    opacity: 0.72,
    cursor: 'pointer',
  },
}));

const StyledLabel = styled('label')(({ theme }) => ({
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(145, 158, 171, 0.08)',
  color: theme.palette.text.secondary,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  transition: theme.transitions.create('opacity', {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': {
    opacity: 0.8,
    cursor: 'pointer',
  },
}));

// ----------------------------------------------------------------------

export default function Avatar({ image, setImage }) {
  return (
    <StyledRoot>
      <StyleBox>
        <StyledLabel>
          <Icon width={32} height={32} />
          <input type="file" name="image" onChange={(e) => setImage(e.target.files[0])} />
          <Typography variant="caption" sx={{ mt: 1 }}>
            Chọn ảnh
          </Typography>
        </StyledLabel>
      </StyleBox>
      <Typography variant="caption" sx={{ mt: 3, textAlign: 'center' }}>
        Chỉ chấp nhận ảnh JPG, GIF hoặc PNG.
        <br />
        Tối đa 500KB
      </Typography>
    </StyledRoot>
  );
}
