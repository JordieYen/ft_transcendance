import { Achievement } from 'src/typeorm/achievement.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(Achievement, (faker) => ({
  name: faker.person.firstName(),
  description: faker.person.bio(),
}));
