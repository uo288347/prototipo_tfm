export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("FRONTEND LOG:", {
      ...body,
      timestamp: new Date().toISOString(),
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Log endpoint error:", error);
    return Response.json({ ok: false }, { status: 500 });
  }
}
