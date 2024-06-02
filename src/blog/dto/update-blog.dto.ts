import { PartialType } from '@nestjs/mapped-types';
import { CreateBlogDto } from './create-blog.dto';

export class UpdateBlogDto extends PartialType(CreateBlogDto) {
    id:number;
    title?: string;
    content?: string;
    link?: string;
    imageLink?: string;
}
