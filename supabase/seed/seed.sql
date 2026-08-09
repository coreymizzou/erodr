-- Deterministic research/demo dataset. Password for demo users: demo1234
do $$
declare
  university_ids uuid[] := array[
    '10000000-0000-0000-0000-000000000001'::uuid,
    '10000000-0000-0000-0000-000000000002'::uuid,
    '10000000-0000-0000-0000-000000000003'::uuid,
    '10000000-0000-0000-0000-000000000004'::uuid,
    '10000000-0000-0000-0000-000000000005'::uuid
  ];
  first_names text[] := array['Maya','Caleb','Lauren','Marcus','Emily','Jordan','Taylor','Noah','Avery','Sam','Rachel','Darius','Olivia','Ben','Kelsey','Devon','Priya','Luke','Morgan','Eli','Jenna','Andre','Natalie','Cole','Sofia'];
  last_names text[] := array['Jefferson','Brooks','Nguyen','Carter','Miller','Reed','Foster','Patel','Hughes','Diaz','Bennett','Robinson','Kim','Ward','Hayes','Price','Shah','Turner','Bell','Cooper','Sullivan','Lewis','Martin','Grant','Flores'];
  bodies text[] := array[
    'When all of your friends are in relationships & you''re just like',
    'Is Ellis packed right now or can I actually find a table?',
    'Free coffee outside the student center until they run out.',
    'The wind on College Ave is personally attacking me today.',
    'Does anyone have notes from the last ten minutes of chem?',
    'Somebody left a black umbrella in Middlebush. I turned it in downstairs.',
    'M-I-Z. That is all.',
    'Best cheap lunch within walking distance? Go.',
    'The Quad at this exact moment is why I picked Mizzou.',
    'To the person playing guitar outside Speakers Circle: keep going.',
    'Group project meeting moved again. We are never graduating.',
    'Anyone driving to St. Louis Friday afternoon with room for one?',
    'There is a very friendly dog by the columns and my day is fixed.',
    'Why is every printer on campus angry at me?',
    'Late-night pizza has never tasted this earned.',
    'If you found a gold keychain near Jesse, please message me.',
    'Quiet floor means quiet floor, rodies.',
    'Need one more for intramural volleyball tonight.',
    'That exam was absolutely not written for humans.',
    'Who is going downtown after the game?'
  ];
  response_bodies text[] := array['Same.','Walking over now.','I was wondering this too.','Private response sent.','There are seats upstairs.','You just saved my day.','Can confirm.','This is the most Mizzou thing today.','Check by the front desk.','I can help!'];
  i integer;
  user_id uuid;
  post_id uuid;
  university_id uuid;
  email_address text;
begin
  insert into public.universities (id, slug, name, short_name, city, state, latitude, longitude) values
    (university_ids[1], 'mizzou', 'University of Missouri', 'Mizzou', 'Columbia', 'MO', 38.9404, -92.3277),
    (university_ids[2], 'missouri-state', 'Missouri State University', 'Missouri State', 'Springfield', 'MO', 37.1987, -93.2783),
    (university_ids[3], 'miami-ohio', 'Miami University', 'Miami Ohio', 'Oxford', 'OH', 39.5089, -84.7346),
    (university_ids[4], 'virginia-tech', 'Virginia Tech', 'Virginia Tech', 'Blacksburg', 'VA', 37.2284, -80.4234),
    (university_ids[5], 'jmu', 'James Madison University', 'JMU', 'Harrisonburg', 'VA', 38.4351, -78.8698)
  on conflict do nothing;

  for i in 1..25 loop
    user_id := ('20000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid;
    university_id := case when i <= 19 then university_ids[1] else university_ids[2 + ((i - 20) % 4)] end;
    email_address := lower(first_names[i] || '.' || last_names[i] || i || '@missouri.edu');
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      confirmation_token, recovery_token, email_change, email_change_token_new
    ) values (
      '00000000-0000-0000-0000-000000000000', user_id, 'authenticated', 'authenticated',
      email_address,
      crypt('demo1234', gen_salt('bf')), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('display_name', first_names[i] || ' ' || last_names[i]),
      now() - interval '400 days', now(), '', '', '', ''
    ) on conflict (id) do nothing;
    insert into auth.identities (
      id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) values (
      ('21000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
      email_address, user_id,
      jsonb_build_object('sub', user_id::text, 'email', email_address),
      'email', now(), now(), now()
    ) on conflict (provider_id, provider) do nothing;
    insert into public.profiles (
      id, university_id, display_name, class_year, bio, rodie_since,
      likes_collected, connection_count, verified_at
    )
    values (
      user_id, university_id, first_names[i] || ' ' || last_names[i], 2013 + (i % 4),
      'Mizzou rodie. Here for what is happening now.', current_date - (120 + i * 11),
      840 + i * 173, 34 + i * 9, now()
    )
    on conflict (id) do nothing;
  end loop;

  for i in 1..60 loop
    user_id := ('20000000-0000-0000-0000-' || lpad((case when i <= 50 then 1 + ((i - 1) % 19) else 20 + ((i - 51) % 4) end)::text, 12, '0'))::uuid;
    university_id := case when i <= 50 then university_ids[1] else university_ids[2 + ((i - 51) % 4)] end;
    post_id := ('30000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid;
    insert into public.posts (
      id, author_id, university_id, body, image_url, anonymous, anonymous_gender,
      audience, created_at, base_expires_at, expires_at, latitude, longitude, radius_miles
    ) values (
      post_id, user_id, university_id, bodies[1 + ((i - 1) % array_length(bodies, 1))],
      case when i % 11 = 0 then 'erodr-demo/generated-demo-campus-friends.png' when i % 13 = 0 then 'erodr-demo/generated-demo-campus-quad.png' when i % 17 = 0 then 'erodr-demo/generated-demo-late-night-pizza.png' else null end,
      i % 5 = 0 or i % 7 = 0,
      case when i % 5 = 0 or i % 7 = 0 then (case when i % 2 = 0 then 'Woman' else 'Man' end)::public.anonymous_gender else null end,
      case when i > 50 then (case when i % 2 = 0 then 'ticker' else 'national' end)::public.post_audience else 'classmates'::public.post_audience end,
      now() - (i * interval '4 minutes'), now() + interval '6 hours', now() + interval '6 hours',
      38.9404 + i * 0.00005, -92.3277 - i * 0.00004, 5
    ) on conflict (id) do nothing;
  end loop;

  for i in 1..180 loop
    insert into public.post_votes (post_id, voter_id, value)
    values (
      ('30000000-0000-0000-0000-' || lpad((1 + ((i - 1) % 60))::text, 12, '0'))::uuid,
      ('20000000-0000-0000-0000-' || lpad((1 + ((i * 7) % 25))::text, 12, '0'))::uuid,
      case when i % 5 = 0 then -1 else 1 end
    ) on conflict (post_id, voter_id) do update set value = excluded.value;
  end loop;

  for i in 1..108 loop
    insert into public.responses (id, post_id, author_id, body, anonymous, visibility, created_at)
    values (
      ('40000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
      ('30000000-0000-0000-0000-' || lpad((1 + ((i - 1) % 32))::text, 12, '0'))::uuid,
      ('20000000-0000-0000-0000-' || lpad((1 + ((i + 3) % 25))::text, 12, '0'))::uuid,
      response_bodies[1 + ((i - 1) % array_length(response_bodies, 1))],
      i % 13 = 0, 'public', now() - (i * interval '3 minutes')
    ) on conflict (id) do nothing;
  end loop;
end $$;
