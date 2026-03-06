import fs from 'fs';
import path from 'path';

/**
 * Utility to read test data and locators from an external directory on-demand.
 * This prevents loading the entire dataset into memory at once.
 */
export class DataReader {
    /**
     * Reads a JSON file from the data directory.
     * Uses `DATA_ROOT_PATH` from environment variables if set.
     * Otherwise, falls back to the default `src/data` directory in the repository.
     * 
     * @param relativePath - Path relative to the data root (e.g., 'locators/login.json')
     * @returns Parsed JSON object
     */
    static getJsonData(relativePath: string): any {
        // Enforce Fast Fail: Bắt buộc phải có đường dẫn config từ môi trường
        if (!process.env.DATA_ROOT_PATH) {
            throw new Error('[Fast Fail] DATA_ROOT_PATH is missing. Please define this environment variable to point to your external data folder.');
        }

        // Determine the root data directory
        const dataRoot = path.resolve(process.env.DATA_ROOT_PATH);

        const fullPath = path.join(dataRoot, relativePath);

        try {
            // Read synchronously since this is usually called in constructors
            const fileContent = fs.readFileSync(fullPath, 'utf-8');
            return JSON.parse(fileContent);
        } catch (error) {
            console.error(`[DataReader Error] Failed to read JSON data from: ${fullPath}`);
            throw error;
        }
    }
}
