export type ObjectSize = "small" | "normal" | "large";

export type SceneObject = {
  id: string;
  name: string;
  designerId: string;
  color: string;
  position: [number, number, number];
  size: ObjectSize;
};
