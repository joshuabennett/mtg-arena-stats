import { firestore } from "firebase";

export const addToAllColors = (color, deck) => {
  firestore
    .collection("allColors")
    .doc(color)
    .get()
    .then((snapshot) => {
      if (snapshot.exists) {
        firestore
          .collection("allColors")
          .doc(color)
          .update({
            wins: snapshot.data().wins + parseInt(deck.wins),
            losses: snapshot.data().losses + parseInt(deck.losses),
          });
      } else {
        firestore
          .collection("allColors")
          .doc(color)
          .set({
            wins: parseInt(deck.wins),
            losses: parseInt(deck.losses),
            mono: color.length === 1 ? true : false,
            string: color,
          });
      }
    });
};
