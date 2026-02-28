import React from 'react';
import { getLatestMatchWithGallery } from '@/lib/db/matches';

async function fetchDriveFiles(folderId: string) {
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
  if (!apiKey) {
    console.warn('DriveGallery: GOOGLE_DRIVE_API_KEY not set');
    return [];
  }

  const q = encodeURIComponent(`'${folderId}' in parents and mimeType contains 'image/' and trashed = false`);
  const url = `https://www.googleapis.com/drive/v3/files?q=${q}&key=${apiKey}&fields=files(id,name,thumbnailLink,webViewLink)`;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      console.error('DriveGallery: API fetch failed', await res.text());
      return [];
    }
    const json = await res.json();
    return (json.files || []) as Array<{ id: string; name: string; thumbnailLink?: string }>;
  } catch (err) {
    console.error('DriveGallery: fetch error', err);
    return [];
  }
}

export default async function DriveGallery() {
  // Get most recently registered match that has a galleryFolderId
  const match = await getLatestMatchWithGallery();
  const folderId = match ? match.galleryFolderId : null;

  if (!folderId) {
    return (
      <div className="dashboard-card">
        <h2 className="text-2xl font-display text-white mb-6 uppercase tracking-wider">Galería Fotográfica</h2>
        <div className="text-foreground-muted">No hay galería asociada.</div>
      </div>
    );
  }

  const files = await fetchDriveFiles(folderId);

  if (!files || files.length === 0) {
    return (
      <div className="dashboard-card">
        <h2 className="text-2xl font-display text-white mb-6 uppercase tracking-wider">Galería Fotográfica</h2>
        <div className="text-foreground-muted">No se encontraron imágenes en la carpeta asociada.</div>
      </div>
    );
  }

  return (
    <div className="dashboard-card">
      <h2 className="text-2xl font-display text-white mb-6 uppercase tracking-wider">Galería Fotográfica</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {files.map((f) => {
          const src = f.thumbnailLink || `https://drive.google.com/uc?export=view&id=${f.id}`;
          return (
            <a key={f.id} href={src} target="_blank" rel="noreferrer" className="group relative aspect-square rounded-lg overflow-hidden block">
              <img src={src} alt={f.name} className="w-full h-full object-cover" />
            </a>
          );
        })}
      </div>
    </div>
  );
}
