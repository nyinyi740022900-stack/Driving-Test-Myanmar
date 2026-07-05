#!/usr/bin/env python3
"""Regenerate favicons and app icons from logo-icon-source.png.

White padding around the rounded squircle shows as a broken tab icon on dark
mobile browsers. This script fills outer pixels with brand green so only the
book/road mark stays white.
"""

from __future__ import annotations

import base64
from io import BytesIO
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'public/brand/logo-icon-source.png'
GREEN = (62, 127, 84)


def render_icon(size: int) -> Image.Image:
    src = Image.open(SRC).convert('RGBA')
    src = src.resize((size, size), Image.Resampling.LANCZOS)
    w, h = src.size
    out = Image.new('RGB', (w, h), GREEN)
    cx, cy = w / 2, h / 2

    for y in range(h):
        for x in range(w):
            r, g, b, _ = src.getpixel((x, y))
            dx = (x - cx) / (w / 2)
            dy = (y - cy) / (h / 2)
            dist = (dx * dx + dy * dy) ** 0.5

            if g > r + 15 and g > 80:
                out.putpixel((x, y), GREEN)
            elif r > 200 and g > 200 and b > 200:
                out.putpixel((x, y), (r, g, b) if dist < 0.52 else GREEN)
            else:
                out.putpixel((x, y), GREEN)

    return out


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
