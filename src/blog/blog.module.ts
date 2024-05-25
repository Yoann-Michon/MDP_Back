import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog} from './entities/blog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Blog])],
  controllers: [BlogController],
  providers: [BlogService, 
    //garantit que les DTOs sont utilisés efficacement et que les données transférées sont valides avant d'être traitées par vos services ou contrôleurs
    {provide: APP_PIPE, useClass: ValidationPipe}
  ],
  exports:[BlogService]
})
export class BlogModule {}
