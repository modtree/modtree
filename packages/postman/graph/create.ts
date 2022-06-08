import { postman } from "../postman";

const graph = {
  userId: "7e0000d8-48a9-41e0-8163-8466f6381d46",
  degreeId: "456ffd23-1d48-48da-beec-532ce058f902",
  modulesPlacedCodes: [],
  modulesHiddenCodes: [],
  pullAll: true,
};

postman.post("http://localhost:8080/graph/create", graph);
