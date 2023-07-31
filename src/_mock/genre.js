import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const genres = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  name: faker.music.genre(),
  order: faker.datatype.number(),
  status: sample(['active', 'inactive']),
}));

export default genres;
