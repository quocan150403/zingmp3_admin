import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const countries = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  name: faker.name.fullName(),
  code: faker.address.countryCode(),
  image: faker.image.imageUrl(),
  language: faker.address.countryCode(),
  currency: faker.finance.currencyCode(),
  telephone: faker.phone.phoneNumber(),
  status: sample(['active', 'inactive']),
}));

export default countries;
