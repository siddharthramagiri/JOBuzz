import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const phone = req.headers.get("x-phone");
  if (!phone) return NextResponse.json({ error: "Phone number required" }, { status: 400 });
  try {
    const user = await prisma.user.findUnique({ where: { phone_number: phone } });
    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {

    const body = await req.json();
    const { phone, name, interests, preferred_locations, experience_level } = body;
    
    if (!phone || !name) {
      return NextResponse.json({ error: "Phone and name required" }, { status: 400 });
    }
    
    console.log(body);
    
    const existingUser = await prisma.user.findUnique({
      where : {
        phone_number : phone
      }
    });
    
    let user;
    if(existingUser) {
      user = await prisma.user.update({
        where: { phone_number: phone },
        data: {
          name,
          interests,
          preferred_locations,
          experience_level,
          registered: true,
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          phone_number : phone,
          name,
          interests,
          preferred_locations,
          experience_level,
          registered: true,
        },
      })
    }
    return NextResponse.json({message : "Successfully Saved", user});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
