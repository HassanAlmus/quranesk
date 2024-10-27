export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
}

export type Surah = {
  __typename?: "Surah"
  id: Scalars["Int"]
  title: Scalars["String"]
  place: Scalars["String"]
  count: Scalars["Int"]
  titleAr: Scalars["String"]
  index: Scalars["Int"]
  startPage: Scalars["Int"]
  juz: Array<Maybe<Juz>>
  reciters: RecitersList
  verses: Array<Verse>
}

export type Juz = {
  __typename?: "Juz"
  index: Scalars["String"]
  verse: StartEnd
}

export type StartEnd = {
  __typename?: "StartEnd"
  start: Scalars["String"]
  end: Scalars["String"]
}

export type NamoonaTopic = {
  __typename?: "NamoonaTopic"
  text: Scalars["String"]
  range: Array<Scalars["Int"]>
  link: Scalars["String"]
  title: Scalars["String"]
}

export type Verse = {
  __typename?: "Verse"
  id: Scalars["String"]
  meta: Meta
  words: Array<Maybe<Word>>
  arabic: Scalars["String"]
  uthmani: Scalars["String"]
  indopak: Scalars["String"]
  puyaen: Array<Maybe<Scalars["String"]>>
  chinoyen: Array<Maybe<Scalars["String"]>>
  namoonaur: Array<Maybe<NamoonaTopic>>
  enahmedali: Scalars["String"]
  enqarai: Scalars["String"]
  ensarwar: Scalars["String"]
  enchinoy: Scalars["String"]
  enyusufali: Scalars["String"]
  trgolpinarli: Scalars["String"]
  urahmedali: Scalars["String"]
  urnajafi: Scalars["String"]
  urjawadi: Scalars["String"]
  azmammadaliyev: Scalars["String"]
  tjayati: Scalars["String"]
  frfakhri: Scalars["String"]
  hijawadi: Scalars["String"]
  faansarian: Scalars["String"]
  famakarem: Scalars["String"]
  fagharaati: Scalars["String"]
  faghomshei: Scalars["String"]
  fafoolavand: Scalars["String"]
  azmehdiyev: Scalars["String"]
  ursafdar: Scalars["String"]
  famoezzi: Scalars["String"]
  fasadeqi: Scalars["String"]
  famojtabavi: Scalars["String"]
  fabahrampour: Scalars["String"]
  faayati: Scalars["String"]
  fakhorramshahi: Scalars["String"]
  [key: string]: (Scalars["String"]|Array<Maybe<Scalars["String"]>>|Array<Maybe<NamoonaTopic>>|"Verse"|undefined|Meta|Array<Maybe<Word>>|undefined)
}

export type Meta = {
  __typename?: "Meta"
  ayah: Scalars["Int"]
  page: Scalars["Int"]
  surah: Scalars["Int"]
  words: Scalars["Int"]
  tse: Array<Scalars["String"]>
}

export type Word = {
  __typename?: "Word"
  arabic: Scalars["String"]
  indopak: Scalars["String"]
  uthmani: Scalars["String"]
  niq: Scalars["Int"]
  nis: Scalars["Int"]
  root: Scalars["String"]
  transliteration: Scalars["String"]
  english: Scalars["String"]
  bangla: Scalars["String"]
  hindi: Scalars["String"]
  indonesian: Scalars["String"]
  urdu: Scalars["String"]
  russian: Scalars["String"]
  ingush: Scalars["String"]
  german: Scalars["String"]
  turkish: Scalars["String"]
  ayah: Scalars["Int"]
  surah: Scalars["Int"]
  [key: string]: (Scalars["String"]| Maybe<Scalars["Int"]>|"Word"|undefined)
}

export type RecitersList = {
  __typename?: "RecitersList"
  AmerAlKadhimi: Scalars["String"]
  MaythamAlTammar: Scalars["String"]
  AhmedAlDabagh: Scalars["String"]
  ShahriarParhizgar: Scalars["String"]
  QassemRedheii: Scalars["String"]
  JawadBanohiTusi: Scalars["String"]
  MahdiSiafZadeh: Scalars["String"]
  MustafaAlSarraf: Scalars["String"]
  MuhammadAliAlDehdeshti: Scalars["String"]
  MuhammadHosseinSaidian: Scalars["String"]
  AbdulKabeerHaidari: Scalars["String"]
  KarimMansouri: Scalars["String"]
  [key: string]: (Scalars["String"]|"RecitersList"|undefined)
}

export type Maps = {
  __typename?: "Maps"
  translationLanguages: Array<TranslationLanguage>
  audio: Array<Audio>
  tafseers: Array<Tafseer>
}

export type TranslationLanguage = {
  __typename?: "TranslationLanguage"
  name: Scalars["String"]
  name2: Scalars["String"]
  img: Scalars["String"]
  translations: Array<Translation>
}

export type Translation = {
  __typename?: "Translation"
  name: Scalars["String"]
  key: Scalars["String"]
}

export type Audio = {
  __typename?: "Audio"
  name: Scalars["String"]
  url: Scalars["String"]
  key: Scalars["String"]
  type: Scalars["String"]
}

export type Tafseer = {
  __typename?: "Tafseer"
  language: Scalars["String"]
  name: Scalars["String"]
  key: Scalars["String"]
}

export type User = {
  translations: string[];
  tafseers: string[];
  audio: string;
  wbwtranslation: string;
  rasm: string;
  autoplay: boolean;
  surahAudio: string;
  surahTranslation: (null|string);
  surahTafseer: (null|string);
  [key: string]: (string|string[]|boolean)
}