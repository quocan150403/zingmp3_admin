import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const movies = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  name: faker.name.fullName(),
  duration: faker.datatype.number(),
  rating: faker.datatype.number(),
  genre: faker.name.fullName(),
  releaseDate: faker.datatype.number(),
  cast: faker.name.fullName(),
  director: faker.name.fullName(),
  type: sample(['phim lẻ', 'phim bộ']),
  status: sample(['active', 'inactive']),

  description: faker.lorem.paragraph(),
  images: faker.image.imageUrl(),
  trailerUrl: faker.image.imageUrl(),
  videoUrl: faker.image.imageUrl(),
  country: faker.name.fullName(),
  avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg`,
}));

export default movies;
