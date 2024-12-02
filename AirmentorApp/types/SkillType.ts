import { z } from "zod";

export type SkillType = {
    title: string;
    categories: string;
    _id?: string;
};

export const SkillSchema = z.object({
    _id: z.string().optional(),
    title: z.string().min(1, 'La compétence est obligatoire'),
    categories: z.string().min(1, 'La catégorie est obligatoire'),
});

