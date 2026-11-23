import re
import urllib.request

url = "https://drfernandotexeira.com.uy/"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"})
try:
    data = urllib.request.urlopen(req, timeout=30).read().decode("utf-8", "replace")
except Exception as e:
    print("ERR", e)
    raise SystemExit(1)

open(r"c:\Users\senis\AppData\Local\Temp\texeira.html", "w", encoding="utf-8").write(data)

patterns = [
    r'(?:src|data-src|content)=["\']([^"\']+\.(?:jpg|jpeg|png|webp|gif)[^"\']*)',
    r'url\(["\']?([^)"\']+\.(?:jpg|jpeg|png|webp))["\']?\)',
]
found = []
for p in patterns:
    found.extend(re.findall(p, data, flags=re.I))

base = "https://drfernandotexeira.com.uy"
uniq = []
for u in found:
    if u.startswith("//"):
        u = "https:" + u
    elif u.startswith("/"):
        u = base + u
    elif not u.startswith("http"):
        u = base.rstrip("/") + "/" + u.lstrip("./")
    if u not in uniq:
        uniq.append(u)

for u in uniq:
    print(u)
print("COUNT", len(uniq))
