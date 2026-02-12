import { Designer } from "../models/designer";
import { SceneObject } from "../models/sceneObject";
import { LS_KEYS, sleep, storage } from "./storage";

export const designersApi = {
  async getAll(): Promise<Designer[]> {
    await sleep(200);
    return storage.get<Designer[]>(LS_KEYS.designers, []);
  },
  async create(designer: Designer): Promise<Designer> {
    await sleep(200);
    const current = storage.get<Designer[]>(LS_KEYS.designers, []);
    storage.set(LS_KEYS.designers, [...current, designer]);
    return designer;
  },
};

export const objectsApi = {
  async getAll(): Promise<SceneObject[]> {
    await sleep(200);
    return storage.get<SceneObject[]>(LS_KEYS.objects, []);
  },
  async create(obj: SceneObject): Promise<SceneObject> {
    await sleep(200);
    const current = storage.get<SceneObject[]>(LS_KEYS.objects, []);
    storage.set(LS_KEYS.objects, [...current, obj]);
    return obj;
  },
  async update(obj: SceneObject): Promise<SceneObject> {
    await sleep(150);
    const current = storage.get<SceneObject[]>(LS_KEYS.objects, []);
    const next = current.map((x) => (x.id === obj.id ? obj : x));
    storage.set(LS_KEYS.objects, next);
    return obj;
  },
  async remove(id: string): Promise<void> {
    await sleep(150);
    const current = storage.get<SceneObject[]>(LS_KEYS.objects, []);
    storage.set(
      LS_KEYS.objects,
      current.filter((x) => x.id !== id),
    );
  },
};
