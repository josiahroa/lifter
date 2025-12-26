import { PipeTransform, BadRequestException } from "@nestjs/common";
import { z } from "zod";

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: z.ZodTypeAny) {}

  transform(value: unknown): unknown {
    try {
      /**
       * Zod 4 does not allow type inference for the parse method, so we need to disable the type safety.
       */
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      console.error(error);
      throw new BadRequestException("Validation failed");
    }
  }
}
