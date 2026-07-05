#!/usr/bin/env python3
"""Regenerate favicons and app icons from public/brand/logo-icon-source.png."""

from __future__ import annotations

import base64
from io import BytesIO
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'public/brand/logo-icon-source.png'
CROP_PAD = 2


def crop_logo(source: Image.Image) -> Image.Image:
    rgb = source.convert('RGB')
    w, h = rgb.size
    min_x, min_y = w, h
    max_x, max_y = 0, 0

    for y in range(h):
        for x in range(w):
            r, g, b = rgb.getpixel((x, y))
            if r > 250 and g > 250 and b > 250:
                continue
            min_x = min(min_x, x)
            min_y = min(min_y, y)
            max_x = max(max_x, x)
            max_y = max(max_y, y)

    left = max(0, min_x - CROP_PAD)
    top = max(0, min_y - CROP_PAD)
    right = min(w, max_x + CROP_PAD + 1)
    bottom = min(h, max_y + CROP_PAD + 1)
    return rgb.crop((left, top, right, bottom))


def render_icon(size: int) -> Image.Image:
    source = Image.open(SRC)
    cropped = crop_logo(source)
    return cropped.resize((size, size), Image.Resampling.LANCZOS)


def write_png(path: Path, size: int) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    render_icon(size).save(path, optimize=True)
    print(f'wrote {path.relative_to(ROOT)} ({size}x{size})')


def write_ico(path: Path, sizes: list[int]) -> None:
    images = [render_icon(size) for size in sizes]
    images[0].save(
        path,
        format='ICO',
        sizes=[(s, s) for s in sizes],
        append_images=images[1:],
    )
    print(f'wrote {path.relative_to(ROOT)} ({", ".join(str(s) for s in sizes)}px)')


def write_svg(path: Path, size: int = 32) -> None:
    buf = BytesIO()
    render_icon(size).save(buf, format='PNG')
    encoded = base64.b64encode(buf.getvalue()).decode('ascii')
    svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">'
        f'<image width="32" height="32" href="data:image/png;base64,{encoded}"/>'
        '</svg>'
    )
    path.write_text(svg, encoding='utf-8')
    print(f'wrote {path.relative_to(ROOT)} (svg)')


def main() -> None:
    if not SRC.is_file():
        raise SystemExit(f'Missing source image: {SRC}')

    write_svg(ROOT / 'public/favicon.svg')
    write_png(ROOT / 'public/icons/favicon-32x32.png', 32)
    write_png(ROOT / 'public/icons/favicon-48x48.png', 48)
    write_png(ROOT / 'public/icons/favicon-96x96.png', 96)
    write_png(ROOT / 'public/icons/icon-192.png', 192)
    write_png(ROOT / 'public/icons/icon-512.png', 512)
    write_png(ROOT / 'app/icon.png', 192)
    write_png(ROOT / 'app/apple-icon.png', 180)
    write_png(ROOT / 'public/apple-icon.png', 180)
    write_png(ROOT / 'public/brand/logo-icon.png', 192)
    write_png(ROOT / 'public/brand/logo-icon-square.png', 512)
    write_ico(ROOT / 'public/favicon.ico', [16, 32, 48])


if __name__ == '__main__':
    main()
