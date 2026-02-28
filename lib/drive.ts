// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: we add googleapis dependency separately, install before compiling
import { google } from 'googleapis';

// helper to list images inside a Google Drive folder. Requires
// GOOGLE_SERVICE_ACCOUNT_KEY environment variable containing the
// JSON credentials of a service account that has access to the folder.

// Only initialize the client if credentials are actually provided
// so that the server can run even in environments where Drive is
// not configured (e.g. CI or development without a key).
let drive: any = null;
if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY),
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });
  drive = google.drive({ version: 'v3', auth });
} else {
  console.warn('GOOGLE_SERVICE_ACCOUNT_KEY not set - Drive integration disabled');
}

export interface DriveFile {
  id: string;
  name: string;
  thumbnailLink?: string;
  webViewLink?: string;
}

export async function listFolderImages(folderId: string): Promise<DriveFile[]> {
  if (!drive) {
    // no client configured, just return empty array
    return [];
  }
  try {
    const res = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
      fields: 'files(id,name,thumbnailLink,webViewLink)',
      orderBy: 'createdTime desc',
      pageSize: 100,
    });
    return res.data.files || [];
  } catch (err) {
    console.error('Drive API error', err);
    return [];
  }
}

export function isDriveEnabled(): boolean {
  return !!drive;
}