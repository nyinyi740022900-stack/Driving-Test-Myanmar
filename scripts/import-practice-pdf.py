#!/usr/bin/env python3
"""
DEPRECATED — Do not use for production without full paraphrase.

Extracts scanned PDF text via OCR. Practice and Test File PDFs are reference-only;
verbatim import risks copyright issues. Use scripts/build-inspired-sets.mjs instead.
"""

from typing import List, Optional
import json
import re
import subprocess
import sys
from dataclasses import asdict, dataclass
from pathlib import Path

import fitz  # PyMuPDF

ROOT = Path(__file__).resolve().parents[2]
PRACTICE_DIR = ROOT / "Practice and Test File"
OUT_DIR = ROOT / "web" / "content" / "past-papers"
IMAGE_DIR = ROOT / "web" / "public" / "past-papers" / "sg_btt"
OCR_SCRIPT = ROOT / "web" / "scripts" / "ocr-image.swift"

PAPERS = [
    {
        "id": "btt-test-1",
        "title": "BTT Practice Test 1",
        "titleMy": "BTT လေ့ကျင့်စာမေးပွဲ ၁",
        "pdf": PRACTICE_DIR / "BTT Practice /BTT-test-1_Question-and-Answer.pdf",
        "kind": "btt_practice",
    },
    {
        "id": "btt-test-2",
        "title": "BTT Practice Test 2",
        "titleMy": "BTT လေ့ကျင့်စာမေးပွဲ ၂",
        "pdf": PRACTICE_DIR / "BTT Practice /BTT-test-2_Question-and-Answer.pdf",
        "kind": "btt_practice",
    },
    {
        "id": "btt-test-3",
        "title": "BTT Practice Test 3",
        "titleMy": "BTT လေ့ကျင့်စာမေးပွဲ ၃",
        "pdf": PRACTICE_DIR / "BTT Practice /BTT-test-3_Question-and-Answer.pdf",
        "kind": "btt_practice",
    },
    {
        "id": "btt-test-4",
        "title": "BTT Practice Test 4",
        "titleMy": "BTT လေ့ကျင့်စာမေးပွဲ ၄",
        "pdf": PRACTICE_DIR / "BTT Practice /BTT-test-4_Question-and-Answer.pdf",
        "kind": "btt_practice",
    },
    {
        "id": "btt-test-5",
        "title": "BTT Practice Test 5",
        "titleMy": "BTT လေ့ကျင့်စာမေးပွဲ ၅",
        "pdf": PRACTICE_DIR / "BTT Practice /BTT-test-5_Question-and-Answer.pdf",
        "kind": "btt_practice",
    },
    {
        "id": "btt-test-6",
        "title": "BTT Practice Test 6",
        "titleMy": "BTT လေ့ကျင့်စာမေးပွဲ ၆",
        "pdf": PRACTICE_DIR / "BTT Practice /BTT-test-6_Question-and-Answer.pdf",
        "kind": "btt_practice",
    },
    {
        "id": "driving-test-p1",
        "title": "Driving Test Paper 1",
        "titleMy": "Driving Test စာမေးပွဲ ၁",
        "pdf": PRACTICE_DIR / "Driving Test/Driving-Test-P1-RS.pdf",
        "kind": "driving_test",
    },
    {
        "id": "driving-test-p2",
        "title": "Driving Test Paper 2",
        "titleMy": "Driving Test စာမေးပွဲ ၂",
        "pdf": PRACTICE_DIR / "Driving Test/Driving-Test-P2-RS.pdf",
        "kind": "driving_test",
    },
    {
        "id": "driving-test-p3",
        "title": "Driving Test Paper 3",
        "titleMy": "Driving Test စာမေးပွဲ ၃",
        "pdf": PRACTICE_DIR / "Driving Test/Driving-Test-P3-RS.pdf",
        "kind": "driving_test",
    },
    {
        "id": "driving-test-p4",
        "title": "Driving Test Paper 4",
        "titleMy": "Driving Test စာမေးပွဲ ၄",
        "pdf": PRACTICE_DIR / "Driving Test/Driving-Test-P4-RS.pdf",
        "kind": "driving_test",
    },
    {
        "id": "driving-test-p5",
        "title": "Driving Test Paper 5",
        "titleMy": "Driving Test စာမေးပွဲ ၅",
        "pdf": PRACTICE_DIR / "Driving Test/Driving-Test-P5-RS.pdf",
        "kind": "driving_test",
    },
    {
        "id": "driving-test-p6",
        "title": "Driving Test Paper 6",
        "titleMy": "Driving Test စာမေးပွဲ ၆",
        "pdf": PRACTICE_DIR / "Driving Test/Driving-Test-P6-RS.pdf",
        "kind": "driving_test",
    },
]

NOISE = {
    "Question",
    "Index",
    "Previous",
    "Next",
    "Correct",
    "answer",
}


@dataclass
class ExtractedQuestion:
    paperId: str
    number: int
    prompt: str
    choices: list[str]
    answer: int
    imageSrc: Optional[str]


