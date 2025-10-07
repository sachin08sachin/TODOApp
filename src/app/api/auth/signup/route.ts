import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json();

  if (!email || !password || !name) {
    return NextResponse.json(
      { error: 'Required fields missing' },
      { status: 400 },
    );
  }

  const client = await clientPromise;
  const db = client.db('todo-app');

  const existingUser = await db
    .collection('users')
    .findOne({ email: email.toLowerCase() });

  if (existingUser) {
    return NextResponse.json(
      { error: 'Email already exists' },
      { status: 409 },
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await db.collection('users').insertOne({
    email: email.toLowerCase(),
    name,
    passwordHash,
  });

  return NextResponse.json({ message: 'Signup successful' });
}
