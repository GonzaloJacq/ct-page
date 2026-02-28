import { PrismaClient } from '@prisma/client';
import { apiResponse, apiError } from '@/lib/api-utils';

const prisma = new PrismaClient();

interface DriveFile {
  id: string;
  name: string;
  thumbnailLink?: string;
}

interface GalleryResponse {
  folderId: string;
  files: DriveFile[];
}

async function fetchDriveFiles(folderId: string): Promise<DriveFile[]> {
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
  if (!apiKey) {
    console.warn('GET /api/matches/latest-gallery: GOOGLE_DRIVE_API_KEY not set');
    return [];
  }

  const q = encodeURIComponent(`'${folderId}' in parents and mimeType contains 'image/' and trashed = false`);
  const url = `https://www.googleapis.com/drive/v3/files?q=${q}&key=${apiKey}&fields=files(id,name,thumbnailLink,webViewLink)`;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      console.error('GET /api/matches/latest-gallery: Drive API error', await res.text());
      return [];
    }
    const json = await res.json();
    return (json.files || []) as DriveFile[];
  } catch (err) {
    console.error('GET /api/matches/latest-gallery: Drive API fetch error', err);
    return [];
  }
}

export async function GET() {
  try {
    const match = await prisma.match.findFirst({
      where: { galleryFolderId: { not: null } },
      orderBy: { date: 'desc' },
      select: { galleryFolderId: true },
    });
    if (!match || !match.galleryFolderId) {
      console.debug('GET /api/matches/latest-gallery: no match with galleryFolderId found');
      return apiResponse<GalleryResponse | null>(null);
    }
    console.debug('GET /api/matches/latest-gallery: found latest match folder', match.galleryFolderId);

    // Fetch images from Drive folder using server-side API key
    const files = await fetchDriveFiles(match.galleryFolderId);
    console.debug('GET /api/matches/latest-gallery: found', files.length, 'images');

    return apiResponse<GalleryResponse>({ 
      folderId: match.galleryFolderId,
      files
    });
  } catch (err) {
    console.error('GET /api/matches/latest-gallery error:', err);
    return apiError('Error fetching gallery', 500);
  }
}