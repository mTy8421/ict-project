import { PartialType } from '@nestjs/mapped-types';
import { CreateUploadTestDto } from './create-upload-test.dto';

export class UpdateUploadTestDto extends PartialType(CreateUploadTestDto) {}
