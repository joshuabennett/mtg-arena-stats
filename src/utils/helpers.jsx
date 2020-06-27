import React from "react";

export const FACTION_MAP = {
  Azorious: ["u", "w"],
  Izzet: ["r", "u"],
  Dimir: ["b", "u"],
  Simic: ["g", "u"],
  Boros: ["r", "w"],
  Orzhov: ["b", "w"],
  Selesnya: ["g", "w"],
  Rakdos: ["b", "r"],
  Gruul: ["g", "r"],
  Golgari: ["b", "g"],
};

export const colorsToString = (colors, type = "colored") => {
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
  colors.sort();
  console.log(colors);
  Object.keys(FACTION_MAP).forEach((faction) => {
    if (
      colors.includes(FACTION_MAP[faction][0]) &&
      colors.includes(FACTION_MAP[faction][1])
    ) {
      factions.push(faction);
    }
  });
  console.log(factions);
  return factions;
};
