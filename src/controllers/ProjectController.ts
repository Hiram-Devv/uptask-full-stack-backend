import type { Request, Response } from "express";
import Project from "../models/Project";
import mongoose from "mongoose";

export class ProjectController {
  static createProject = async (req: Request, res: Response): Promise<void> => {
    const project = new Project(req.body);
    try {
      await project.save();
      res.send("Proyecto creado correctamente");
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al crear el proyecto" });
    }
  };
  static getAllProjects = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const projects = await Project.find({});
      res.json(projects);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener los proyectos" });
    }
  };
  static getProjectById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;
    try {
      const project = await Project.findById(id).populate("tasks");
      if (!project) {
        const error = new Error("Proyecto no encontrado");
        res.status(404).json({ error: error.message });
        return;
      }
      res.json(project);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error del servidor" });
    }
  };
  static updateProject = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const project = await Project.findByIdAndUpdate(id, req.body);

      if (!project) {
        const error = new Error("Proyecto no encontrado");
        res.status(404).json({ error: error.message });
        return;
      }
      await project.save();
      res.send("Proyecto actualizado");
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error del servidor" });
    }
  };
  static deleteProyect = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const project = await Project.findById(id);
      //Comprobar si existe el proyecto
      if (!project) {
        const error = new Error("Proyecto no encontrado");
        res.status(404).json({ error: error.message });
        return;
      }
      await project.deleteOne();
      res.send("Proyecto eliminado");
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error del servidor" });
    }
  };
}
