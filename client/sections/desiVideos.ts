/**
 * StreamsIndia video CDN map — Bunny Stream 480p.
 * Titles match catalog / section display names where possible.
 */

export type DesiVideoEntry = {
  title: string;
  url: string;
  /** Portrait thumbnail under /Potrait-New_desi/ */
  thumb: string;
};

/** Closest available thumb when filename does not exist in public/ */
function thumb(file: string) {
  return `/Potrait-New_desi/${file}`;
}

/**
 * Full catalog — original 46 kept unchanged; additional sheet URLs appended.
 */
export const LATEST_VIDEOS: DesiVideoEntry[] = [
  {
    title: 'Midnight Case',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/cdb7b936-b110-48c7-acaa-a5bad2fc57bd/play_480p.mp4',
    thumb: thumb('MIDNIGHT ESCAPE.jpg'),
  },
  {
    title: 'Black Horizon',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/716f0c5e-3509-4f1c-84e6-f5838a0300b5/play_480p.mp4',
    thumb: thumb('BLACK SIGNAL.jpg'),
  },
  {
    title: 'Dark Empire',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/2c0ea145-e0d1-44a9-8a3b-b3a40b01f11a/play_480p.mp4',
    thumb: thumb('DARK CITY FILES.jpg'),
  },
  {
    title: 'Chase to Danger Ep1',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/2ca7a8c9-3c22-40d7-9b8f-ad9c9be989cb/play_480p.mp4',
    thumb: thumb('SCILENT CHASE.jpg'),
  },
  {
    title: 'Blackmail Junction',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/40448adf-7577-4a1b-8bbb-0c0e1dedbb46/play_480p.mp4',
    thumb: thumb('MYSTERY JUNCTION.jpg'),
  },
  {
    title: 'Hidden Fear Ep4',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/311aa2ba-164c-41b8-b9d1-910063c83d5d/play_480p.mp4',
    thumb: thumb('BEYOND SUSPICION EP2.jpg'),
  },
  {
    title: 'Shadow Force',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/86344b4d-c5c0-42cd-8d51-2ea14e6215ad/play_480p.mp4',
    thumb: thumb('SHADOW PROTOCOL.jpg'),
  },
  {
    title: 'Hidden Fear Ep3',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/cf401e32-06ee-4fe9-a6eb-53fe6e441d72/play_480p.mp4',
    thumb: thumb('BEYOND SUSPICION EP1.jpg'),
  },
  {
    title: 'Muck English with Su',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/2795a481-8756-4f0e-9183-25cc35c85daf/play_480p.mp4',
    thumb: thumb('HER STORY.jpg'),
  },
  {
    title: 'Hidden Fear Ep2',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/df61e791-f5e0-48cd-bfbb-49c5afbd2b84/play_480p.mp4',
    thumb: thumb('THE HIDDEN ENEMY.jpg'),
  },
  {
    title: 'Kill Her Goats',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/d40f15c2-9c38-4d04-a08a-47dea08151bc/play_480p.mp4',
    thumb: thumb('KILLER INSTINCT.jpg'),
  },
  {
    title: 'Escape Route 21',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/95e1a708-9d85-476c-83cd-a0f656f46dd4/play_480p.mp4',
    thumb: thumb('ESCAPE ROUT 21.jpg'),
  },
  {
    title: 'Adventure Ke Raaz',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/919cb0e1-f1dc-40f5-8698-59bdfa0d2fd4/play_480p.mp4',
    thumb: thumb('ADVENTURE KE RAAZ.jpg'),
  },
  {
    title: 'Secret Nights',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/8b2ccb4d-032d-4671-b3fe-7459f7bf6e4c/play_480p.mp4',
    thumb: thumb('SECRET NIGHTS.jpg'),
  },
  {
    title: 'The Shadow Game Ep4',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/8c586fdf-c6b1-4dec-83b2-a700c2ae3c1a/play_480p.mp4',
    thumb: thumb('THE SHADOW GAME EP4.jpg'),
  },
  {
    title: 'The Shadow Game Ep2',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/1180b80a-fca0-402d-b86e-6c25988818ba/play_480p.mp4',
    thumb: thumb('THE SHADOW GAME EP2.jpg'),
  },
  {
    title: 'The Shadow Game Ep3',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/8c586fdf-c6b1-4dec-83b2-a700c2ae3c1a/play_480p.mp4',
    thumb: thumb('THE SHADOW GAME EP3.jpg'),
  },
  {
    title: 'Wanted by Darkness',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/153805c9-a16e-48fc-8bdd-e33db79cb737/play_480p.mp4',
    thumb: thumb('WANTED BY DARKNESS.jpg'),
  },
  {
    title: 'The Shadow Game Ep1',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/5cd8a869-e025-4b8d-9dec-5d34c38c4a37/play_480p.mp4',
    thumb: thumb('THE SHADOW GAME EP1.jpg'),
  },
  {
    title: 'Mystery Junction',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/28e8218c-9ab8-43d9-a375-c8911de661fd/play_480p.mp4',
    thumb: thumb('MYSTERY JUNCTION.jpg'),
  },
  {
    title: 'Underground Warriors Ep1',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/f614d9ea-0e47-4fd0-97ec-45b26b6eac42/play_480p.mp4',
    thumb: thumb('UNDERGROUND WARRIORS EP1.jpg'),
  },
  {
    title: 'Underground Warriors Ep2',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/30f1099b-78b3-43e8-ae24-72ba766b57e6/play_480p.mp4',
    thumb: thumb('UNDERGROUND WARRIORS EP2.jpg'),
  },
  {
    title: 'Wanted for Revenge',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/8a65b7aa-fa05-4a1e-9d25-3d34a0af19b5/play_480p.mp4',
    thumb: thumb('WANTED FOR REVENGE.jpg'),
  },
  {
    title: 'Dangerous Territory',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/89953c37-edf9-4b6d-85eb-eeb8251f4818/play_480p.mp4',
    thumb: thumb('DANGEROUS TERRITORY.jpg'),
  },
  {
    title: 'The Secret Mission',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/71121b34-eb1f-4a5d-984a-e1661e402d2d/play_480p.mp4',
    thumb: thumb('THE SECRET MISSION.jpg'),
  },
  {
    title: 'The Dark Network',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/a9c3c48b-795d-400d-9483-40f612740a21/play_480p.mp4',
    thumb: thumb('THE DARK NETWORK.jpg'),
  },
  {
    title: 'Rogue Nation',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/914c52d0-5a98-43f5-992a-beaddefb5ab1/play_480p.mp4',
    thumb: thumb('ROGUE MISSON.jpg'),
  },
  {
    title: 'Dangerous Minds Ep3',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/fd099482-0261-4b67-b760-f2cbcf8e06df/play_480p.mp4',
    thumb: thumb('DANGEROUS MINDS EP3.jpg'),
  },
  {
    title: 'Final Countdown',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/3514fd24-dc36-41f6-92ee-d0c151f16021/play_480p.mp4',
    thumb: thumb('FINAL COUNTDOWN.jpg'),
  },
  {
    title: 'Dangerous Minds Ep1',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/da939e64-f3d5-495d-9c7a-6edb64925d1e/play_480p.mp4',
    thumb: thumb('DANGEROUS MINDS EP1.jpg'),
  },
  {
    title: 'Dangerous Minds Ep2',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/fd099482-0261-4b67-b760-f2cbcf8e06df/play_480p.mp4',
    thumb: thumb('DANGEROUS MINDS EP2.jpg'),
  },
  {
    title: 'Final Witness',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/a74bf4eb-3380-4b9b-b091-9ec09acbd22d/play_480p.mp4',
    thumb: thumb('FINAL WITNESS.jpg'),
  },
  {
    title: 'Escape Plan 302',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/eeb54276-c87d-418e-b19c-0dcf00dad105/play_480p.mp4',
    thumb: thumb('ESCAPE PLAN 302.jpg'),
  },
  {
    title: 'Dead End Mission',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/77627729-6d06-45f5-9f26-c5362bf33fc2/play_480p.mp4',
    thumb: thumb('DEAD END MISSON.jpg'),
  },
  {
    title: 'The Final Dhokha',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/890fe0ae-1956-4409-a9fe-635ff0c7a711/play_480p.mp4',
    thumb: thumb('THE FINAL DHOKHA.jpg'),
  },
  {
    title: 'The Secret Order',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/397c0570-5de5-4bd3-9a4b-c4063c2e977c/play_480p.mp4',
    thumb: thumb('THE SECRET ORDER.jpg'),
  },
  {
    title: 'Fatal Connections Ep2',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/c82bbf6f-2701-41ec-bf2a-56c1661ed780/play_480p.mp4',
    thumb: thumb('FATAL CONNECTIONS EP2.jpg'),
  },
  {
    title: 'Raaz, Revenge & Mafia Ep2',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/f4ad3455-6bfc-4436-8d0d-543d1eec8d28/play_480p.mp4',
    thumb: thumb('RAAZ, REVENGE & MAFIA EP2.jpg'),
  },
  {
    title: 'Silent Trigger',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/5f4e3635-6eb7-4ad5-a2aa-400541d22e96/play_480p.mp4',
    thumb: thumb('SCILENT TRIGGER.jpg'),
  },
  {
    title: 'Raaz, Revenge & Mafia Ep1',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/28547fd1-f01a-4b0b-9b68-0729d2a8e8c2/play_480p.mp4',
    thumb: thumb('RAAZ, REVENGE & MAFIA EP1.jpg'),
  },
  {
    title: 'The Secret Route Ep1',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/51f664a4-dfe0-46b7-be10-e3ed819c3ec1/play_480p.mp4',
    thumb: thumb('THE SECRET ROUT EP 1.jpg'),
  },
  {
    title: 'The Secret Route Ep2',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/6bf9873a-bbdb-4253-a0b8-3ce37b046c87/play_480p.mp4',
    thumb: thumb('THE SECRET ROUT EP 2.jpg'),
  },
  {
    title: 'Silent Chase',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/d6d3724c-e5fe-45bc-8a98-6a2c2f39d60b/play_480p.mp4',
    thumb: thumb('SCILENT CHASE.jpg'),
  },
  {
    title: 'The Hidden Truth',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/4a7b3bca-46b6-4ea8-88ed-03b374b4664f/play_480p.mp4',
    thumb: thumb('THE HIDDEN TRUTH.jpg'),
  },
  {
    title: 'Raaz Beyond Fear',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/7a4a75b5-c88f-42cf-9bf6-219479cd05e5/play_480p.mp4',
    thumb: thumb('RAAZ BEYOND FEAR.jpg'),
  },
  {
    title: 'The Missing Witness',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/af831cce-bcaf-4631-9817-e835f5f0d5db/play_480p.mp4',
    thumb: thumb('THE MISSING WITNESS.jpg'),
  },
  {
    title: 'The Forbidden Files',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/85f84324-4088-4cc8-8ea2-ca99cb7bc568/play_480p.mp4',
    thumb: thumb('THE FORBIDDEN FILES.jpg'),
  },
  {
    title: 'Fatal Connections Ep1',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/2599bc17-5da5-4ebe-88c6-4e388cfb6e7a/play_480p.mp4',
    thumb: thumb('FATAL CONNECTIONS EP1.jpg'),
  },
  {
    title: 'Fatal Connections Ep3',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/e039a210-2833-4540-8ed2-882920df66ad/play_480p.mp4',
    thumb: thumb('FATAL CONNECTIONS EP3.jpg'),
  },
  {
    title: 'The Hidden Enemy',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/47557aed-0f85-45cf-a818-19fd88a2b8de/play_480p.mp4',
    thumb: thumb('THE HIDDEN ENEMY.jpg'),
  },
  {
    title: 'The Final Secret',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/3ed4455a-3408-42e9-bf9a-5f45d616ad76/play_480p.mp4',
    thumb: thumb('THE FINAL SECRET.jpg'),
  },
  {
    title: 'Black Diary Secrets Ep1',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/62b9d1e4-4a58-440d-aced-b23367687127/play_480p.mp4',
    thumb: thumb('BLACK DIARY SECRETS  EP1.jpg'),
  },
  {
    title: 'Black Diary Secrets Ep2',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/34f1001c-5f45-4a80-8a76-a2bee40bb09a/play_480p.mp4',
    thumb: thumb('BLACK DIARY SECRETS  EP2.jpg'),
  },
  {
    title: 'The Missing Link',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/11444673-b5cf-43a1-a6fa-7cc8e4552e96/play_480p.mp4',
    thumb: thumb('THE MISSING LINK.jpg'),
  },
  {
    title: 'Rogue Mission',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/bc22fa81-0406-4f0a-bdf1-a5a928abdcec/play_480p.mp4',
    thumb: thumb('MIDNIGHT ESCAPE.jpg'),
  },
  {
    title: 'Operation Nightfall',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/28d84155-2e99-4633-833d-01bfb7187dd3/play_480p.mp4',
    thumb: thumb('OPERATION NIGHTFALL.jpg'),
  },
  {
    title: 'Beyond Suspicion Ep2',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/efc7bcdc-2e0e-45a7-a195-7f253abb5763/play_480p.mp4',
    thumb: thumb('BEYOND SUSPICION EP2.jpg'),
  },
  {
    title: 'The Unknown Target',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/cb6cdbd5-e1d3-470c-ab5c-a7e8bcb58945/play_480p.mp4',
    thumb: thumb('THE UNKNOWN TARGET.jpg'),
  },
  {
    title: 'Last Mission Alive',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/a1d91030-cf54-420a-9b1c-4afe9ba19e15/play_480p.mp4',
    thumb: thumb('LAST MISSION ALIVE.jpg'),
  },
  {
    title: 'The Diary Secrets',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/d1f6716d-b7b1-41c3-8e4a-fd7204a75a74/play_480p.mp4',
    thumb: thumb('THE DIARY SECRETS.jpg'),
  },
  {
    title: 'Shadow Protocol',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/08ebb0ad-11cd-458a-823b-3e19382347aa/play_480p.mp4',
    thumb: thumb('SHADOW PROTOCOL.jpg'),
  },
  {
    title: 'The Wanted Target',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/b9704452-fd1f-431d-a921-a0fa8187a170/play_480p.mp4',
    thumb: thumb('THE WANTED TARGET.jpg'),
  },
  {
    title: 'Unknown Enemy Ep3',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/c4bcdd12-b1f3-4598-9ffc-b7072ac2d354/play_480p.mp4',
    thumb: thumb('UNKNOWN ENEMY EP3.jpg'),
  },
  {
    title: 'Killer Instinct',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/b920eca1-3a4a-4fce-bebd-0a9d2633e4f3/play_480p.mp4',
    thumb: thumb('KILLER INSTINCT.jpg'),
  },
  {
    title: 'Black Signal',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/f5c0b07d-5a7f-4df6-b906-1f7a2f0cef76/play_480p.mp4',
    thumb: thumb('BLACK SIGNAL.jpg'),
  },
  {
    title: 'Hidden Fear Ep1',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/d72d661d-325f-4d19-b173-bf88746ddc7a/play_480p.mp4',
    thumb: thumb('MIDNIGHT ESCAPE.jpg'),
  },
  {
    title: 'The Silent Hunt',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/4941972e-1692-4d0b-ab19-28887a806631/play_480p.mp4',
    thumb: thumb('MIDNIGHT ESCAPE.jpg'),
  },
  {
    title: 'Crimewave',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/516d12a8-04e5-4779-87d2-fa2809493d70/play_480p.mp4',
    thumb: thumb('MIDNIGHT ESCAPE.jpg'),
  },
  {
    title: 'Dangerous Destination Ep1',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/6e1962ba-dbcc-4c2b-963a-d3176124deb4/play_480p.mp4',
    thumb: thumb('MIDNIGHT ESCAPE.jpg'),
  },
  {
    title: 'Dangerous Destination Ep3',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/613259cb-60be-4296-96ca-63ebc21922c0/play_480p.mp4',
    thumb: thumb('MIDNIGHT ESCAPE.jpg'),
  },
  {
    title: 'Dangerous Destination Ep4',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/2c902c65-1f63-4855-be88-cee69e2ac9a0/play_480p.mp4',
    thumb: thumb('MIDNIGHT ESCAPE.jpg'),
  },
  {
    title: 'Killer Wali Raat',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/436a5e04-04b6-4bcc-bd2d-c54939083b0c/play_480p.mp4',
    thumb: thumb('MIDNIGHT ESCAPE.jpg'),
  },
  {
    title: 'Code Red Mafia',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/29215cc6-4174-406b-a21d-71122bc7336a/play_480p.mp4',
    thumb: thumb('MIDNIGHT ESCAPE.jpg'),
  },
  {
    title: 'The Unofficial Network',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/a90c6024-768c-4c24-87d4-07612b07477a/play_480p.mp4',
    thumb: thumb('MIDNIGHT ESCAPE.jpg'),
  },
  {
    title: 'Shadow Operation',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/7daed06f-23e0-41d5-a35c-9529616f0773/play_480p.mp4',
    thumb: thumb('MIDNIGHT ESCAPE.jpg'),
  },
  {
    title: 'Chase to Danger Ep2',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/671096db-84aa-4452-8298-d564b5fe5a41/play_480p.mp4',
    thumb: thumb('MIDNIGHT ESCAPE.jpg'),
  },
  {
    title: 'Dark Evidence',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/3b1ff614-219e-4e77-8a2f-ad32e744267e/play_480p.mp4',
    thumb: thumb('MIDNIGHT ESCAPE.jpg'),
  },
  {
    title: 'The Last Truth Ep1',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/710a74b7-ec71-4504-abc9-d231aa23c2ec/play_480p.mp4',
    thumb: thumb('MIDNIGHT ESCAPE.jpg'),
  },
  {
    title: 'Adventure Beyond Borders',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/6dfc4323-4ae3-428e-9866-13053dbd731c/play_480p.mp4',
    thumb: thumb('MIDNIGHT ESCAPE.jpg'),
  },
  {
    title: 'Escape From Nowhere',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/80d10199-16c3-433f-8802-de52a258588c/play_480p.mp4',
    thumb: thumb('ESCAPE FROM NOWHERE.jpg'),
  },
  {
    title: 'Dangerous Minds Ep4',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/fb60c689-0ae6-4d37-9e7a-0a6fd490aef0/play_480p.mp4',
    thumb: thumb('DANGEROUS MINDS EP4.jpg'),
  },
  {
    title: 'Beyond Suspicion Ep1',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/1a4d0e65-a4a4-4468-99f6-51d2e3754ded/play_480p.mp4',
    thumb: thumb('BEYOND SUSPICION EP1.jpg'),
  },
  {
    title: 'The Secret Syndicate',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/6cffca6b-7759-40e7-84de-c97856b4c7be/play_480p.mp4',
    thumb: thumb('THE SECRET SYNDICATE.jpg'),
  },
  {
    title: 'Midnight Escape',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/9ac5b5f9-d682-44a7-b877-772dec4b380d/play_480p.mp4',
    thumb: thumb('MIDNIGHT ESCAPE.jpg'),
  },
  {
    title: 'Her Story',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/e8ad8fc4-49fa-43ab-9fda-36916e56d066/play_480p.mp4',
    thumb: thumb('HER STORY.jpg'),
  },
  {
    title: 'Escape Beyond Fear Ep1',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/7bd7696a-2b32-4542-ac63-73fe38a547fc/play_480p.mp4',
    thumb: thumb('ESCAPE BEYOND FEAR EP1.jpg'),
  },
  {
    title: 'Escape Beyond Fear Ep2',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/e2c089c7-9466-462d-93c7-a72a539672b6/play_480p.mp4',
    thumb: thumb('ESCAPE BEYOND FEAR EP2.jpg'),
  },
  {
    title: 'Escape Beyond Fear Ep3',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/06429499-6d65-49a3-98e6-84777884c4a2/play_480p.mp4',
    thumb: thumb('ESCAPE BEYOND FEAR EP3.jpg'),
  },
  {
    title: 'The Last Deal',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/2508404e-25a4-475c-8c05-af707dbf1e5d/play_480p.mp4',
    thumb: thumb('THE LAST DEAL.jpg'),
  },
  {
    title: 'The Crime Circle',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/912b01f0-6f55-491b-931d-7cda175785e2/play_480p.mp4',
    thumb: thumb('THE CRIME CIRCLE.jpg'),
  },
  {
    title: 'Mission Darknight',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/bf3ebf7d-ca49-443f-b7b8-1a3d4e2ae96b/play_480p.mp4',
    thumb: thumb('MIDNIGHT ESCAPE.jpg'),
  },
  {
    title: 'Silent Witness',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/a0f4772a-4376-44b1-a458-b50eff38a0e0/play_480p.mp4',
    thumb: thumb('MIDNIGHT ESCAPE.jpg'),
  },
  {
    title: 'The Last Chance',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/20428f28-cc91-4463-bb07-df334be38ab3/play_480p.mp4',
    thumb: thumb('MIDNIGHT ESCAPE.jpg'),
  },
  {
    title: 'Dangerous Destination Ep2',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/4527946b-8e26-4e53-87da-ab74f2313614/play_480p.mp4',
    thumb: thumb('MIDNIGHT ESCAPE.jpg'),
  },
  {
    title: 'Chase to Danger Ep3',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/9d656763-670c-49e0-b721-ba6e9291b17b/play_480p.mp4',
    thumb: thumb('MIDNIGHT ESCAPE.jpg'),
  },
  {
    title: 'Chase to Danger Ep4',
    url: 'https://vz-012bcd01-e4e.b-cdn.net/af763878-2990-48bd-83f1-b396dbce21f7/play_480p.mp4',
    thumb: thumb('MIDNIGHT ESCAPE.jpg'),
  },
];

