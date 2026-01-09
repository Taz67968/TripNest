import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const amount = searchParams.get("amount");

  if (!from || !to || !amount) {
    return NextResponse.json(
      { error: "Missing params" },
      { status: 400 }
    );
  }

  const apiKey = process.env.EXCHANGE_API_KEY;

  const res = await fetch(
    `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}/${amount}`
  );

  const data = await res.json();
  return NextResponse.json(data);
}
