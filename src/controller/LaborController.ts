import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Labor } from "../entity/Labor";
import * as laborService from "../service/LaborService"
import { BasicUserInfo } from "../interface/BasicUserInfo";

const laborRepository = AppDataSource.getRepository(Labor);

export async function all(req: Request, res: Response) {
    const labores: Labor[] = await laborService.all();
    res.send(labores);
};

export async function findById(req: Request, res: Response) {
    const labor: Labor = await laborService.findById(req.params.id);
    res.send(labor);
};

export async function findByUsuario(req: Request, res: Response) {
    const labor: Labor[] = await laborService.findByUsuario(req.params.id);
    res.send(labor);
};

export async function listarInactivasByUsuario(req: Request, res: Response) {
    const user: BasicUserInfo = req.user;
    const labor: Labor[] = await laborService.listarInactivasByUsuario(user.celular);
    res.send(labor);
};

export async function listarDisponibles(req: Request, res: Response) {
    const labor: Labor[] = await laborService.listarDisponibles();
    res.send(labor);
};

export async function save(req: Request, res: Response) {
    const newLabor: Labor[] = laborRepository.create(req.body);
    await laborService.save(newLabor);
    res.send(newLabor);
}

async function helloWorld() {
    return "Hello World";
}

function helloWorld2() {
    return "Hello World";
}

export function helloWorld3() {
    return "Hello World3";
}

export function helloWorld4() {
    return "Hello World4";
}

