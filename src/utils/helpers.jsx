import React from "react";

export const FACTION_MAP = {
  Azorious: ["U", "W"],
  Izzet: ["R", "U"],
  Dimir: ["B", "U"],
  Simic: ["G", "U"],
  Boros: ["R", "W"],
  Orzhov: ["B", "W"],
  Selesnya: ["G", "W"],
  Rakos: ["B", "R"],
  Gruul: ["G", "R"],
  Golgari: ["B", "G"],
};

export const colorsToString = (colors, type) => {
  var colorString = "";
  colors.sort();
  colors.forEach((color) => {
    colorString += color;
  });
  return type.includes("Artifact")
    ? "Artifact"
    : type.includes("Land")
    ? "Land"
    : colorString;
};

export const convertManaToImg = (colors, type) => {
  colors.sort();
  var images = colors.map((color) => {
    return <img src={`/images/Mana_${color}.png`} alt="color" />;
  });
  return type.includes("Artifact")
    ? "Artifact"
    : type.includes("Land")
    ? "Land"
    : images;
};

export const validDeckFactions = (colors) => {
  var factions = [];
  Object.keys(FACTION_MAP).forEach((faction) => {
    if (colors.includes(FACTION_MAP[faction])) {
      factions.push(faction);
    }
  });
  return factions;
};
