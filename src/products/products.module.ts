import { Module, ValidationPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entity/products.entity';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports:[ TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [ProductsService,
    //garantit que les DTOs sont utilisés efficacement et que les données transférées sont valides avant d'être traitées par vos services ou contrôleurs
  {provide: APP_PIPE, useClass: ValidationPipe}],
  exports:[ProductsService]
})
export class ProductsModule {}
