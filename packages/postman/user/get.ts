import { postman } from "../postman";

const id = "2b931db3-bb49-4c71-b6dd-bb89e39d9308";

postman.get(`http://localhost:8080/user/get/${id}`);
