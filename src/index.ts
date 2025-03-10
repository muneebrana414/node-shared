import prisma from "./prisma.js";
import { BaseModel } from "./models/BaseModel.js";
export { BaseModel }

export default prisma

// interface User {
//   id: string;
//   email: string;
//   name: string;
// }

// class UserRepository extends BaseModel<User> {
//   constructor() {
//     super(prisma.users);
//   }
// }


// async function main() {
//   const newModel = new UserRepository();
//   // Create a new user
//   const user = await newModel.create({
//     name: "Alice",
//     email: "alice@example.com"
//   });

//   console.log("New User Created:", user);

//   // Fetch all users
//   const users = await newModel.findAll();
//   console.log("All Users:", users);
// }

// main().catch(console.error);
