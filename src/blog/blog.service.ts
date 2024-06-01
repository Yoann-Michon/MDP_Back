import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async create(url: string): Promise<Blog> {
    try {
      const { title, content } = await scrapeArticle(url);
      //const imgbbImageUrl = await uploadImageToImgbb(imageUrl);
  
      const article = new Blog();
      article.title = title;
      article.link = url;
      article.content = content;
     // article.imagelink = imgbbImageUrl;
  
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


async function uploadImageToImgbb(imageUrl: string): Promise<string> {
  const formData = new FormData();
  formData.append("image", imageUrl);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_KEY}`, {
    method: "POST",
    body: formData
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error('Failed to upload image to imgbb');
  }

  return data.data.url;
}

async function scrapeArticle(url: string): Promise<{ title: string, content: string ,imageUrl: string}> {
  //Initialisation du navigateur
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  //Navigation sur la page de l'url
  await page.goto(url);
  //Recuperation du titre, contenue , de image
  const title = await page.$eval('h1', element => element.textContent.trim());
  const content = await page.$$eval('p', elements => elements.slice(0, 2).map(element => element.textContent.trim()).join(' '));
  const imageUrl = await page.$$eval('img', elements => elements[0]?.getAttribute('src') || '');
  //fermeturedu navigateur
  await browser.close();

  return { title, content , imageUrl};
}
