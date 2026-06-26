import { faker } from "@faker-js/faker";

export interface User {
  username: string;
  email: string;
  password: string;
  bio?: string;
}

export const createUser = (overrides?: Partial<User>): User => {
  // Append a unique suffix to guarantee no clash in test data
  const uniqueSuffix = `${Date.now()}${Math.floor(Math.random() * 100000)}`;

  return {
    username: `${faker.person.firstName()}${uniqueSuffix}`,
    email: `${uniqueSuffix}.${faker.internet.email()}`,
    password: faker.internet.password({ length: 12 }),
    bio: faker.person.bio(),
    ...overrides,
  };
};
