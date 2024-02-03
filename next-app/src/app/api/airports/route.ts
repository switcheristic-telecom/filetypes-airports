import { AIRPORT_CODES_WITH_FILETYPES } from '@/data/data';

export async function GET(request: Request) {
  return Response.json({
    data: AIRPORT_CODES_WITH_FILETYPES,
  });
}
