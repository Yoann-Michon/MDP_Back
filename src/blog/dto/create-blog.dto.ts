import {
  IsNotEmpty,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateBlogDto {
  @IsNotEmpty()
  @MaxLength(100)
  title: string;
  @Min(0)
  content: string;
  @IsUrl()
  link: string;
}
