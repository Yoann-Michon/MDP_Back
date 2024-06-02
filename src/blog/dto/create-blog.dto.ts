import {
  IsNotEmpty,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateBlogDto {
  @IsNotEmpty()
  @MaxLength(100)
  title: string;
  content: string;
  @IsUrl()
  link: string;
  @IsUrl()
  imageLink: string;
}
