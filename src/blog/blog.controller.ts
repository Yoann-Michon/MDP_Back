import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BlogService } from './blog.service';
import { Blog } from './entities/blog.entity';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  async create(@Body('url') url:string): Promise<Blog>  {
    console.log(url)
    return await this.blogService.create(url);
  }

  @Get()
  async findAll() {
    return await this.blogService.findAll();
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.blogService.remove(+id);
  }
}