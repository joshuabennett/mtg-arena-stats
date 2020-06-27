import { firestore } from "../firebase/firebase";

export const addToAllColors = (set, color, deck) => {
  firestore
    .collection("mergedData")
    .doc(set)
    .collection("allColors")
    .doc(color)
    .get()
    .then((snapshot) => {
      if (snapshot.exists) {
        firestore
          .collection("mergedData")
          .doc(set)
          .collection("allColors")
          .doc(color)
          .update({
            wins: snapshot.data().wins + parseInt(deck.wins),
            losses: snapshot.data().losses + parseInt(deck.losses),
          });
      } else {
        firestore
          .collection("mergedData")
          .doc(set)
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
