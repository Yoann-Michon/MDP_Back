import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { DeleteResult, Repository } from 'typeorm';
import puppeteer from 'puppeteer';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog) private blogRepository: Repository<Blog>,
  ) {}

  async create(url:string): Promise<Blog> {
    const articleUrl = url;
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(articleUrl);
      //await page.screenshot({path: "exemple.png", fullPage: true})
      const articleTitle = await page.$$eval('h1', (elements) => 
        elements.slice(0, 2).map(element => element.textContent.trim())
      );

      const articleContent = await page.$$eval('p', (elements) => 
        elements.slice(0, 2).map(element => element.textContent.trim())
      );
      //const articleImage = await page.$eval('img', (element) => element.getAttribute('src'));

      await browser.close();

      const article = new Blog();
      article.title=articleTitle[0]
      article.link=articleUrl
      article.content=articleContent[0]
      //article.image = articleImage;
      return await this.blogRepository.save(article);
    } catch (error) {
      throw new Error('Failed to create article from URL');
    }
  }

  findAll() {
    try {
      return this.blogRepository.find();
    } catch (error) {
      throw new ConflictException();
    }
  }

  findOne(id: number) {
    try {
      return this.blogRepository.findOneBy({ id });
    } catch (error) {
      throw new ConflictException();
    }
  }

  async update(id: number, updateBlogDto: UpdateBlogDto) {
    let done = await this.blogRepository.update(id, updateBlogDto);
    if (done.affected != 1) throw new NotFoundException(id);
    return this.findOne(id);
  }

  async remove(id: number) {
    let done: DeleteResult = await this.blogRepository.delete(id);
    if (done.affected != 1) throw new NotFoundException(id);
  }
}
