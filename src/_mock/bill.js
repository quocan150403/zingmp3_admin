import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const bills = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg`,
  name: faker.name.fullName(),
  start: faker.date.past(),
  end: faker.date.future(),
  type: sample(['basic', 'premium']),
  total: faker.datatype.number(),
  method: sample(['credit_card', 'paypal']),
  status: sample(['active', 'inactive']),
}));

export default bills;
