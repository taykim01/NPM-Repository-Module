import { createClient, Cookies } from "./supabase-client.js";

export class DBRepository<Entity> {
  constructor(
    public table: string,
    public url: string,
    public apiKey: string,
    public cookies: Cookies
  ) {}

  async create(requestData: Partial<Entity>): Promise<string> {
    const supabase = await createClient(this.url, this.apiKey, this.cookies);
    const { data, error } = await supabase
      .from(this.table)
      .insert(requestData)
      .select("id");
    if (error) throw new Error(error.message);
    const id = data[0]?.id ?? null;
    return id;
  }

  async readOne<K extends keyof Entity>(
    query: Record<K, Entity[K]>,
    selector?: (keyof Entity)[]
  ): Promise<Entity> {
    const supabase = await createClient(this.url, this.apiKey, this.cookies);
    const selectorArray = selector ? selector.join(", ") : "*";
    let querySnapshot = supabase.from(this.table).select(selectorArray);
    for (const key in query) {
      querySnapshot = querySnapshot.eq(key as string, query[key]);
    }
    const { data, error } = await querySnapshot;
    if (error) throw new Error(error.message);
    return data[0] as Entity;
  }

  async readAll<K extends keyof Entity>(
    query: Record<K, Entity[K]>,
    selector?: (keyof Entity)[]
  ): Promise<Entity[]> {
    const supabase = await createClient(this.url, this.apiKey, this.cookies);
    const selectorArray = selector ? selector.join(", ") : "*";
    let querySnapshot = supabase.from(this.table).select(selectorArray);
    for (const key in query) {
      querySnapshot = querySnapshot.eq(key as string, query[key]);
    }
    const { data, error } = await querySnapshot;
    if (error) throw new Error(error.message);
    return data as Entity[];
  }

  async readExcept<K extends keyof Entity>(
    query: Record<K, Entity[K]>,
    selector: K[]
  ): Promise<Entity[]> {
    const supabase = await createClient(this.url, this.apiKey, this.cookies);
    const selectorArray = selector.join(", ");

    let querySnapshot = supabase.from(this.table).select(selectorArray);
    for (const key in query) {
      querySnapshot = querySnapshot.neq(key as string, query[key]);
    }
    const { data, error } = await querySnapshot;
    if (error) throw new Error(error.message);
    return data as Entity[];
  }

  async readInclude<K extends keyof Entity>(
    query: string,
    selector?: K[]
  ): Promise<Entity[]> {
    const supabase = await createClient(this.url, this.apiKey, this.cookies);
    const selectorArray = selector ? selector.join(", ") : "*";

    const { data, error } = await supabase
      .from(this.table)
      .select(selectorArray)
      .ilike("email", `%${query}%`);

    if (error) throw new Error(error.message);
    return data as Entity[];
  }

  async update(id: string, requestData: Partial<Entity>) {
    const supabase = await createClient(this.url, this.apiKey, this.cookies);
    const { error } = await supabase
      .from(this.table)
      .update(requestData)
      .eq("id", id)
      .select("id");
    if (error) throw new Error(error.message);
  }

  async deleteByID(id: string): Promise<void> {
    const supabase = await createClient(this.url, this.apiKey, this.cookies);
    const { error } = await supabase.from(this.table).delete().eq("id", id);
    if (error) throw new Error(error.message);
  }

  async deleteAll<K extends keyof Entity>(
    query: Record<K, Entity[K]>
  ): Promise<void> {
    const supabase = await createClient(this.url, this.apiKey, this.cookies);
    let querySnapshot = supabase.from(this.table).delete();
    for (const key in query) {
      querySnapshot = querySnapshot.eq(key as string, query[key]);
    }
    const { error } = await querySnapshot;
    if (error) throw new Error(error.message);
  }

  async count<K extends keyof Entity>(
    query: Record<K, Entity[K]>
  ): Promise<number> {
    const supabase = await createClient(this.url, this.apiKey, this.cookies);
    let querySnapshot = supabase.from(this.table).select("id");
    for (const key in query) {
      querySnapshot = querySnapshot.eq(key as string, query[key]);
    }
    const { data, error } = await querySnapshot;
    if (error) throw new Error(error.message);
    return data.length;
  }
}
