import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function uploadFile(file: File | null, destinationFolder: string = 'uploads'): Promise<string | null> {
    if (!file || file.size === 0) return null;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_'); // Sanitize
    const filename = `${timestamp}-${safeName}`;

    // Ensure directory exists
    const uploadDir = join(process.cwd(), 'public', destinationFolder);
    try {
        await mkdir(uploadDir, { recursive: true });
    } catch (error) {
        console.error('Error creating upload directory:', error);
    }

    const filepath = join(uploadDir, filename);

    try {
        await writeFile(filepath, buffer);
        return `/${destinationFolder}/${filename}`;
    } catch (error) {
        console.error('Error saving file:', error);
        throw new Error('Failed to save image');
    }
}
