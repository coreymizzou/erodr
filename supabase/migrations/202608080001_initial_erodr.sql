create extension if not exists pgcrypto;

create type public.post_audience as enum ('classmates', 'ticker', 'national');
create type public.anonymous_gender as enum ('Woman', 'Man', 'Unspecified');
create type public.response_visibility as enum ('public', 'private');

create table public.universities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_name text not null,
  city text not null,
  state text not null,
  latitude double precision not null,
  longitude double precision not null,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  university_id uuid not null references public.universities(id),
  display_name text not null check (char_length(display_name) between 1 and 80),
  avatar_url text,
  class_year integer check (class_year between 2000 and 2100),
  bio text not null default '' check (char_length(bio) <= 300),
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  university_id uuid not null references public.universities(id),
  body text not null default '' check (char_length(body) <= 600),
  image_url text,
  anonymous boolean not null default false,
  anonymous_gender public.anonymous_gender,
  audience public.post_audience not null default 'classmates',
  created_at timestamptz not null default now(),
  base_expires_at timestamptz not null default (now() + interval '6 hours'),
  expires_at timestamptz not null default (now() + interval '6 hours'),
  latitude double precision,
  longitude double precision,
  radius_miles numeric(6,2) not null default 5 check (radius_miles > 0),
  check (body <> '' or image_url is not null),
  check (base_expires_at > created_at),
  check (expires_at <= created_at + interval '72 hours')
);

create index posts_active_university_idx on public.posts (university_id, expires_at desc, created_at desc);
create index posts_active_audience_idx on public.posts (audience, expires_at desc, created_at desc);

