export type Face = "front" | "back";
export type Model = "men" | "women";
export interface PainArea {
  key: string;
  x: number;
  y: number;
  size: number;
  level: number;
  face: Face;
}
