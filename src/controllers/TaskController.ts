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

  static getTaskById = async (req: Request, res: Response): Promise<void> => {
    try {
      res.json(req.task);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
      req.task.name = req.body.name;
      req.task.description = req.body.description;
      await req.task.save();
      res.send("Tarea actualizada correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
      req.project.tasks = req.project.tasks.filter(
        (task) => task.toString() !== req.task.id.toString()
      );
      // await task.deleteOne() // Elimina el documento que existe en la colección de tareas
      // await req.project.save()
      await Promise.allSettled([req.task.deleteOne(), req.project.save()]); // Si hay un error en cualquiera de las dos, se va al catch
      res.send("Tarea eliminada correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static updateStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { status } = req.body;
      req.task.status = status;
      await req.task.save();
      res.send("Tarea actualizada");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
}
