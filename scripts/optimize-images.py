"""Generate committed WebP assets without changing originals (requires Pillow)."""

from pathlib import Path

from PIL import Image, ImageOps, ImageSequence

ASSETS = Path(__file__).resolve().parents[1] / "src" / "assets"
OUTPUT = ASSETS / "optimized"


def convert(source, max_width, quality=85, suffix=""):
    target = OUTPUT / source.relative_to(ASSETS).with_suffix(".webp")
    target = target.with_stem(target.stem + suffix)
    target.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as original:
        frames, durations = [], []
        for frame in ImageSequence.Iterator(original):
            image = ImageOps.exif_transpose(frame).convert("RGBA")
            if image.width > max_width:
                image = image.resize(
                    (max_width, round(image.height * max_width / image.width)),
                    Image.Resampling.LANCZOS,
                )
            frames.append(image)
            durations.append(frame.info.get("duration", 0))
        options = {"quality": quality, "method": 6}
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
            if len(frames) > 1:
                assert result_durations == durations, target
                assert result.info["loop"] == original.info.get("loop", 0), target
    assert target.stat().st_size < source.stat().st_size, target
    print(f"{target.relative_to(OUTPUT)}: {source.stat().st_size:,} -> {target.stat().st_size:,} bytes")
    return target


def main():
    sources = [
        (ASSETS / "desktop-backgorund.png", 2560, 85),
        (ASSETS / "poster-background.png", 786, 85),
        (ASSETS / "poster.png", 1442, 90),
        (ASSETS / "wiscom.png", 768, 90),
        (ASSETS / "building-entrance.gif", 640, 85),
    ]
    sources.extend(
        (source, 1200 if source.stem.endswith("_project") else 480, 88)
        for source in sorted((ASSETS / "team").iterdir())
        if source.suffix.lower() in {".png", ".jpg", ".jpeg"}
    )
    outputs = []
    for source, width, quality in sources:
        outputs.append(convert(source, width, quality))
        if source.stem.endswith("_project"):
            outputs.append(convert(source, 480, suffix="_thumb"))
    before = sum(source.stat().st_size for source, _, _ in sources)
    after = sum(target.stat().st_size for target in outputs)
    print(f"Total (including thumbnails): {before:,} -> {after:,} bytes ({1 - after / before:.1%} smaller)")


if __name__ == "__main__":
    main()
