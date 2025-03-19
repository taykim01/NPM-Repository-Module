import { Cookies } from "./supabase-client.js";
export declare class StorageRepository {
    bucketName: string;
    url: string;
    apiKey: string;
    cookies: Cookies;
    constructor(bucketName: string, url: string, apiKey: string, cookies: Cookies);
    uploadFile(file: File, filePath: string): Promise<string>;
    uploadBase64(base64: string, filePath: string): Promise<string>;
}
