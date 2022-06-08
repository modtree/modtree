import { postman } from "../postman";

// const id = "40c11cc9-adc1-4d9a-b0a7-3ec1a4e5cf75";
const id = "40c11cc9-adc1-4d9a-b0a7-3ec1a4e5cf78";
postman.post(`http://localhost:8080/graph/id/${id}/toggle/CS1010`);