/** SNO → URL (1-based). Cycles catalog so all catalog SNOs play a real file. */
export const VIDEOS: Record<number, string> = {};
for (let i = 1; i <= 120; i++) {
  VIDEOS[i] = LATEST_VIDEOS[(i - 1) % LATEST_VIDEOS.length].url;
}

export function getVideo(sno: number): string {
  return VIDEOS[sno] ?? LATEST_VIDEOS[0].url;
}

export function getLatestVideo(index: number): DesiVideoEntry {
  return LATEST_VIDEOS[((index % LATEST_VIDEOS.length) + LATEST_VIDEOS.length) % LATEST_VIDEOS.length];
}

/** Resolve CDN URL by display title (case-insensitive partial match). */
export function getVideoByTitle(title: string): string {
  const n = title.trim().toLowerCase();
  const exact = LATEST_VIDEOS.find((v) => v.title.toLowerCase() === n);
  if (exact) return exact.url;
  const partial = LATEST_VIDEOS.find(
    (v) =>
      n.includes(v.title.toLowerCase()) ||
      v.title.toLowerCase().includes(n) ||
      n.replace(/\s+/g, '').includes(v.title.toLowerCase().replace(/\s+/g, ''))
  );
  return partial?.url ?? LATEST_VIDEOS[0].url;
}
