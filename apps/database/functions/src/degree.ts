import { https } from "firebase-functions";
import { firestore } from "firebase-admin";
import { FirestoreDataConverter } from "@google-cloud/firestore";

class Degree {
  hardRequirements: string[];
  name: string;
  static converter: FirestoreDataConverter<Degree> = {
    toFirestore: (degree: Degree) => {
      return {
        name: degree.name,
        hardRequirements: degree.hardRequirements,
      };
    },
    fromFirestore: (snapshot) => {
      const data = snapshot.data();
      return new Degree(data.name, data.hardRequirements);
    },
  };
  constructor(name: string, hardRequirements: string[]) {
    this.name = name;
    this.hardRequirements = hardRequirements;
  }
}

export const initDegree = https.onRequest(async (req, res) => {
  const collectionRef = firestore().collection("degrees").withConverter(Degree.converter);
  const degree = new Degree("Computer Science", [
    "CS1101S",
    "CS1231S",
    "CS2030S",
    "CS2040S",
  ]);
  await collectionRef.add(degree)
  res.json({
    message: "created degree",
  });
});
