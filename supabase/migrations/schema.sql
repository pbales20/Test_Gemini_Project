-- profiles table to extend auth.users
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text not null,
  username text,
  total_points integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure profiles are secure
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );
create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );
create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );


-- teams table (sourced from CFBD API)
create table public.teams (
  id integer primary key, -- CFBD Team ID
  school text not null,
  mascot text,
  abbreviation text,
  conference text,
  color text,
  logos text[] -- array of logo urls
);

alter table public.teams enable row level security;
create policy "Teams are viewable by everyone."
  on teams for select
  using ( true );


-- user_draft_picks table (5 Win Teams, 2 Loss Teams per user)
create table public.user_draft_picks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  team_id integer references public.teams(id) not null,
  pick_type text not null check (pick_type in ('WIN', 'LOSS')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, team_id) -- A user can only pick a team once
);

alter table public.user_draft_picks enable row level security;
create policy "Draft picks viewable by everyone."
  on user_draft_picks for select
  using ( true );
create policy "Users can insert own draft picks."
  on user_draft_picks for insert
  with check ( auth.uid() = user_id );
create policy "Users can update own draft picks."
  on user_draft_picks for update
  using ( auth.uid() = user_id );
create policy "Users can delete own draft picks."
  on user_draft_picks for delete
  using ( auth.uid() = user_id );


-- games table (weekly scores, spreads, specifically tracking Baylor)
create table public.games (
  id integer primary key, -- CFBD Game ID
  season integer not null,
  week integer not null,
  start_date timestamp with time zone not null,
  home_team_id integer references public.teams(id) not null,
  home_points integer,
  away_team_id integer references public.teams(id) not null,
  away_points integer,
  is_completed boolean default false not null,
  spread numeric, -- The spread from Baylor's perspective (if Baylor is home/away) or general spread
  is_baylor_game boolean default false not null,
  baylor_team_id integer references public.teams(id) -- ID of Baylor if it's a Baylor game
);

alter table public.games enable row level security;
create policy "Games viewable by everyone."
  on games for select
  using ( true );


-- user_weekly_picks table (ATS picks for Baylor games)
create table public.user_weekly_picks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  game_id integer references public.games(id) not null,
  selected_team_id integer references public.teams(id) not null, -- Which team they pick ATS
  is_correct boolean, -- Null until game completes and spread is covered/not covered
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, game_id) -- One pick per game per user
);

alter table public.user_weekly_picks enable row level security;
create policy "Weekly picks viewable by everyone."
  on user_weekly_picks for select
  using ( true );
create policy "Users can insert own weekly picks."
  on user_weekly_picks for insert
  with check ( auth.uid() = user_id );
create policy "Users can update own weekly picks."
  on user_weekly_picks for update
  using ( auth.uid() = user_id );
