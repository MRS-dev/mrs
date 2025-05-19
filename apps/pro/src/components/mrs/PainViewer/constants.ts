import { Face, Model } from "./types";

export const EDITORS_IMAGES: Record<Model, Record<Face, string>> = {
  men: {
    front: "/front.png",
    back: "/back.png",
  },
  women: {
    front: "/front.png",
    back: "/back.png",
  },
};

export const PAIN_PICKER_VALUES = [
  {
    emoji: "😀",
    label: "Pas de douleur",
    className: "bg-green-500 border-green-500 text-green-500 font-bold",
  },
  {
    emoji: "😊",
    label: "Douleur légère",
    className: "bg-green-400 border-green-400 text-green-400 font-bold",
  },
  {
    emoji: "🙂",
    label: "Douleur modérée",
    className: "bg-yellow-300 border-yellow-300 text-yellow-300 font-bold",
  },
  {
    emoji: "😐",
    label: "Douleur gênante",
    className: "bg-yellow-400 border-yellow-400 text-yellow-400 font-bold",
  },
  {
    emoji: "😕",
    label: "Douleur désagréable",
    className: "bg-yellow-500 border-yellow-500 text-yellow-500 font-bold",
  },
  {
    emoji: "😟",
    label: "Douleur intense",
    className: "bg-orange-500 border-orange-500 text-orange-500 font-bold",
  },
  {
    emoji: "😣",
    label: "Douleur très intense",
    className: "bg-orange-600 border-orange-600 text-orange-600 font-bold",
  },
  {
    emoji: "😫",
    label: "Douleur sévère",
    className: "bg-red-500 border-red-500 text-red-500 font-bold",
  },
  {
    emoji: "😭",
    label: "Douleur très sévère",
    className: "bg-red-600 border-red-600 text-red-600 font-bold",
  },
  {
    emoji: "😡",
    label: "Douleur extrême",
    className: "bg-red-700 border-red-700 text-red-700 font-bold",
  },
  {
    emoji: "😵",
    label: "Douleur insupportable",
    className: "bg-red-800 border-red-800 text-red-800 font-bold",
  },
];
