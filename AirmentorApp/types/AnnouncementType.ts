import { z } from "zod";
import type { SkillType } from "~/types/SkillType";
import type { UserType } from "~/types/UserType";

export type AnnouncementType = {
  _id: string;
  title: string;
  description: string;
  picture: string;
  skills: SkillType[];
  is_activate: boolean;
  createdBy: UserType;
  registeredUsers: UserType[];
};

export const AnnouncementSchema = z.object({
  _id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  picture: z.string().url("Must be a valid URL").nullable(),
  skills: z.array(z.object({})),
  is_activate: z.boolean(),
  createdBy: z.object({}),
});
