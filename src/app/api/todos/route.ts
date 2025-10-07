import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/authOptions"; 

// Fetch tasks: owned by or shared with the user
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("todo-app");

    const todos = await db
      .collection("todos")
      .find({
        $or: [
          { userEmail: session.user.email },
          { collaborators: session.user.email },
        ],
      })
      .toArray();
    return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// Create new task with sharing
export async function POST(req: NextRequest) {
  const { userEmail, title, description, dueDate, priority, completed, collaborators } = await req.json();

  if (!userEmail || !title) {
    return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db("todo-app");
  const result = await db.collection("todos").insertOne({
    userEmail,
    title,
    description,
    dueDate,
    priority,
    completed: completed || false,
    collaborators: collaborators || [], // Add collaborators field
  });

  return NextResponse.json({ insertedId: result.insertedId });
}

// Update task with sharing and access check
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("todo-app");
    const { id, title, description, dueDate, priority, completed, collaborators } = await req.json();

    if (!id || !title) {
      return NextResponse.json({ error: "Missing id or title" }, { status: 400 });
    }

    // Allow update if user owns the task or is a collaborator
    const result = await db.collection("todos").updateOne(
      {
        _id: new ObjectId(id),
        $or: [
          { userEmail: session.user.email },
          { collaborators: session.user.email },
        ],
      },
      { $set: { title, description, dueDate, priority, completed, collaborators: collaborators || [] } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Todo not found or unauthorized" }, { status: 404 });
    }
    return NextResponse.json({ message: "Todo updated" });
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// Delete task if owned by user
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("todo-app");
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    // Only allow owner to delete (not a collaborator)
    const result = await db.collection("todos").deleteOne({
      _id: new ObjectId(id),
      userEmail: session.user.email,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Todo not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Todo deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

