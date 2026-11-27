import { BadRequestException, Injectable, type PipeTransform } from '@nestjs/common';

@Injectable()
export class ApplyAllocationBodyPipe implements PipeTransform<unknown, undefined> {
  transform(value: unknown) {
    if (value !== undefined && (!value || typeof value !== 'object' ||
        Array.isArray(value) || Object.keys(value).length > 0)) {
      throw new BadRequestException('Yêu cầu Apply chỉ nhận body rỗng.');
    }
    return undefined;
  }
}
