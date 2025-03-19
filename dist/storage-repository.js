import { Buffer } from "node:buffer";
import { createClient } from "./supabase-client.js";
export class StorageRepository {
    bucketName;
    url;
    apiKey;
    cookies;
    constructor(bucketName, url, apiKey, cookies) {
        this.bucketName = bucketName;
        this.url = url;
        this.apiKey = apiKey;
        this.cookies = cookies;
    }
    async uploadFile(file, filePath) {
        const supabase = await createClient(this.url, this.apiKey, this.cookies);
        const { data, error } = await supabase.storage
            .from(this.bucketName)
            .upload(filePath, file);
        if (error)
            throw new Error(error.message);
        const fileURL = data.fullPath;
        return fileURL;
    }
    async uploadBase64(base64, filePath) {
        const supabase = await createClient(this.url, this.apiKey, this.cookies);
        const stoargeRef = supabase.storage.from(this.bucketName);
        const buffer = Buffer.from(base64, "base64");
        const { error } = await stoargeRef.upload(filePath, buffer, {
            contentType: "image/png",
            upsert: true,
        });
        if (error)
            throw new Error(error.message);
        const fileURL = stoargeRef.getPublicUrl(filePath).data.publicUrl;
        return fileURL;
    }
}
