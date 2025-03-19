import { createClient } from "./supabase-client.js";
export class DBRepository {
    table;
    url;
    apiKey;
    cookies;
    constructor(table, url, apiKey, cookies) {
        this.table = table;
        this.url = url;
        this.apiKey = apiKey;
        this.cookies = cookies;
    }
    async create(requestData) {
        const supabase = await createClient(this.url, this.apiKey, this.cookies);
        const { data, error } = await supabase
            .from(this.table)
            .insert(requestData)
            .select("id");
        if (error)
            throw new Error(error.message);
        const id = data[0]?.id ?? null;
        return id;
    }
    async readOne(query, selector) {
        const supabase = await createClient(this.url, this.apiKey, this.cookies);
        const selectorArray = selector ? selector.join(", ") : "*";
        let querySnapshot = supabase.from(this.table).select(selectorArray);
        for (const key in query) {
            querySnapshot = querySnapshot.eq(key, query[key]);
        }
        const { data, error } = await querySnapshot;
        if (error)
            throw new Error(error.message);
        return data[0];
    }
    async readAll(query, selector) {
        const supabase = await createClient(this.url, this.apiKey, this.cookies);
        const selectorArray = selector ? selector.join(", ") : "*";
        let querySnapshot = supabase.from(this.table).select(selectorArray);
        for (const key in query) {
            querySnapshot = querySnapshot.eq(key, query[key]);
        }
        const { data, error } = await querySnapshot;
        if (error)
            throw new Error(error.message);
        return data;
    }
    async readExcept(query, selector) {
        const supabase = await createClient(this.url, this.apiKey, this.cookies);
        const selectorArray = selector.join(", ");
        let querySnapshot = supabase.from(this.table).select(selectorArray);
        for (const key in query) {
            querySnapshot = querySnapshot.neq(key, query[key]);
        }
        const { data, error } = await querySnapshot;
        if (error)
            throw new Error(error.message);
        return data;
    }
    async readInclude(query, selector) {
        const supabase = await createClient(this.url, this.apiKey, this.cookies);
        const selectorArray = selector ? selector.join(", ") : "*";
        const { data, error } = await supabase
            .from(this.table)
            .select(selectorArray)
            .ilike("email", `%${query}%`);
        if (error)
            throw new Error(error.message);
        return data;
    }
    async update(id, requestData) {
        const supabase = await createClient(this.url, this.apiKey, this.cookies);
        const { error } = await supabase
            .from(this.table)
            .update(requestData)
            .eq("id", id)
            .select("id");
        if (error)
            throw new Error(error.message);
    }
    async deleteByID(id) {
        const supabase = await createClient(this.url, this.apiKey, this.cookies);
        const { error } = await supabase.from(this.table).delete().eq("id", id);
        if (error)
            throw new Error(error.message);
    }
    async deleteAll(query) {
        const supabase = await createClient(this.url, this.apiKey, this.cookies);
        let querySnapshot = supabase.from(this.table).delete();
        for (const key in query) {
            querySnapshot = querySnapshot.eq(key, query[key]);
        }
        const { error } = await querySnapshot;
        if (error)
            throw new Error(error.message);
    }
    async count(query) {
        const supabase = await createClient(this.url, this.apiKey, this.cookies);
        let querySnapshot = supabase.from(this.table).select("id");
        for (const key in query) {
            querySnapshot = querySnapshot.eq(key, query[key]);
        }
        const { data, error } = await querySnapshot;
        if (error)
            throw new Error(error.message);
        return data.length;
    }
}
