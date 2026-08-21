export const dynamic = "force-dynamic";
export async function GET() {
  return Response.json({
    storage: "browser",
    byok: process.env.ALLOW_BYOK !== "false",
    providers: {
      openrouter: Boolean(process.env.OPENROUTER_API_KEY),
      openai: Boolean(process.env.OPENAI_API_KEY),
      anthropic: Boolean(process.env.ANTHROPIC_API_KEY),
      google: Boolean(process.env.GEMINI_API_KEY),
      "openai-compatible": Boolean(process.env.OPENAI_COMPATIBLE_API_KEY && process.env.OPENAI_COMPATIBLE_BASE_URL),
    },
  });
}
