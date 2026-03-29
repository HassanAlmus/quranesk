import type { GraphQLResolveInfo } from "graphql";
import { getDb } from "../mongodb";

function getRequestedFields(info: GraphQLResolveInfo | undefined) {
  const selections = info?.fieldNodes?.[0]?.selectionSet?.selections;
  if (!selections) return { hasTranslations: false, hasTafsirs: false };

  const fieldNames = selections
    .map((sel: any) => sel?.name?.value)
    .filter(Boolean) as string[];

  const translationFields = [
    "enahmedali",
    "enqarai",
    "ensarwar",
    "enyusufali",
    "enchinoy",
    "trgolpinarli",
    "urahmedali",
    "urjawadi",
    "urnajafi",
    "ursafdar",
    "azmammadaliyev",
    "azmehdiyev",
    "deaburida",
    "ruzeynalov",
    "tjayati",
    "fagharaati",
    "faansarian",
    "famakarem",
    "faghomshei",
    "fafoolavand",
    "frfakhri",
    "hijawadi",
    "famoezzi",
    "faayati",
    "fakhorramshahi",
    "fasadeqi",
    "fabahrampour",
    "famojtabavi",
    "escortes",
  ];

  const tafsirFields = ["puyaen", "chinoyen", "namoonaur", "khorramdelfa"];

  return {
    hasTranslations: translationFields.some((f) => fieldNames.includes(f)),
    hasTafsirs: tafsirFields.some((f) => fieldNames.includes(f)),
  };
}

const translationKeyToField: Record<string, string> = {
  "en.ahmedali": "enahmedali",
  "en.qarai": "enqarai",
  "en.sarwar": "ensarwar",
  "en.yusufali": "enyusufali",
  "en.chinoy": "enchinoy",
  "tr.golpinarli": "trgolpinarli",
  "ur.ahmedali": "urahmedali",
  "ur.jawadi": "urjawadi",
  "ur.najafi": "urnajafi",
  "ur.safdar": "ursafdar",
  "az.mammadaliyev": "azmammadaliyev",
  "az.mehdiyev": "azmehdiyev",
  "de.aburida": "deaburida",
  "ru.zeynalov": "ruzeynalov",
  "tj.ayati": "tjayati",
  "fa.gharaati": "fagharaati",
  "fa.ansarian": "faansarian",
  "fa.makarem": "famakarem",
  "fa.ghomshei": "faghomshei",
  "fa.foolavand": "fafoolavand",
  "fr.fakhri": "frfakhri",
  "hi.jawadi": "hijawadi",
  "fa.moezzi": "famoezzi",
  "fa.ayati": "faayati",
  "fa.khorramshahi": "fakhorramshahi",
  "fa.sadeqi": "fasadeqi",
  "fa.bahrampour": "fabahrampour",
  "fa.mojtabavi": "famojtabavi",
  "es.escortes": "escortes",
};

const requiredTranslations = Object.values(translationKeyToField);

async function resolveSurahs() {
  const db = await getDb();
  const docs = await db.collection("surahs").find({}).toArray();
  return docs.map((surah: any) => ({
    ...surah,
    id: surah._id,
    verses: [],
  }));
}

async function resolveSurah(
  args: { s: number; f?: number; t?: number },
  _parent: unknown,
  _context: unknown,
  info: GraphQLResolveInfo
) {
  const db = await getDb();
  const { s, f = -1, t = -1 } = args;

  const surahInfo = await db
    .collection("surahs")
    .findOne({ surahNumber: s + 1 });
  if (!surahInfo) return null;

  const verses = await db
    .collection("verses")
    .find({ surahNumber: s + 1 })
    .sort({ verseNumber: 1 })
    .skip(f > -1 ? f : 0)
    .limit(t > -1 ? t - (f > -1 ? f : 0) + 1 : 10)
    .toArray();

  const requested = getRequestedFields(info);

  const versesWithTranslations = await Promise.all(
    verses.map(async (verse: any) => {
      if (requested.hasTranslations) {
        const translations = await db
          .collection("translations")
          .find({
            surahNumber: verse.surahNumber,
            verseNumber: verse.verseNumber,
          })
          .toArray();

        translations.forEach((trans: any) => {
          const fieldName =
            translationKeyToField[trans.translation] || trans.translation;
          verse[fieldName] = trans.text;
        });

        requiredTranslations.forEach((field) => {
          if (!verse[field]) verse[field] = "Translation not available";
        });
      } else {
        requiredTranslations.forEach((field) => {
          if (!verse[field]) verse[field] = "";
        });
      }

      verse.puyaen = ["", ""];
      verse.chinoyen = ["", ""];
      verse.namoonaur = [];
      verse.khorramdelfa = "";

      return {
        ...verse,
        id: verse._id,
        arabic: verse.arabic,
        uthmani: verse.uthmani,
        indopak: verse.indopak,
      };
    })
  );

  return {
    ...surahInfo,
    id: surahInfo._id,
    verses: versesWithTranslations,
  };
}

