import { z } from "zod";

export const analyzeRequestSchema = z.object({
  url: z
    .string()
    .trim()
    .min(3, "Ange en URL.")
    .max(2048, "URL:en är för lång.")
    .transform((value) => {
      const raw = value.trim();
      if (/^https?:\/\//i.test(raw)) return raw;
      return `https://${raw}`;
    })
    .refine((value) => {
      try {
        const u = new URL(value);
        return u.protocol === "http:" || u.protocol === "https:";
      } catch {
        return false;
      }
    }, "Ogiltig URL."),
  intent: z.enum(["teaser", "snabb", "djup"]).optional().default("teaser"),
  fax_number: z.string().optional(),
});
