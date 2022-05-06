import {https} from "firebase-functions";
import {firestore} from "firebase-admin";
import {FirestoreDataConverter} from "@google-cloud/firestore";
import utils from "../utils";

export class Degree {
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
  static empty = new Degree("", []);
  constructor(name: string, hardRequirements: string[]) {
    this.name = name;
    this.hardRequirements = hardRequirements;
  }
  getHardRequirements() {
    return this.hardRequirements;
  }
}

export const initDegree = https.onRequest(async (req, res) => {
  const collectionRef = firestore()
      .collection("degrees")
      .withConverter(Degree.converter);
  const degree = new Degree("Computer Science", [
    "CS1101S",
    "CS1231S",
    "CS2030S",
    "CS2040S",
  ]);
  await collectionRef.add(degree);
  res.json({
    message: "created degree",
  });
});

export const getDegree = https.onRequest(async (req, res) => {
  const collectionRef = firestore().collection("degrees");
  const query = collectionRef.where("name", "==", "Computer Science");
  const snapshot = await query.withConverter(Degree.converter).get();
  const result: Degree[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    result.push(data);
  });
  if (result.length === 0) {
    res.json({
      message: "no degree found",
    });
    return;
  }
  const one = result[0];
  const tree: any[] = [];
  const awaitStack: any[] = [];
  one.hardRequirements.forEach((mod) => {
    awaitStack.push(utils.getMod({moduleCode: mod}));
  });
  const data = await Promise.allSettled(awaitStack);
  data.forEach((moduleResult: any) => {
    tree.push(moduleResult.value[0].prereqTree || []);
  });

  res.json({
    tree,
  });
});
