import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import PropTypes from 'prop-types';

import IconAvatar from './IconAvatar';

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
  position: 'relative',
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

const StyledImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: '50%',
  position: 'absolute',
  top: 0,
  left: 0,
}));

// ----------------------------------------------------------------------
AvatarPreview.propTypes = {
  image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  setImage: PropTypes.func,
};

export default function AvatarPreview({ image, setImage }) {
  const [avatar, setAvatar] = useState(null);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (!image) {
      setAvatar(null);
    } else if (typeof image === 'string') {
      setAvatar({
        preview: image,
      });
    } else {
      setAvatar({
        preview: URL.createObjectURL(image),
      });
      return () => avatar && URL.revokeObjectURL(avatar.preview);
    }
  }, [image]);

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  return (
    <StyledRoot>
      <StyleBox>
        <StyledLabel>
          <IconAvatar width={32} height={32} />
          {avatar && <StyledImage src={avatar.preview} alt="avatar" />}
          <input hidden type="file" name="image" onChange={handleChangeImage} />
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
