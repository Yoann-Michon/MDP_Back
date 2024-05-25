import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entity/products.entity';
import { UpdateProductDto } from './dto/update-products.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(product: Product): Promise<Product> {
    try {
      //const response = await fetch(`https://api.imgbb.com/1/upload?expiration=0&key=${process.env.KEY_IMGBB}`,{
      //  method: "POST",
      //  body: product.locationImg,
      //});
      //const data=await response.json();
      //console.log(data)
      //product.locationImg=data.data.image.url;
      return await this.productRepository.save(product);
      
    } catch (error) {
      throw new ConflictException();
    }
  }

  async findAll() {
    try {
      return await this.productRepository.find();
      
    } catch (error) {
      throw new ConflictException();
    }
  }

  async findOne(id: number) {
    try {
      return await this.productRepository.findOneBy({ id });
    } catch (error) {
      throw new ConflictException();
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    await this.productRepository.update(id, updateProductDto);
    return await this.productRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }
}
