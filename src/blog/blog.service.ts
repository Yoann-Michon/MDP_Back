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
    console.log(url)
    try {
      const { title, content, imageUrl } = await scrapeArticle(url);
      console.log(title);
      console.log(content);
      console.log(imageUrl);
      
      //const imgbbImageUrl = await uploadImageToImgbb(imageUrl);
      const article = new Blog();
      article.title = title;
      article.link = url;
      article.content = content;
      article.imageLink = imageUrl;
      console.log(article)
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

async function scrapeArticle(url: string): Promise<{ title: string, content: string, imageUrl: string }> {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu'
    ]
  });

  const page = await browser.newPage();

  // Définir un User-Agent pour éviter d'être bloqué
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3');

  // Navigation sur la page de l'url
  const response = await page.goto(url, {
    waitUntil: 'networkidle2',
    timeout: 30000 
  });

  

  let title = '';
  let content = '';
  let imageUrl = '';

  try {
    // Attendre que le titre soit disponible
    await page.waitForSelector('h1, h2', { timeout: 5000 });

    // Récupération du titre
    try {
      title = await page.$eval('h1', element => element.textContent?.trim() || '');
    } catch {
       title = await page.$$eval('h2', elements => elements.slice(0, 2)[1].textContent?.trim());
    }
    console.log(title);
    
  } catch (error) {
    console.error('Erreur lors de la récupération du titre:', error);
  }
  
  try {
    // Attendre que le contenu soit disponible
    await page.waitForSelector('p', { timeout: 5000 });

    // Récupération du contenu
    content = await page.$$eval('p', elements => elements.slice(0, 2).map(element => element.textContent?.trim()).join(' '));
    console.log(content)
  } catch (error) {
    console.error('Erreur lors de la récupération du contenu:', error);
  }

  try {
    // Attendre que l'image soit disponible
    await page.waitForSelector('img', { timeout: 5000 });

    // Récupération de l'image avec vérification de la largeur
    imageUrl = await page.$$eval('img', elements => {
      for (let img of elements) {
        const width = img.naturalWidth || img.width;
        if (width >= 100) {
          return img.getAttribute('src') || '';
        }
      }
      return '';
      console.log(imageUrl);
      
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'image:', error);
  }

  // Fermeture du navigateur
  await browser.close();

  return { title, content, imageUrl };
}

