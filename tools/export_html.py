"""Bundle the nursery storefront, photos and price downloads into one HTML file."""
import argparse
import base64
import json
import mimetypes
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def js_data(value):
    return json.dumps(value, ensure_ascii=False, separators=(",", ":")).replace("<", "\\u003c")


def bundle(destination):
    profile_source = (ROOT / "plant-profiles.js").read_text()
    used_photos = set(re.findall(r'"file":"(assets/plants/[^"]+)"', profile_source))
    files = {}
    for path in sorted((ROOT / "assets").rglob("*")):
        if not path.is_file():
            continue
        name = path.relative_to(ROOT).as_posix()
        if name.startswith("assets/plants/") and name not in used_photos:
            continue
        mime = mimetypes.guess_type(name)[0] or "application/octet-stream"
        files[name] = [mime, base64.b64encode(path.read_bytes()).decode("ascii")]

    css = (ROOT / "style.css").read_text() + "\n" + (ROOT / "botanical.css").read_text()
    bootstrap = """
window.PORTABLE = true;
const files = {};
for (const [path, [type, encoded]] of Object.entries(ASSET_DATA)) {
    const bytes = Uint8Array.from(atob(encoded), c => c.charCodeAt(0));
    files[path] = URL.createObjectURL(new Blob([bytes], {type}));
}
const stylesheet = document.createElement('style');
stylesheet.textContent = STYLE_DATA.replace(/assets\\/[\\w./-]+/g, path => files[path] || path);
document.head.append(stylesheet);
""".replace("ASSET_DATA", js_data(files)).replace("STYLE_DATA", js_data(css))

    pine = (ROOT / "pine-growth.js").read_text()
    pine = re.sub(r"'(assets/[^']+)'", r"files['\1']", pine)
    app = (ROOT / "app.js").read_text()
    app = app.replace("i=>'assets/nursery/'+String(i).padStart(2,'0')+'.webp'",
                      "i=>files['assets/nursery/'+String(i).padStart(2,'0')+'.webp']")
    app = app.replace(":`assets/${n}.jpg`", ":files[`assets/${n}.jpg`]")
    for name in ("hvoynyisad-logo.webp", "pine-afternoon.webp"):
        app = app.replace('"assets/' + name + '"', '"${files[\'assets/' + name + '\']}"')
    def download(match):
        path = match[1]
        return 'href="\'+files[\'' + path + '\']+\'" download="' + Path(path).name + '"'
    app = re.sub(r'href="(assets/price-2025\.(?:csv|xlsx))" download', download, app)
    profile_source += "\nfor (const photo of Object.values(plantPhotos)) photo.file = files[photo.file];"
    head = (ROOT / "index.html").read_text().split("<script", 1)[0]
    head = re.sub(r"<link[^>]+>", "", head)
    scripts = [bootstrap, pine, (ROOT / "nursery-data.js").read_text(), profile_source, app]
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(head + "".join("<script>" + s + "</script>" for s in scripts) + "</body></html>")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("output", type=Path, help="Destination outside the site's source files")
    output = parser.parse_args().output.resolve()
    if output.parent == ROOT and output.suffix == ".html":
        parser.error("Choose an export directory so that the live site's page templates stay available.")
    bundle(output)
