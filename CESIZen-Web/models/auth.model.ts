import { supabase } from "../lib/supabase/supabase";

export async function verifierIdentifiants(email_util: string, mot_de_passe_util: string) {

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email_util,
        password: mot_de_passe_util,
    });

    if (error) {
        throw error
    }

    return data
}

export async function creerCompte(email: string, mot_de_passe: string) {
    const { data, error } = await supabase.auth.signUp({ email, password: mot_de_passe });
    if (error) throw error;
    return data;
}

export async function deconnecterCompte() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}
