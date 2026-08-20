import { NextRequest, NextResponse } from "next/server";
function extractSection(text: string, startPatterns: string[], endPatterns: string[]) {
  const startRegex = new RegExp(startPatterns.join("|"), "i");
  const endRegex = endPatterns.length ? new RegExp(endPatterns.join("|"), "i") : null;

  const startMatch = text.match(startRegex);
  if (!startMatch) return null;
  const startIndex = startMatch.index! + startMatch[0].length;
  let endIndex = text.length;
  if (endRegex) {
    const after = text.slice(startIndex);
    const endMatch = after.match(endRegex);
    if (endMatch && endMatch.index !== undefined) {
      endIndex = startIndex + endMatch.index;
    }
  }
  return text.slice(startIndex, endIndex).trim();
}

function splitLinesAsList(block: string | null) {
  if (!block) return [];
  return block
    .split(/\r?\n/)
    .map((l) => l.replace(/^[-•\*\d\.\)\s]+/, "").trim())
    .filter(Boolean);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const pdfUrl = body.pdfUrl as string | undefined;
    if (!pdfUrl) return NextResponse.json({ error: "pdfUrl required" }, { status: 400 });

    // Fetch PDF bytes
    const res = await fetch(pdfUrl);
    if (!res.ok) return NextResponse.json({ error: "Failed to fetch PDF" }, { status: 400 });
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let text = "";
    try {
      const pdfParse = await import("pdf-parse");
      const data = await pdfParse.default(buffer);
      text = data.text || "";
    } catch (err) {
      console.warn("pdf-parse not installed or failed, falling back to empty text", err);
      text = "";
    }

    // Heuristics: look for common headings
    const responsibilitiesBlock = extractSection(
      text,
      ["Responsibilities", "Duties", "Tâches", "Responsabilit[eé]s", "Main responsibilities"],
      ["Requirements", "Qualifications", "How to apply", "Application", "Submit"]
    );

    const requirementsBlock = extractSection(
      text,
      ["Requirements", "Qualifications", "Profile", "Exigences"],
      ["How to apply", "Application", "Submit", "Responsibilities"]
    );

    const titleMatch = text.match(/^(?:\s*)?([A-Z][A-Za-zÀ-ÖØ-öø-ÿ0-9'\-\s]{3,100})\n/);
    const title = titleMatch ? titleMatch[1].trim() : null;

    const referenceMatch = text.match(/(Ref(?:erence)?|Reference number|Réf|Référence)[:\s]*([A-Z0-9\-\/\s]+)/i);
    const referenceNumber = referenceMatch ? referenceMatch[2].trim() : null;

    const locationMatch = text.match(/(Location|Lieu)[:\s]*([A-Za-zÀ-ÖØ-öø-ÿ\s\-]+)/i);
    const location = locationMatch ? locationMatch[2].trim() : null;

    // Deadline: look for date-like patterns near words deadline, submission
    const deadlineMatch = text.match(/(Deadline|Submission deadline|Date limite)[:\s]*([0-9]{1,2}\s?[A-Za-z]+\s?[0-9]{4}|[0-9]{4}-[0-9]{2}-[0-9]{2})/i);
    const submissionDeadline = deadlineMatch ? deadlineMatch[2].trim() : null;

    const extraction = {
      title,
      referenceNumber,
      contractType: null,
      location,
      submissionDeadline,
      responsibilities: splitLinesAsList(responsibilitiesBlock),
      requirements: splitLinesAsList(requirementsBlock),
      textSnippet: text.slice(0, 2000),
    };

    return NextResponse.json({ extraction });
  } catch (error) {
    console.error("parse error:", error);
    return NextResponse.json({ error: "parse error" }, { status: 500 });
  }
}
