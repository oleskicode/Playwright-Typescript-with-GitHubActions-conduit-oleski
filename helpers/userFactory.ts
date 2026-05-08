import { faker } from "@faker-js/faker";

export interface User {
  username: string;
  email: string;
  password: string;
  bio?: string;
}

export const createUser = (overrides?: Partial<User>): User => {
  return {
    username: faker.person.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 12 }),
    bio: faker.person.bio(),
    ...overrides,
  };
};
