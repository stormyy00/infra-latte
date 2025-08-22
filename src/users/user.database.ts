import express, { Request, Response } from 'express';
import { User, UnitUser, Users } from './user.interface';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

const users: Users = {}; // In-memory "database"

// Get all users
router.get('/', (req: Request, res: Response) => {
  res.json(Object.values(users));
});

// Add a new user
// router.post('/', (req: Request, res: Response) => {
//   const { username, email, password, firstName, lastName } = req.body;

//   if (!username || !email || !password) {
//     return res.status(400).json({ message: 'Username, email, and password are required' });
//   }
//   const usernameKey = Object.keys(users).find(key => users[key].username === username);
//   if (usernameKey && users[usernameKey]) {
//     return res.status(409).json({ message: 'Username already exists' });
//   }
//   const emailKey = Object.keys(users).find(key => users[key].email === email);
//   if (emailKey && users[emailKey]) {
//     return res.status(409).json({ message: 'Email already exists' });
//   }

//   const id = uuidv4();
//   const newUser: UnitUser = { id, username, email, password, firstName, lastName };
//   users[id] = newUser;
//   console.log(`User added: ${JSON.stringify(newUser)}`);
//   return res.status(201).json(newUser);
// });

// Get a specific user
// router.get('/:id', (req: Request, res: Response) => {
//   const user = users[req.params.id];
//   if (!user) {
//     return res.status(404).json({ message: 'User not found' });
//   }
//   res.json(user);
// });

export default router;

const mockUsers: Omit<UnitUser, 'id'>[] = [
  {
    username: 'jdoe',
    email: 'jdoe@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
  },
  {
    username: 'asmith',
    email: 'asmith@example.com',
    password: 'securepass',
    firstName: 'Alice',
    lastName: 'Smith',
  },
  {
    username: 'bwayne',
    email: 'bwayne@waynecorp.com',
    password: 'darkknight',
    firstName: 'Bruce',
    lastName: 'Wayne',
  },
];

mockUsers.forEach((user) => {
  const id = uuidv4();
  users[id] = { id, ...user };
});