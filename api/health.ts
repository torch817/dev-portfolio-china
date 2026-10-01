export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    if (res.setHeader) {
      res.setHeader('Allow', 'GET');
    }
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  return res.status(200).json({ ok: true, status: 'healthy' });
}