create table public.post_votes (
  post_id uuid not null references public.posts(id) on delete cascade,
  voter_id uuid not null references public.profiles(id) on delete cascade default auth.uid(),
  value smallint not null check (value in (-1, 1)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (post_id, voter_id)
);

create table public.responses (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade default auth.uid(),
  body text not null check (char_length(body) between 1 and 600),
  anonymous boolean not null default false,
  visibility public.response_visibility not null default 'public',
  created_at timestamptz not null default now()
);

create index responses_post_idx on public.responses (post_id, created_at);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  source_post_id uuid references public.posts(id) on delete set null,
  anonymous_source boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.conversation_participants (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  participant_label text,
  joined_at timestamptz not null default now(),
  primary key (conversation_id, profile_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade default auth.uid(),
  body text not null default '' check (char_length(body) <= 2000),
  image_url text,
  created_at timestamptz not null default now(),
  check (body <> '' or image_url is not null)
);

create index messages_conversation_idx on public.messages (conversation_id, created_at);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade default auth.uid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  reason text not null check (char_length(reason) between 1 and 300),
  created_at timestamptz not null default now(),
  unique (reporter_id, post_id)
);

create table public.blocks (
  blocker_id uuid not null references public.profiles(id) on delete cascade default auth.uid(),
  blocked_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);

alter table public.universities enable row level security;
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.post_votes enable row level security;
alter table public.responses enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages enable row level security;
alter table public.reports enable row level security;
alter table public.blocks enable row level security;

create policy universities_read_authenticated on public.universities for select to authenticated using (true);
create policy profiles_read_authenticated on public.profiles for select to authenticated using (true);
create policy profiles_update_self on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy posts_insert_self on public.posts for insert to authenticated
  with check (author_id = auth.uid() and university_id = (select university_id from public.profiles where id = auth.uid()));
create policy posts_delete_self on public.posts for delete to authenticated using (author_id = auth.uid());

create policy votes_select_self on public.post_votes for select to authenticated using (voter_id = auth.uid());
create policy votes_insert_self on public.post_votes for insert to authenticated with check (voter_id = auth.uid());
create policy votes_update_self on public.post_votes for update to authenticated using (voter_id = auth.uid()) with check (voter_id = auth.uid());
create policy votes_delete_self on public.post_votes for delete to authenticated using (voter_id = auth.uid());

create policy responses_insert_self on public.responses for insert to authenticated with check (author_id = auth.uid());
create policy responses_delete_self on public.responses for delete to authenticated using (author_id = auth.uid());

create or replace function public.is_conversation_participant(target uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.conversation_participants
    where conversation_id = target and profile_id = auth.uid()
  );
$$;

create policy conversations_participants_read on public.conversations for select to authenticated
  using (public.is_conversation_participant(id));
create policy conversation_participants_read on public.conversation_participants for select to authenticated
  using (public.is_conversation_participant(conversation_id));
create policy messages_participants_read on public.messages for select to authenticated
  using (public.is_conversation_participant(conversation_id));
create policy messages_participants_insert on public.messages for insert to authenticated
  with check (sender_id = auth.uid() and public.is_conversation_participant(conversation_id));

create policy reports_insert_self on public.reports for insert to authenticated with check (reporter_id = auth.uid());
create policy reports_read_self on public.reports for select to authenticated using (reporter_id = auth.uid());
create policy blocks_all_self on public.blocks for all to authenticated using (blocker_id = auth.uid()) with check (blocker_id = auth.uid());

-- Direct post/response reads are intentionally denied because RLS cannot hide author_id by column.
-- The functions below are the only ordinary-client read surface for this content.
revoke all on public.posts from anon, authenticated;
revoke all on public.responses from anon, authenticated;
grant insert (author_id, university_id, body, image_url, anonymous, anonymous_gender, audience, base_expires_at, expires_at, latitude, longitude, radius_miles), delete on public.posts to authenticated;
grant insert (post_id, author_id, body, anonymous, visibility) on public.responses to authenticated;
grant select, insert, update, delete on public.post_votes to authenticated;
grant select on public.universities, public.profiles to authenticated;
revoke all on public.conversation_participants from anon, authenticated;
revoke all on public.messages from anon, authenticated;
grant select on public.conversations to authenticated;
grant insert (conversation_id, sender_id, body, image_url) on public.messages to authenticated;
grant select, insert on public.reports to authenticated;
grant select, insert, delete on public.blocks to authenticated;

create or replace function public.get_active_posts(
  requested_audience public.post_audience default 'classmates',
  requested_university uuid default null
)
returns table (
  id uuid,
  university_id uuid,
  university_name text,
  university_short_name text,
  body text,
  image_url text,
  anonymous boolean,
  anonymous_gender public.anonymous_gender,
  created_at timestamptz,
  expires_at timestamptz,
  latitude double precision,
  longitude double precision,
  radius_miles numeric,
  positive_count bigint,
  negative_count bigint,
  response_count bigint,
  my_vote smallint,
  author_profile_id uuid,
  author_display_name text,
  author_avatar_url text,
  author_class_year integer
)
language sql stable security definer set search_path = '' as $$
  select
    p.id, p.university_id, u.name, u.short_name, p.body, p.image_url, p.anonymous,
    case when p.anonymous then p.anonymous_gender else null end,
    p.created_at, p.expires_at, p.latitude, p.longitude, p.radius_miles,
    (select count(*) from public.post_votes v where v.post_id = p.id and v.value = 1),
    (select count(*) from public.post_votes v where v.post_id = p.id and v.value = -1),
    (select count(*) from public.responses r where r.post_id = p.id and r.visibility = 'public'),
    coalesce((select v.value from public.post_votes v where v.post_id = p.id and v.voter_id = auth.uid()), 0)::smallint,
    case when p.anonymous then null else pr.id end,
    case when p.anonymous then null else pr.display_name end,
    case when p.anonymous then null else pr.avatar_url end,
    case when p.anonymous then null else pr.class_year end
  from public.posts p
  join public.universities u on u.id = p.university_id
  left join public.profiles pr on pr.id = p.author_id and not p.anonymous
  where p.expires_at > now()
    and p.audience = requested_audience
    and (requested_university is null or p.university_id = requested_university)
    and not exists (
      select 1 from public.blocks b where b.blocker_id = auth.uid() and b.blocked_id = p.author_id
    )
  ;
$$;

revoke all on function public.get_active_posts(public.post_audience, uuid) from public;
grant execute on function public.get_active_posts(public.post_audience, uuid) to authenticated;

create or replace function public.get_post_responses(requested_post uuid)
returns table (
  id uuid,
  post_id uuid,
  body text,
  anonymous boolean,
  created_at timestamptz,
  author_profile_id uuid,
  author_display_name text,
  author_avatar_url text
)
language sql stable security definer set search_path = '' as $$
  select r.id, r.post_id, r.body, r.anonymous, r.created_at,
    case when r.anonymous then null else pr.id end,
    case when r.anonymous then null else pr.display_name end,
    case when r.anonymous then null else pr.avatar_url end
  from public.responses r
  left join public.profiles pr on pr.id = r.author_id and not r.anonymous
  join public.posts p on p.id = r.post_id
  where r.post_id = requested_post and r.visibility = 'public' and p.expires_at > now()
  order by r.created_at;
$$;

revoke all on function public.get_post_responses(uuid) from public;
grant execute on function public.get_post_responses(uuid) to authenticated;

create or replace function public.start_private_response(requested_post uuid)
returns uuid language plpgsql volatile security definer set search_path = '' as $$
declare
  source_author uuid;
  conversation_id uuid;
begin
  select author_id into source_author
  from public.posts
  where id = requested_post and expires_at > now();

  if source_author is null then raise exception 'Post is unavailable'; end if;
  if source_author = auth.uid() then raise exception 'Cannot privately respond to your own post'; end if;

  select c.id into conversation_id
  from public.conversations c
  join public.conversation_participants me on me.conversation_id = c.id and me.profile_id = auth.uid()
  join public.conversation_participants them on them.conversation_id = c.id and them.profile_id = source_author
  where c.source_post_id = requested_post
  limit 1;

  if conversation_id is null then
    insert into public.conversations (source_post_id, anonymous_source)
    select id, anonymous from public.posts where id = requested_post
    returning id into conversation_id;

    insert into public.conversation_participants (conversation_id, profile_id, participant_label) values
      (conversation_id, source_author, 'Anonymous poster'),
      (conversation_id, auth.uid(), null);
  end if;

  return conversation_id;
end;
$$;

revoke all on function public.start_private_response(uuid) from public;
grant execute on function public.start_private_response(uuid) to authenticated;

create or replace function public.get_my_conversations()
returns table (
  id uuid,
  source_post_id uuid,
  anonymous_source boolean,
  participant_label text,
  last_message text,
  updated_at timestamptz
)
language sql stable security definer set search_path = '' as $$
  select c.id, c.source_post_id, c.anonymous_source,
    case
      when c.anonymous_source and p.author_id <> auth.uid() then 'Anonymous poster'
      else coalesce(other_participant.participant_label, other_profile.display_name, 'Private response')
    end,
    coalesce(last_message.body, case when last_message.image_url is not null then 'Photo' else '' end),
    greatest(c.updated_at, coalesce(last_message.created_at, c.updated_at))
  from public.conversations c
  join public.conversation_participants me on me.conversation_id = c.id and me.profile_id = auth.uid()
  left join public.posts p on p.id = c.source_post_id
  left join lateral (
    select cp.* from public.conversation_participants cp
    where cp.conversation_id = c.id and cp.profile_id <> auth.uid()
    limit 1
  ) other_participant on true
  left join public.profiles other_profile on other_profile.id = other_participant.profile_id
  left join lateral (
    select m.body, m.image_url, m.created_at from public.messages m
    where m.conversation_id = c.id order by m.created_at desc limit 1
  ) last_message on true
  order by greatest(c.updated_at, coalesce(last_message.created_at, c.updated_at)) desc;
$$;

revoke all on function public.get_my_conversations() from public;
grant execute on function public.get_my_conversations() to authenticated;

create or replace function public.get_conversation_messages(requested_conversation uuid)
returns table (
  id uuid,
  body text,
  image_url text,
  created_at timestamptz,
  sent_by_me boolean,
  sender_label text,
  sender_profile_id uuid
)
language sql stable security definer set search_path = '' as $$
  select m.id, m.body, m.image_url, m.created_at, m.sender_id = auth.uid(),
    case
      when m.sender_id = auth.uid() then 'You'
      when c.anonymous_source and p.author_id = m.sender_id then 'Anonymous poster'
      else sender.display_name
    end,
    case
      when c.anonymous_source and p.author_id = m.sender_id and auth.uid() <> p.author_id then null
      else m.sender_id
    end
  from public.messages m
  join public.conversations c on c.id = m.conversation_id
  left join public.posts p on p.id = c.source_post_id
  join public.profiles sender on sender.id = m.sender_id
  where m.conversation_id = requested_conversation
    and public.is_conversation_participant(m.conversation_id)
  order by m.created_at;
$$;

revoke all on function public.get_conversation_messages(uuid) from public;
grant execute on function public.get_conversation_messages(uuid) to authenticated;

create or replace function public.recalculate_post_expiration()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  target_post uuid := coalesce(new.post_id, old.post_id);
  positive_votes integer;
  negative_votes integer;
begin
  select count(*) filter (where value = 1), count(*) filter (where value = -1)
    into positive_votes, negative_votes from public.post_votes where post_id = target_post;
  update public.posts
    set expires_at = least(
      created_at + interval '72 hours',
      greatest(
        now() + interval '5 minutes',
        base_expires_at + positive_votes * interval '5 minutes' - negative_votes * interval '10 minutes'
      )
    )
    where id = target_post;
  return coalesce(new, old);
end;
$$;

create trigger post_votes_recalculate_expiration
after insert or update or delete on public.post_votes
for each row execute function public.recalculate_post_expiration();
