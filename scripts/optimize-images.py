"""Optimize all website images from originals (requires Pillow and pillow-heif).

Use --stories to regenerate only the submitted stories and their images.
"""

import base64
import csv
import json
import sys
import xml.etree.ElementTree as ET
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageOps, ImageSequence

ASSETS = Path(__file__).resolve().parents[1] / "src" / "assets"
OUTPUT = ASSETS / "optimized"


def convert(source, max_width, quality=82, suffix="", lossless=False):
    target = OUTPUT / source.relative_to(ASSETS).with_suffix(".webp")
    target = target.with_stem(target.stem + suffix)
    target.parent.mkdir(parents=True, exist_ok=True)
    image_source = source
    if source.suffix == ".svg":
        # The university logo SVG wraps a PNG; decode that original raster.
        embedded = ET.parse(source).find(".//{http://www.w3.org/2000/svg}image")
        data = embedded.attrib["{http://www.w3.org/1999/xlink}href"]
        image_source = BytesIO(base64.b64decode(data.split(",", 1)[1]))
    with Image.open(image_source) as original:
        frames, durations = [], []
        for frame in ImageSequence.Iterator(original):
            image = ImageOps.exif_transpose(frame).convert("RGBA")
            if image.width > max_width:
                image = image.resize(
                    (max_width, max(1, round(image.height * max_width / image.width))),
                    Image.Resampling.LANCZOS,
                )
            frames.append(image)
            durations.append(frame.info.get("duration", 0))
        options = {"quality": quality, "method": 6, "lossless": lossless}
        if original.info.get("icc_profile"):
            options["icc_profile"] = original.info["icc_profile"]
        if len(frames) > 1:
            options.update(
                save_all=True,
                append_images=frames[1:],
                duration=durations,
                loop=original.info.get("loop", 0),
            )
        frames[0].save(target, **options)

        # Decode every generated frame; catch broken outputs and animation loss.
        with Image.open(target) as result:
            assert result.size == frames[0].size, target
            assert result.n_frames == len(frames), target
            result_durations = []
            for frame in ImageSequence.Iterator(result):
                frame.load()
                result_durations.append(frame.info.get("duration", 0))
                expected_alpha = frames[frame.tell()].getchannel("A")
                assert frame.convert("RGBA").getchannel("A").tobytes() == expected_alpha.tobytes(), target
            if len(frames) > 1:
                assert result_durations == durations, target
                assert result.info["loop"] == original.info.get("loop", 0), target
    print(f"{target.relative_to(OUTPUT)}: {source.stat().st_size:,} -> {target.stat().st_size:,} bytes")
    return target


def main():
    sources = [
        (ASSETS / "desktop-backgorund.png", 2560, 78),
        (ASSETS / "poster-background.png", 786, 78),
        (ASSETS / "poster.png", 1200, 85),
        (ASSETS / "wiscom.png", 768, 88),
        (ASSETS / "building-entrance.gif", 640, 75),
        (ASSETS / "bubble.png", 102, 90),
        (ASSETS / "github-logo.png", 36, 90),
        (ASSETS / "link-icon.png", 40, 90),
        (ASSETS / "duksung_logo.svg", 450, 90),
    ]
    sources.extend(
        (source, 1200 if source.stem.endswith("_project") else 480,
         84 if source.stem.endswith("_project") else 82)
        for source in sorted((ASSETS / "team").iterdir())
        if source.suffix.lower() in {".png", ".jpg", ".jpeg"}
    )
    outputs = []
    for source, width, quality in sources:
        outputs.append(convert(source, width, quality, lossless=source.stem in {
            "bubble", "github-logo", "link-icon", "duksung_logo",
        }))
        if source.stem.endswith("_project"):
            outputs.append(convert(source, 480, 78, suffix="_thumb"))
    with Image.open(ASSETS / "bubble.png") as favicon:
        favicon.thumbnail((64, 64), Image.Resampling.LANCZOS)
        favicon.save(OUTPUT / "favicon.png", optimize=True)
        with Image.open(OUTPUT / "favicon.png") as result:
            result.load()
            assert result.size == favicon.size
            assert result.tobytes() == favicon.tobytes()
    outputs.append(OUTPUT / "favicon.png")
    outputs.extend(import_stories())
    before = sum(source.stat().st_size for source, _, _ in sources)
    before += sum(source.stat().st_size for source in (ASSETS / "behind").iterdir())
    after = sum(target.stat().st_size for target in set(outputs))
    print(f"Total (including thumbnails): {before:,} -> {after:,} bytes ({1 - after / before:.1%} smaller)")


def import_stories():
    from pillow_heif import register_heif_opener

    register_heif_opener()
    sources = list((ASSETS / "behind").iterdir())
    stories = []
    outputs = []
    used_sources = set()
    identities = set()
    with (ASSETS / "behind.csv").open(encoding="utf-8-sig", newline="") as source:
        for name, team, _student_id, introduction, content in csv.reader(source):
            identity = (name, team.casefold().replace(":", ""))
            assert identity not in identities, f"Duplicate story: {name} ({team})"
            identities.add(identity)
            qualified = f"{name}({team})".casefold()
            matches = [image for image in sources if image.stem.casefold() == qualified]
            if not matches:
                matches = [image for image in sources if image.stem == name]
            assert len(matches) == 1, f"Expected one image: {name} ({team})"
            image = matches[0]
            assert image not in used_sources, f"Image reused: {image.name}"
            used_sources.add(image)
            target = convert(image, 960, 82)
            with Image.open(target) as result:
                width, height = result.size
            thumbnail = convert(image, 480, 78, suffix="_thumb") if width > 480 else target
            outputs.extend([target, thumbnail])
            stories.append({
                "name": name,
                "teamName": team,
                "introduction": introduction,
                "content": content.replace("\r\n", "\n"),
                "image": target.name,
                "thumbnail": thumbnail.name,
                "width": width,
                "height": height,
            })
    assert used_sources == set(sources), "Some behind images have no story"
    destination = ASSETS.parent / "pages/never-ending-story/data/submissions.json"
    destination.write_text(json.dumps(stories, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Imported {len(stories)} stories and images.")
    return outputs


if __name__ == "__main__":
    if "--stories" in sys.argv:
        import_stories()
    else:
        main()
