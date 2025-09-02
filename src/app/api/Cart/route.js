
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb"
import Cart from "@/models/Cart";


export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const newItem = await Cart.create(body);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const items = await Cart.find({});
    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}


export async function DELETE(req) {
  try {
    await dbConnect();

    // req.url থেকে ID বের করার safer version
    const url = new URL(req.url, "http://localhost:3000"); // base url দিলাম
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ msg: "ID is required" }), { status: 400 });
    }

    const deletedItem = await Cart.findByIdAndDelete(id);

    if (!deletedItem) {
      return new Response(JSON.stringify({ msg: "Item not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ msg: "Cart item deleted ✅" }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ msg: "Delete failed", error: err.message }), { status: 500 });
  }
}