async function resolveVerse(
  args: { s: number; v: number; f?: number; t?: number },
  _parent: unknown,
  _context: unknown,
  info: GraphQLResolveInfo
) {
  const db = await getDb();
  const { s, v, f = -1, t = -1 } = args;

  const verse = await db.collection("verses").findOne({
    surahNumber: s + 1,
    verseNumber: v + 1,
  });
  if (!verse) return null;

  const requested = getRequestedFields(info);

  if (requested.hasTranslations) {
    const translations = await db.collection("translations").find({
      surahNumber: verse.surahNumber,
      verseNumber: verse.verseNumber,
    });
    const transArr = await translations.toArray();

    transArr.forEach((trans: any) => {
      const fieldName =
        translationKeyToField[trans.translation] || trans.translation;
      verse[fieldName] = trans.text;
    });

    requiredTranslations.forEach((field) => {
      if (!verse[field]) verse[field] = "Translation not available";
    });
  } else {
    requiredTranslations.forEach((field) => {
      if (!verse[field]) verse[field] = "";
    });
  }

  if (requested.hasTafsirs) {
    const puya = await db.collection("tafsirs").findOne({
      tafsir: "puya",
      surahNumber: verse.surahNumber,
      verseNumber: verse.verseNumber,
    });
    verse.puyaen = puya ? [`${s}-${v}-${v}`, puya.text] : ["", "Tafsir not available"];
    verse.chinoyen = ["", "Tafsir not available"];
    verse.namoonaur = [];
    verse.khorramdelfa = "Tafsir removed.";
  } else {
    verse.puyaen = ["", ""];
    verse.chinoyen = ["", ""];
    verse.namoonaur = [];
    verse.khorramdelfa = "";
  }

  const words = Array.isArray((verse as any).words) ? (verse as any).words : [];
  const sliceFrom = f > -1 ? f : 0;
  const sliceToExclusive = t > -1 ? t + 1 : words.length;

  return {
    ...verse,
    id: (verse as any)._id,
    words: words.slice(sliceFrom, sliceToExclusive),
  };
}

async function resolveWord(args: { s: number; v: number; w: number }) {
  const db = await getDb();
  const { s, v, w } = args;

  const verse = await db.collection("verses").findOne({
    surahNumber: s + 1,
    verseNumber: v + 1,
  });
  if (!verse || !(verse as any).words?.[w]) return null;

  return {
    ...(verse as any).words[w],
    surah: s + 1,
    ayah: v + 1,
  };
}

async function resolvePage(
  args: { p?: number; s?: number },
  _parent: unknown,
  _context: unknown,
  info: GraphQLResolveInfo
) {
  const db = await getDb();
  const { p = -1, s = -1 } = args;

  let verses: any[] = [];

  if (p === -1 && s !== -1) {
    const surahInfo = await db
      .collection("surahs")
      .findOne({ surahNumber: s + 1 });
    if (!surahInfo) return [];
    verses = await db
      .collection("verses")
      .find({ surahNumber: s + 1, "meta.page": (surahInfo as any).startPage })
      .sort({ verseNumber: 1 })
      .toArray();
  } else if (s === -1 && p !== -1) {
    verses = await db
      .collection("verses")
      .find({ "meta.page": p })
      .sort({ surahNumber: 1, verseNumber: 1 })
      .toArray();
  } else {
    verses = await db
      .collection("verses")
      .find({ "meta.page": p, surahNumber: s + 1 })
      .sort({ verseNumber: 1 })
      .toArray();
  }

  const requested = getRequestedFields(info);

  const out = await Promise.all(
    verses.map(async (verse: any) => {
      if (requested.hasTranslations) {
        const translations = await db.collection("translations").find({
          surahNumber: verse.surahNumber,
          verseNumber: verse.verseNumber,
        });
        const transArr = await translations.toArray();
        transArr.forEach((trans: any) => {
          const fieldName =
            translationKeyToField[trans.translation] || trans.translation;
          verse[fieldName] = trans.text;
        });
        requiredTranslations.forEach((field) => {
          if (!verse[field]) verse[field] = "Translation not available";
        });
      } else {
        requiredTranslations.forEach((field) => {
          if (!verse[field]) verse[field] = "";
        });
      }

      verse.puyaen = ["", ""];
      verse.chinoyen = ["", ""];
      verse.namoonaur = [];
      verse.khorramdelfa = "";

      return { ...verse, id: verse._id };
    })
  );

  return out;
}

async function resolveText() {
  return "Text not implemented yet";
}

async function resolveMaps() {
  return { translationLanguages: [], audio: [], tafseers: [] };
}

async function resolveNamoonaTopic() {
  return { range: [], title: "", link: "", text: "" };
}

export const resolvers = {
  Query: {
    surahs: () => resolveSurahs(),
    surah: (_parent: unknown, args: any, context: unknown, info: GraphQLResolveInfo) =>
      resolveSurah(args, _parent, context, info),
    verse: (_parent: unknown, args: any, context: unknown, info: GraphQLResolveInfo) =>
      resolveVerse(args, _parent, context, info),
    word: (_parent: unknown, args: any) => resolveWord(args),
    page: (_parent: unknown, args: any, context: unknown, info: GraphQLResolveInfo) =>
      resolvePage(args, _parent, context, info),
    text: (_parent: unknown, args: any) => resolveText(),
    maps: () => resolveMaps(),
    namoonaTopic: (_parent: unknown, args: any) => resolveNamoonaTopic(),
  },
};

