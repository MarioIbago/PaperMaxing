export async function GET(){return Response.json({ok:true,app:"PaperMaxing",mode:process.env.PAPERMAXING_MODE??"local"});}