def ocr_image(path: Path) -> List[str]:
    result = subprocess.run(
        ["swift", str(OCR_SCRIPT), str(path)],
        capture_output=True,
        text=True,
        check=True,
    )
    return [line.strip() for line in result.stdout.splitlines() if line.strip()]


def parse_ocr_lines(lines: list) -> Optional[tuple]:
    qnum = None
    for line in lines:
        m = re.search(r"QUESTION\s+(\d+)\s+of\s+50", line, re.I)
        if m:
            qnum = int(m.group(1))
            break
    if qnum is None:
        return None

    prompt_parts: list[str] = []
    choices: dict[str, str] = {}
    correct_letter: str | None = None
    mode = "prompt"

    for line in lines:
        if re.search(r"QUESTION\s+\d+\s+of\s+50", line, re.I):
            continue
        if line in NOISE:
            continue

        choice_match = re.match(r"^\(([ABC])\)\s*(.+)$", line)
        if choice_match:
            letter = choice_match.group(1)
            text = choice_match.group(2).strip()
            choices[letter] = text
            mode = "choices"
            continue

        if line.lower() == "correct":
            continue
        if line.lower() == "answer":
            if mode == "choices" and choices:
                correct_letter = list(choices.keys())[-1]
            continue

        if mode == "prompt" and not line.startswith("("):
            if line not in {"Question Index", "Previous Question", "Next Question"}:
                prompt_parts.append(line)

    if len(choices) < 3:
        return None

    ordered = [choices.get("A", ""), choices.get("B", ""), choices.get("C", "")]
    if not all(ordered):
        return None

    if correct_letter is None:
        # fallback: look for inline marker in OCR (rare)
        correct_letter = "B"

    answer = {"A": 0, "B": 1, "C": 2}[correct_letter]
    prompt = " ".join(prompt_parts).strip()
    if not prompt:
        return None

    return qnum, prompt, ordered, answer


def extract_sign_image(page: fitz.Page, dest: Path) -> bool:
    for img in page.get_images(full=True):
        xref = img[0]
        base = page.parent.extract_image(xref)
        if not base or base.get("width", 0) < 80:
            continue
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(base["image"])
        return True
    return False


def process_paper(paper: dict) -> list[ExtractedQuestion]:
    pdf_path: Path = paper["pdf"]
    if not pdf_path.exists():
        print(f"skip missing {pdf_path}", file=sys.stderr)
        return []

    doc = fitz.open(pdf_path)
    extracted: list[ExtractedQuestion] = []
    paper_img_dir = IMAGE_DIR / paper["id"]

    for page_index in range(len(doc)):
        page = doc[page_index]
        render_path = paper_img_dir / f"page-{page_index + 1:02d}.png"
        if not render_path.exists():
            pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
            render_path.parent.mkdir(parents=True, exist_ok=True)
            pix.save(str(render_path))

        sign_path = paper_img_dir / f"sign-{page_index + 1:02d}.png"
        image_src = None
        if extract_sign_image(page, sign_path):
            image_src = f"/past-papers/sg_btt/{paper['id']}/sign-{page_index + 1:02d}.png"

        lines = ocr_image(render_path)
        parsed = parse_ocr_lines(lines)
        if not parsed:
            continue
        qnum, prompt, choices, answer = parsed
        extracted.append(
            ExtractedQuestion(
                paperId=paper["id"],
                number=qnum,
                prompt=prompt,
                choices=choices,
                answer=answer,
                imageSrc=image_src,
            )
        )

    extracted.sort(key=lambda q: q.number)
    return extracted


def main() -> None:
    import argparse

    parser = argparse.ArgumentParser(description="Extract past-paper questions from Practice PDFs")
    parser.add_argument("--paper", help="Process only this paper id (e.g. btt-test-1)")
    args = parser.parse_args()

    papers = PAPERS
    if args.paper:
        papers = [p for p in PAPERS if p["id"] == args.paper]
        if not papers:
            print(f"Unknown paper id: {args.paper}", file=sys.stderr)
            sys.exit(1)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    manifest_path = OUT_DIR / "sg_btt-past-papers.json"
    manifest = {"category": "sg_btt", "papers": [], "questions": []}
    if manifest_path.exists() and args.paper:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        manifest["papers"] = [p for p in manifest.get("papers", []) if p["id"] != args.paper]
        manifest["questions"] = [q for q in manifest.get("questions", []) if q.get("paperId") != args.paper]

    for paper in papers:
        print(f"Processing {paper['id']}...", flush=True)
        qs = process_paper(paper)
        manifest["papers"].append(
            {
                "id": paper["id"],
                "title": paper["title"],
                "titleMy": paper["titleMy"],
                "kind": paper["kind"],
                "questionCount": len(qs),
            }
        )
        for q in qs:
            manifest["questions"].append(asdict(q))
        print(f"  -> {len(qs)} questions", flush=True)

    out_path = manifest_path
    out_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {out_path} ({len(manifest['questions'])} total questions)")


if __name__ == "__main__":
    main()
