import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../config/db.config';
import { generateToken } from '../utils/generateToken';
import jwt from 'jsonwebtoken';

export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    // const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const [existingUsers] = await db('users').where({ email }).select("*");
    console.log('existing users: ', existingUsers)
    if ((existingUsers as any[]).length > 0) {
      res.status(400).json({ message: 'User already exists' });
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const avatarUrl = `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=random`;

    // const [result] = await db.query(
    //   'INSERT INTO users (name, email, password, avatar, role, title, department, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    //   [name, email, hashedPassword, avatarUrl, 'user', 'Team Member', 'General', 'active']
    // );
    // const insertedId = (result as any).insertId;
    // const token = generateToken(insertedId);

    const [insertedId] = await db('users').insert({
      name,
      email,
      password: hashedPassword,
      avatar: avatarUrl,
      role: 'user',
      title: 'Team Member',
      department: 'General',
      status: 'active',
    }, ['id']); //<- to get inserted id back!

    const token = generateToken(insertedId.id);

    res.status(201).json({
      id: insertedId.id,
      name,
      email,
      avatar: avatarUrl,
      token
    });
  } catch (error) {
    // console.error('Signup Error:', error);
    // res.status(500).json({ message: 'Server error' });
    next(error)
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;
  try {
    const users = await db('users').where({ email }).select('*');
    // const users = rows as any[];

    if (users.length === 0) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password' })
      return;
    }

    const token = generateToken(user.id);

    // Send JWT in a secure HTTP-only cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.ENV === 'DEV',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      title: user.title,
      department: user.department,
      status: user.status,
    });
  }
  catch (error) {
    next(error);
  }
}

export const logout = (req: Request, res: Response): void => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
    sameSite: 'strict',
    secure: process.env.ENV === 'DEV',
  });

  res.status(200).json({ message: 'Logout out successfully' })
}

export const getallusers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const allusers = await db('users').select('id', 'name', 'email', 'avatar', 'role', 'title', 'department', 'status')
    res.status(200).json(allusers);
  } catch (error) {
    next(error);
  }
}

// Run this once during setup or deployment
export const seedAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { password } = req.body;
  const existing = await db('users').where({ email: 'admin@trunkchart.com' }).first();

  if (existing) {
    res.status(200).json({
      message: 'Admin user already exists',
      user: {
        id: existing.id,
        email: existing.email,
        role: existing.role,
      },
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const [inserted] = await db('users').insert({
    name: 'System Admin',
    email: 'admin@trunkchart.com',
    password: hashedPassword,
    avatar: 'https://ui-avatars.com/api/?name=System+Admin',
    role: 'admin',
    title: 'Workspace Admin',
    department: 'Admin',
    status: 'active'
  }, ['id', 'email', 'role']);

  res.status(201).json({
    message: 'Admin user created successfully.',
    user: inserted,
  });
};

export const me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.cookies?.token;
  if (!token){
    res.sendStatus(401);
    return
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const user = await db('users')
      .select('id', 'name', 'email', 'role', 'title', 'department', 'status', 'avatar')
      .where({ id: decoded.id })
      .first();
    if (!user) {
      res.sendStatus(401);
      return
    }
      res.status(200).json(user);
  } catch (err) {
      next(err);
  }
};
