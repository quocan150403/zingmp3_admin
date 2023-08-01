import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const subscriptions = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  name: faker.name.fullName(),
  price: faker.datatype.number(),
  duration: sample(['1 tháng', '3 tháng', '6 tháng', '12 tháng']),
  benefits: sample(['HD', '4K']),
  isFeatured: sample(['yes', 'no']),
  status: sample(['active', 'inactive']),
}));

export default subscriptions;
