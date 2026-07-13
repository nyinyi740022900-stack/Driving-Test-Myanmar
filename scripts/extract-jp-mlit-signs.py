#!/usr/bin/env python3
"""
Render MLIT 道路標識一覧 PDF and export framed sign crops for the spreadsheet workflow.

Source PDF (download once):
  https://www.mlit.go.jp/road/sign/sign/douro/ichiran.pdf
  → content/spreadsheet-workflow/images/jp/mlit-ichiran.pdf

Usage:
  # 1) Render full page at 300 DPI (~4960×3508 px from vector PDF)
  python3 scripts/extract-jp-mlit-signs.py render

  # 2) Crop a region and fit into 800×600 (white padding, centered)
  python3 scripts/extract-jp-mlit-signs.py crop --name jp-stop --x 1200 --y 2100 --w 180 --h 180

  # 3) Batch from crops.json (manual boxes after inspecting full PNG in Preview/Figma)
  python3 scripts/extract-jp-mlit-signs.py batch

  # 4) Auto-detect sign regions (OpenCV) → extracted/sign-001.png …
  python3 scripts/extract-jp-mlit-signs.py auto

Edit crops.json to add boxes. Coordinates are in pixels on the 300 DPI render.

Output:
  content/spreadsheet-workflow/images/jp/extracted/sign-NNN.png  (800×600)
  content/spreadsheet-workflow/images/jp/crops/<name>.png        (manual/batch)
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

try:
    import fitz  # PyMuPDF
except ImportError:
    print("Install PyMuPDF: pip install pymupdf", file=sys.stderr)
    sys.exit(1)

try:
    from PIL import Image
except ImportError:
    print("Install Pillow: pip install pillow", file=sys.stderr)
    sys.exit(1)

ROOT = Path(__file__).resolve().parents[1]
JP_DIR = ROOT / "content" / "spreadsheet-workflow" / "images" / "jp"
PDF_PATH = JP_DIR / "mlit-ichiran.pdf"
FULL_PNG = JP_DIR / "mlit-ichiran-full-300dpi.png"
CROPS_JSON = JP_DIR / "crops.json"
OUT_DIR = JP_DIR / "crops"
AUTO_DIR = JP_DIR / "extracted"
FRAME = (800, 600)
DPI = 300


def render_full() -> Path:
    JP_DIR.mkdir(parents=True, exist_ok=True)
    if not PDF_PATH.exists():
        print(f"Missing PDF. Download to:\n  {PDF_PATH}", file=sys.stderr)
        sys.exit(1)
    doc = fitz.open(PDF_PATH)
    page = doc[0]
    zoom = DPI / 72
    pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=False)
    pix.save(FULL_PNG)
    doc.close()
    print(f"Rendered {FULL_PNG} ({pix.width}×{pix.height}px @ {DPI} DPI)")
    return FULL_PNG


def frame_crop(src: Image.Image, size: tuple[int, int] = FRAME) -> Image.Image:
    canvas = Image.new("RGB", size, "white")
    src = src.convert("RGB")
    scale = min(size[0] / src.width, size[1] / src.height)
    nw, nh = max(1, int(src.width * scale)), max(1, int(src.height * scale))
    resized = src.resize((nw, nh), Image.Resampling.LANCZOS)
    ox, oy = (size[0] - nw) // 2, (size[1] - nh) // 2
    canvas.paste(resized, (ox, oy))
    return canvas


def crop_region(name: str, x: int, y: int, w: int, h: int, padding: int = 8) -> Path:
    if not FULL_PNG.exists():
        render_full()
    img = Image.open(FULL_PNG)
    x0 = max(0, x - padding)
    y0 = max(0, y - padding)
    x1 = min(img.width, x + w + padding)
    y1 = min(img.height, y + h + padding)
    piece = img.crop((x0, y0, x1, y1))
    framed = frame_crop(piece)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out = OUT_DIR / f"{name}.png"
    framed.save(out, optimize=True)
    print(f"Saved {out}")
    return out


def batch_from_json() -> None:
    if not CROPS_JSON.exists():
        CROPS_JSON.write_text(
            json.dumps(
                {
                    "_note": "Pixel coords on mlit-ichiran-full-300dpi.png. Add entries manually.",
                    "crops": [
                        {
                            "name": "jp-stop-example",
                            "x": 0,
                            "y": 0,
                            "w": 100,
                            "h": 100,
                            "padding": 12,
                        }
                    ],
                },
                indent=2,
                ensure_ascii=False,
            )
            + "\n",
            encoding="utf-8",
        )
        print(f"Created template {CROPS_JSON} — edit boxes, then re-run batch.")
        return
    data = json.loads(CROPS_JSON.read_text(encoding="utf-8"))
    for item in data.get("crops", []):
        crop_region(
            item["name"],
            int(item["x"]),
            int(item["y"]),
            int(item["w"]),
            int(item["h"]),
            int(item.get("padding", 8)),
        )


def auto_extract() -> None:
    try:
        import cv2
        import numpy as np
    except ImportError:
        print("Install OpenCV: pip install opencv-python-headless numpy", file=sys.stderr)
        sys.exit(1)

    if not FULL_PNG.exists():
        render_full()

    bgr = cv2.imread(str(FULL_PNG))
    gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
    _, bw = cv2.threshold(gray, 245, 255, cv2.THRESH_BINARY_INV)
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (7, 7))
    bw = cv2.morphologyEx(bw, cv2.MORPH_OPEN, kernel, iterations=1)
    merged = cv2.morphologyEx(
        bw,
        cv2.MORPH_CLOSE,
        cv2.getStructuringElement(cv2.MORPH_RECT, (25, 25)),
        iterations=2,
    )
    contours, _ = cv2.findContours(merged, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    boxes: list[tuple[int, int, int, int, int]] = []
    for c in contours:
        x, y, w, h = cv2.boundingRect(c)
        area = w * h
        ar = w / max(h, 1)
        if area < 12000 or area > 400000:
            continue
        if w < 50 or h < 50 or w > 900 or h > 700:
            continue
        if ar > 6 or ar < 0.15:
            continue
        boxes.append((area, x, y, w, h))

    boxes.sort(key=lambda b: (b[3] // 120, b[2]))
    AUTO_DIR.mkdir(parents=True, exist_ok=True)

    from PIL import Image

    base = Image.open(FULL_PNG)
    index: list[dict[str, int | str]] = []
    for i, (_, x, y, w, h) in enumerate(boxes, start=1):
        pad = 10
        piece = base.crop(
            (max(0, x - pad), max(0, y - pad), min(base.width, x + w + pad), min(base.height, y + h + pad))
        )
        framed = frame_crop(piece)
        name = f"sign-{i:03d}"
        out = AUTO_DIR / f"{name}.png"
        framed.save(out, optimize=True)
        index.append({"file": f"{name}.png", "x": x, "y": y, "w": w, "h": h})

    (AUTO_DIR / "index.json").write_text(
        json.dumps({"count": len(index), "signs": index}, indent=2),
        encoding="utf-8",
    )
    print(f"Exported {len(index)} signs → {AUTO_DIR}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Extract JP signs from MLIT ichiran PDF")
    sub = parser.add_subparsers(dest="cmd", required=True)

    sub.add_parser("render", help="Render PDF to high-res PNG")

    p_crop = sub.add_parser("crop", help="Crop one region to 800×600")
    p_crop.add_argument("--name", required=True)
    p_crop.add_argument("--x", type=int, required=True)
    p_crop.add_argument("--y", type=int, required=True)
    p_crop.add_argument("--w", type=int, required=True)
    p_crop.add_argument("--h", type=int, required=True)
    p_crop.add_argument("--padding", type=int, default=8)

    sub.add_parser("batch", help="Export all entries in crops.json")
    sub.add_parser("auto", help="Auto-detect regions and export to extracted/")

    args = parser.parse_args()
    if args.cmd == "render":
        render_full()
    elif args.cmd == "crop":
        crop_region(args.name, args.x, args.y, args.w, args.h, args.padding)
    elif args.cmd == "batch":
        batch_from_json()
    elif args.cmd == "auto":
        auto_extract()


if __name__ == "__main__":
    main()
