import { Context, Hono } from "hono";

import { isValidObjectId } from "mongoose";
import { Announcement } from "../models/announcement";
import { Categorie } from "../models/categorie";
import { Skill } from "../models/skill";

const announcements = new Hono().basePath("/announcements");

announcements.get("/", async (c) => {
  const announcement = await Announcement.find(
    { is_activate: true },
    {},
    { populate: "skills" }
  );
  return c.json(announcement);
});

announcements.get("/:id", async (c) => {
  const _id = c.req.param("id");
  if (isValidObjectId(_id)) {
    const announcement = await Announcement.findOne({ _id })
      .populate("skills createdBy registeredUsers")
      .populate({
        path: "createdBy",
        populate: {
          path: "reviews",
          populate: {
            path: "reviewer",
            model: "user", // Ensure you use the correct model name
          },
        },
      });

    if (!announcement) {
      return c.json({ msg: "Announcement not found" }, 404);
    }

    return c.json({ announcement });
  }
  return c.json({ msg: "ObjectId malformed" }, 400);
});

announcements.post("/", async (c) => {
  const body = await c.req.json();
  try {
    const newAnnouncement = new Announcement(body);
    const saveAnnouncement = await newAnnouncement.save();
    return c.json(saveAnnouncement, 201);
  } catch (error: unknown) {
    // @ts-ignore
    return c.json(error._message, 400);
  }
});

announcements.get("/category/:id", async (c: Context) => {
  try {
    const categoryId = c.req.param("id");

    // Find the category
    const category = await Categorie.findById(categoryId);
    if (!category) {
      return c.json({ message: "Category not found" }, 404);
    }

    // Find skills in this category
    const skills = await Skill.find({ categories: categoryId });

    // Find announcements with these skills
    const announcements = await Announcement.find({
      is_activate: true,
      skills: { $in: skills.map((s) => s._id) },
    }).populate("skills createdBy");

    return c.json(announcements);
  } catch (error) {
    console.error("Error fetching announcements by category:", error);
    return c.json({ message: "Internal server error" }, 500);
  }
});

announcements.get("/skills/:id", async (c: Context) => {
  try {
    const _id = c.req.param("id");

    // Find skills in this category
    const skills = await Skill.find({ _id });

    // Find announcements with these skills
    const announcements = await Announcement.find({
      is_activate: true,
      skills: { $in: skills.map((s) => s._id) },
    }).populate("skills createdBy");

    return c.json({ announcements });
  } catch (error) {
    console.error("Error fetching announcements by category:", error);
    return c.json({ message: "Internal server error" }, 500);
  }
});

// en put, on écrase toutes les valeurs (y compris les tableaux)
announcements.put("/:id", async (c) => {
  const _id = c.req.param("id");
  const body = await c.req.json();
  // on attrape l'id de la creations (_id)
  // on a besoin du body pour les champs à mettre à jour
  // on peut préparer notre query pour findOneAndUpdate
  const q = {
    _id,
  };
  const updateQuery = {
    ...body,
  };
  // par défaut il va faire un $set

  const tryToUpdate = await Announcement.findOneAndUpdate(q, updateQuery, {
    new: true,
  });
  return c.json(tryToUpdate, 200);
});
// en patch, on va "append" les éléments passés dans le body
announcements.patch("/:id", async (c) => {
  const _id = c.req.param("id");
  const body = await c.req.json();
  // on attrape l'id de la creations (_id)
  // on a besoin du body pour les champs à mettre à jour
  // on peut préparer notre query pour findOneAndUpdate
  const q = {
    _id,
  };
  const { title, description, picture, skills, is_activate } = body;

  const updateQuery = {
    $set: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(picture !== undefined && { picture }),
      ...(skills !== undefined && { skills }),
      ...(is_activate !== undefined && { is_activate }),
    },
  };

  const tryToUpdate = await Announcement.findOneAndUpdate(q, updateQuery, {
    new: true,
  });
  return c.json(tryToUpdate, 200);
});

announcements.delete("/:id", async (c) => {
  const _id = c.req.param("id");
  const tryToDelete = await Announcement.deleteOne({ _id });
  const { deletedCount } = tryToDelete;
  if (deletedCount) {
    return c.json({ msg: "DELETE done" });
  }
  return c.json({ msg: "not found" }, 404);
});

announcements.get("/creator/:id", async (c) => {
  const _id = c.req.param("id");
  try {
    const announcement = await Announcement.find({ createdBy: _id }).populate(
      "createdBy"
    );
    return c.json(announcement);
  } catch (error: unknown) {
    // @ts-ignore
    return c.json(error._message, 400);
  }
});

// Search announcements by title
announcements.get("/search/:q", async (c) => {
  const searchQuery = c.req.param("q");

  if (!searchQuery) {
    return c.json({ msg: "Query parameter is missing" }, 400);
  }

  try {
    let filter;

    // Vérifiez si le paramètre est une chaîne JSON valide
    try {
      const parsedQuery = JSON.parse(decodeURIComponent(searchQuery));
      if (typeof parsedQuery === "object" && parsedQuery !== null) {
        // Si c'est un objet JSON, utilisez-le comme filtre
        filter = parsedQuery;
      } else {
        throw new Error("Invalid JSON");
      }
    } catch {
      // Si ce n'est pas un JSON, appliquez la recherche par regex par défaut
      filter = {
        title: { $regex: searchQuery, $options: "i" },
        is_activate: true,
      };
    }

    // Effectuez la recherche dans MongoDB
    const announcements = await Announcement.find(filter, {
      title: 1, // Inclure uniquement le titre
      _id: 1, // Inclure uniquement l'identifiant
    });

    // Formatez les résultats
    const formattedResults = announcements.map((announcement) => ({
      title: announcement.title,
      id: announcement._id,
    }));

    return c.json(formattedResults);
  } catch (error) {
    console.error("Error searching announcements:", error);
    return c.json({ message: "Internal server error" }, 500);
  }
});

// TODO ADD ROUTE FOR REVIEW HERE

export default announcements;
