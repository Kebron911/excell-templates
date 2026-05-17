import { z } from "zod";
import { PinInputSchema } from "@str/pinforge";

export const PostPinBodySchema = PinInputSchema;
export type PostPinBody = ReturnType<typeof PinInputSchema.parse>;

export const PostPinSyncQuerySchema = z.object({
  sync: z.enum(["1", "true"]).optional()
});
