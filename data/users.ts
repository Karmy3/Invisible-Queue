import { supabase } from "@/lib/supabase";
import {User} from "@/types/db";

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const {
    data: { user },
    error,
  } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return null;
  }

  return user;
}

export async function getAllUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*') as { data: User[] | null, error: any };

  if (error) {
    console.error(error);
    return [];
  }
  return data;
}

export async function addUser(name: string, email: string, mode: string) {
  const { data, error } = await supabase
    .from('users')
    .insert([
      { name: name, email: email, mode: mode }
    ])
    .select();

  if (error) {
    console.error("Erreur d'insertion :", error.message);
    return null;
  }

  return data;
}