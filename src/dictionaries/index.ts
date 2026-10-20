import { en } from "./en";
import { id } from "./id";
import { ja } from "./ja";

// Tentukan tipe dictionary agar TypeScript bisa autocompletion
export type Dictionary = typeof en;

const dictionaries = {
    en,
    id,
    ja,
};

export const getDictionary = (lang: "en" | "id" | "ja"): Dictionary => {
    return dictionaries[lang] || dictionaries.en;
};