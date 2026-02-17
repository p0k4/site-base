import { z } from "zod";
import { isExternalUrl } from "../utils/externalSources";

const listingBaseObject = z.object({
  title: z.string().min(3, "Titulo curto demais."),
  category: z.string().min(1, "Categoria obrigatoria."),
  condition: z.string().min(1, "Condicao obrigatoria."),
  price: z.number().min(0),
  location: z.string().min(2, "Localizacao obrigatoria."),
  description: z.string().min(10, "Descricao curta demais."),
  status: z.enum(["active", "paused", "closed"]).optional(),
  source_type: z.enum(["internal", "external"]).optional(),
  source_name: z.string().max(80).optional(),
  external_url: z.string().optional(),
  external_ref: z.string().max(120).optional(),
  sourceType: z.enum(["internal", "external"]).optional(),
  sourceName: z.string().max(80).optional(),
  externalUrl: z.string().optional(),
  externalRef: z.string().max(120).optional()
});

const applyListingRefinements = <T extends z.ZodTypeAny>(schema: T) =>
  schema.superRefine((data: any, ctx) => {
    const externalUrlSnake = data.external_url;
    const externalUrlCamel = data.externalUrl;
    if (externalUrlSnake && !isExternalUrl(externalUrlSnake)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Link externo invalido.",
        path: ["external_url"]
      });
    }
    if (externalUrlCamel && !isExternalUrl(externalUrlCamel)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Link externo invalido.",
        path: ["externalUrl"]
      });
    }

    const sourceType = data.source_type ?? data.sourceType;
    const externalUrl = externalUrlSnake ?? externalUrlCamel;

    if (sourceType === "external" && !externalUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Link externo obrigatorio para anuncios externos.",
        path: ["external_url"]
      });
    }
  });

const listingBaseSchema = applyListingRefinements(listingBaseObject);
const listingBasePartialSchema = applyListingRefinements(listingBaseObject.partial());

export const listingCreateSchema = z.object({
  body: listingBaseSchema
});

export const listingUpdateSchema = z.object({
  body: listingBasePartialSchema
});

export const listingStatusSchema = z.object({
  body: z.object({
    status: z.enum(["active", "paused", "closed"])
  })
});

export const listingFeaturedSchema = z.object({
  body: z.object({
    is_featured: z.boolean().optional(),
    isFeatured: z.boolean().optional()
  }).refine((data) => typeof data.is_featured === "boolean" || typeof data.isFeatured === "boolean", {
    message: "is_featured obrigatorio.",
    path: ["is_featured"]
  })
});

export const listingFilterSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    category: z.string().optional(),
    condition: z.string().optional(),
    priceMin: z.string().optional(),
    priceMax: z.string().optional(),
    location: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional()
  })
});

export const listingImportSchema = z.object({
  body: z.object({
    external_url: z.string().optional(),
    externalUrl: z.string().optional()
  }).superRefine((data, ctx) => {
    const externalUrlSnake = data.external_url;
    const externalUrlCamel = data.externalUrl;
    const externalUrl = externalUrlSnake ?? externalUrlCamel;

    if (!externalUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Link externo obrigatorio.",
        path: ["external_url"]
      });
      return;
    }

    if (externalUrlSnake && !isExternalUrl(externalUrlSnake)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Link externo invalido.",
        path: ["external_url"]
      });
    }

    if (externalUrlCamel && !isExternalUrl(externalUrlCamel)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Link externo invalido.",
        path: ["externalUrl"]
      });
    }
  })
});
