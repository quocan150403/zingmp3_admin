import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const ages = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  name: faker.name.fullName(),
  description: faker.lorem.paragraph(),
  minimum: faker.datatype.number(),
  status: sample(['active', 'inactive']),
}));

export default ages;
