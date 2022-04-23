'use strict';


/*
Object that can be used to assign a color to each letter.
*/
const colors = {
  A: "#ffff66", B: "#66ff99", C: "#33ccff", D: "#9966ff",
  E: "#3366cc", F: "#00cc66", G: "#ffa07a", H: "#ffa500",
  I: "#f0e68c", J: "#3cb371", K: "#e0ffff", L: "#87ceeb",
  M: "#7b68ee", N: "#e6e6fa", O: "#d8bfd8", P: "#9370db",
  Q: "#ffc0cb", R: "#faebd7", S: "#c0c0c0", T: "#deb887",
  U: "#daa520", V: "#a52a2a", W: "#800000", X: "#87cefa",
  Y: "#4169e1", Z: "#ee82ee"
}


/*
Function that returns the hex color code assigned to each letter.
*/
function getColor( inLetter ) {
  return {background: colors[inLetter]};
}