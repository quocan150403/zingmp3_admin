import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const artists = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  name: faker.name.fullName(),
  role: sample(['actor', 'director']),
  bio: faker.lorem.paragraph(),
  avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg`,
  birthday: faker.datatype.number(),
  country: faker.name.fullName(),
  status: sample(['active', 'inactive']),
}));

export default artists;
