-- Politiques de sécurité (Row Level Security) proposées pour CESIZen
--
-- Ce fichier n'a encore jamais été appliqué à la base : à relire puis à exécuter
-- soit avec "supabase db push", soit en collant son contenu dans l'éditeur SQL
-- du tableau de bord Supabase.
--
-- Objectif : verrouiller par défaut l'accès aux données, et n'ouvrir que ce qui
-- est nécessaire à chaque rôle (visiteur, utilisateur connecté, administrateur).
-- S'appuie sur la fonction "est_administrateur()" déjà présente en base.

-- =========================================================
-- Table utilisateur
-- =========================================================
alter table public.utilisateur enable row level security;

drop policy if exists "utilisateur_select_own_or_admin" on public.utilisateur;
create policy "utilisateur_select_own_or_admin"
  on public.utilisateur for select
  using (id_util = auth.uid() or public.est_administrateur());

drop policy if exists "utilisateur_update_own_or_admin" on public.utilisateur;
create policy "utilisateur_update_own_or_admin"
  on public.utilisateur for update
  using (id_util = auth.uid() or public.est_administrateur())
  with check (id_util = auth.uid() or public.est_administrateur());

drop policy if exists "utilisateur_insert_admin_only" on public.utilisateur;
create policy "utilisateur_insert_admin_only"
  on public.utilisateur for insert
  with check (public.est_administrateur());

drop policy if exists "utilisateur_delete_admin_only" on public.utilisateur;
create policy "utilisateur_delete_admin_only"
  on public.utilisateur for delete
  using (public.est_administrateur());

-- La policy UPDATE ci-dessus autorise un utilisateur à modifier SA ligne, ce qui est
-- nécessaire pour qu'il édite son profil (nom, prénom, email). Le trigger suivant
-- empêche spécifiquement qu'il en profite pour changer son propre rôle ou déverrouiller
-- son propre compte : Row Level Security seule ne permet pas de restreindre certaines
-- colonnes uniquement, un trigger est nécessaire pour ce niveau de contrôle.
create or replace function public.empecher_auto_promotion()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.est_administrateur() then
    if new.type_util is distinct from old.type_util
       or new.statut_compte_util is distinct from old.statut_compte_util
       or new.tentatives_connexion_util is distinct from old.tentatives_connexion_util
       or new.date_verrouillage_util is distinct from old.date_verrouillage_util then
      raise exception 'Modification du rôle ou du statut de compte réservée à un administrateur.';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_empecher_auto_promotion on public.utilisateur;
create trigger trg_empecher_auto_promotion
  before update on public.utilisateur
  for each row
  execute function public.empecher_auto_promotion();

-- =========================================================
-- Table log_activite
-- =========================================================
alter table public.log_activite enable row level security;

-- Un utilisateur peut voir ses propres actions, un administrateur voit tout.
drop policy if exists "log_activite_select_own_or_admin" on public.log_activite;
create policy "log_activite_select_own_or_admin"
  on public.log_activite for select
  using (id_util = auth.uid() or public.est_administrateur());

-- L'écriture doit rester ouverte : on journalise aussi les tentatives de connexion
-- échouées, faites avant que la personne ne soit authentifiée.
drop policy if exists "log_activite_insert_tous" on public.log_activite;
create policy "log_activite_insert_tous"
  on public.log_activite for insert
  with check (true);

-- =========================================================
-- Table ressource
-- =========================================================
alter table public.ressource enable row level security;

-- Les visiteurs et utilisateurs ne voient que les ressources publiées,
-- l'administrateur voit tout (y compris les brouillons).
drop policy if exists "ressource_select_publique_ou_admin" on public.ressource;
create policy "ressource_select_publique_ou_admin"
  on public.ressource for select
  using (statut_ress = 'publication' or public.est_administrateur());

drop policy if exists "ressource_insert_admin_only" on public.ressource;
create policy "ressource_insert_admin_only"
  on public.ressource for insert
  with check (public.est_administrateur());

drop policy if exists "ressource_update_admin_only" on public.ressource;
create policy "ressource_update_admin_only"
  on public.ressource for update
  using (public.est_administrateur())
  with check (public.est_administrateur());

drop policy if exists "ressource_delete_admin_only" on public.ressource;
create policy "ressource_delete_admin_only"
  on public.ressource for delete
  using (public.est_administrateur());

-- =========================================================
-- Table reinitialisation_mot_de_passe
-- =========================================================
alter table public.reinitialisation_mot_de_passe enable row level security;

drop policy if exists "reinit_insert_tous" on public.reinitialisation_mot_de_passe;
create policy "reinit_insert_tous"
  on public.reinitialisation_mot_de_passe for insert
  with check (true);

drop policy if exists "reinit_select_admin_only" on public.reinitialisation_mot_de_passe;
create policy "reinit_select_admin_only"
  on public.reinitialisation_mot_de_passe for select
  using (public.est_administrateur());
