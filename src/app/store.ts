import { create } from "zustand";
import { nanoid } from "nanoid";
import { Designer } from "../models/designer";
import { SceneObject } from "../models/sceneObject";
import { designersApi, objectsApi } from "./mockApi";

type AppState = {
  designers: Designer[];
  objects: SceneObject[];
  selectedDesignerId: string | null;
  selectedObjectId: string | null;

  boot: () => Promise<void>;

  setSelectedDesignerId: (id: string | null) => void;
  selectObject: (id: string | null) => void;

  addDesigner: (data: { fullName: string; workingHours: number }) => Promise<void>;

  addObjectAt: (pos: [number, number, number]) => Promise<{ ok: true } | { ok: false; reason: string }>;
  updateObject: (id: string, patch: Partial<SceneObject>) => Promise<void>;
  deleteSelectedObject: () => Promise<void>;

  getDesignerById: (id: string) => Designer | undefined;
  getSelectedObject: () => SceneObject | undefined;
};

export const useAppStore = create<AppState>((set, get) => ({
  designers: [],
  objects: [],
  selectedDesignerId: null,
  selectedObjectId: null,

  async boot() {
    const [designers, objects] = await Promise.all([
      designersApi.getAll(),
      objectsApi.getAll()
    ]);
    set({ designers, objects });
  },

  setSelectedDesignerId(id) {
    set({ selectedDesignerId: id });
  },

  selectObject(id) {
    set({ selectedObjectId: id });
  },

  async addDesigner(data) {
    const designer: Designer = {
      id: nanoid(),
      fullName: data.fullName.trim(),
      workingHours: data.workingHours
    };
    await designersApi.create(designer);
    const designers = await designersApi.getAll();
    set({ designers });
  },

  async addObjectAt(pos) {
    const designerId = get().selectedDesignerId;
    if (!designerId) return { ok: false, reason: "Before adding an object, select a designer." };

    const obj: SceneObject = {
      id: nanoid(),
      name: `Object ${get().objects.length + 1}`,
      designerId,
      color: "#2276FC",
      position: pos,
      size: "normal"
    };

    await objectsApi.create(obj);
    const objects = await objectsApi.getAll();
    set({ objects, selectedObjectId: obj.id });
    return { ok: true };
  },

  async updateObject(id, patch) {
    const obj = get().objects.find((x) => x.id === id);
    if (!obj) return;
    const next: SceneObject = { ...obj, ...patch };
    await objectsApi.update(next);
    const objects = await objectsApi.getAll();
    set({ objects });
  },

  async deleteSelectedObject() {
    const id = get().selectedObjectId;
    if (!id) return;
    await objectsApi.remove(id);
    const objects = await objectsApi.getAll();
    set({ objects, selectedObjectId: null });
  },

  getDesignerById(id) {
    return get().designers.find((d) => d.id === id);
  },

  getSelectedObject() {
    const id = get().selectedObjectId;
    if (!id) return undefined;
    return get().objects.find((o) => o.id === id);
  }
}));