import { BadRequestException, ParseIntPipe } from '@nestjs/common';

export function generateParseIntPipe(msg: string): ParseIntPipe {
  return new ParseIntPipe({
    exceptionFactory() {
      throw new BadRequestException(msg);
    },
  });
}
