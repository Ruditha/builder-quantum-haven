import { RequestHandler } from "express";
import { UploadFastaRequest, UploadFastaResponse } from "@shared/api";
import references from "../data/references";

function parseFasta(text: string) {
  const records: { id: string; seq: string }[] = [];
  const parts = text
    .split(/>+/)
    .map((p) => p.trim())
    .filter(Boolean);
  for (const part of parts) {
    const lines = part.split(/\r?\n/);
    const id = lines[0].split(/\s+/)[0];
    const seq = lines.slice(1).join("").replace(/\s+/g, "").toUpperCase();
    if (id && seq) records.push({ id, seq });
  }
  return records;
}

function compareSequences(ref: string, seq: string) {
  const mutations: { pos: number; ref: string; alt: string; type: string }[] =
    [];
  const minLen = Math.min(ref.length, seq.length);
  for (let i = 0; i < minLen; i++) {
    const r = ref[i];
    const s = seq[i];
    if (r !== s) {
      mutations.push({ pos: i + 1, ref: r, alt: s, type: "SNP" });
    }
  }
  if (seq.length > ref.length) {
    // simple insertion record
    mutations.push({
      pos: ref.length + 1,
      ref: "-",
      alt: seq.slice(ref.length),
      type: "INS",
    });
  } else if (ref.length > seq.length) {
    mutations.push({
      pos: seq.length + 1,
      ref: ref.slice(seq.length),
      alt: "-",
      type: "DEL",
    });
  }
  return mutations;
}

export const handleUploadFasta: RequestHandler = (req, res) => {
  const body = req.body as UploadFastaRequest | undefined;
  if (!body || typeof body.content !== "string") {
    return res.status(400).json({ error: "Missing content in request" });
  }

  const pathogen = body.pathogen ?? "SARS-CoV-2";
  const ref = references[pathogen] ?? Object.values(references)[0];

  const records = parseFasta(body.content);
  const results: UploadFastaResponse = {
    filename: body.filename ?? null,
    pathogen,
    sequences: records.map((r) => ({ id: r.id, length: r.seq.length })),
    mutations: [],
    summary: {
      sequences: records.length,
      total_mutations: 0,
    },
  };

  for (const r of records) {
    const muts = compareSequences(ref, r.seq);
    results.mutations.push({ id: r.id, mutations: muts });
    results.summary.total_mutations += muts.length;
  }

  return res.status(200).json(results);
};

export default handleUploadFasta;
