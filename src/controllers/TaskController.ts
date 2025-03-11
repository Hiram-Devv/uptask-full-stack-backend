import type { Request, Response } from "express";
import Task from "../models/Task";

export class TaskController {
  static createTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const task = new Task(req.body);
      task.project = req.project.id;
      req.project.tasks.push(task.id);
      // Optimizar las promesas y eliminar los dos await
      // Antes
      // await task.save();
      // await req.project.save();
      // Ahora con la mejora
      await Promise.allSettled([task.save(), req.project.save()]); // Si hay un error en cualquiera de las dos, se va al catch
      res.send("Tarea creada correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static getProjectTask = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const tasks = await Task.find({ project: req.project.id }).populate(
        "project"
      );
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
}
