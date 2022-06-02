import { postman } from "../postman";

const id = 'fbffcdf9-5884-41d4-90c3-99ef68049003'

postman.delete(`http://localhost:8080/user/delete/${id}`)
