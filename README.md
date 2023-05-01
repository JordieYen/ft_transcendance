# transcendence
This is a project of 42 to create a pong contest website .

# Setting postgres
1. Install postgress, pgadmin4 and npm install typeorm.
2. import typeorm into app.module.ts in backend
3. Create entity, services and controller, dtos
4. initdb -D path to store data directory

```
npm install --save @nestjs/typeorm typeorm pg
```

# Protected against SQL injections (parameteriezed quaries)
```
 @Get(':id')
  async getUserById(@Param('id') id: number): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
  }
```

# Server-side validation for forms and any user input (DTO, class-validator decoratora)
```
import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class UserController {
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<void> {
    // Validate user input
    const errors = await validate(createUserDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // Save user to database
    await this.userRepository.save(createUserDto);
  }
}
```

# Reference
1. [Postgresql with nestjs](https://blog.devgenius.io/setting-up-nestjs-with-postgresql-ac2cce9045fe)
2. [TypeOrmCoreModule dependencies issue](https://www.youtube.com/watch?v=O0fzKqswwJs)
3. [42 API](https://api.intra.42.fr/apidoc/guides/web_application_flow)
