import json, base64, urllib.request, sys

key = open('.env', encoding='utf-8').read().split('VITE_GEMINI_API_KEY=', 1)[1].strip().splitlines()[0]
path = sys.argv[1] if len(sys.argv) > 1 else r'c:\Users\senis\Downloads\WhatsApp Ptt 2026-11-23 at 1.17.07 PM.ogg'
audio = open(path, 'rb').read()
b64 = base64.b64encode(audio).decode('ascii')

# WhatsApp voice notes are usually Opus in Ogg
mime = 'audio/ogg;codecs=opus'
body = {
  'contents': [{
    'parts': [
      {'text': 'Transcribí este audio de WhatsApp en español rioplatense, fiel al contenido hablado. Solo devolvé la transcripción completa, sin comentarios ni comillas.'},
      {'inline_data': {'mime_type': mime, 'data': b64}},
    ]
  }]
}

models = ['gemini-flash-latest', 'gemini-3.8-flash', 'gemini-3.5-flash']
last_err = None
for model in models:
  url = f'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent'
  req = urllib.request.Request(
    url,
    data=json.dumps(body).encode('utf-8'),
    headers={'Content-Type': 'application/json', 'X-goog-api-key': key},
    method='POST',
  )
  try:
    with urllib.request.urlopen(req, timeout=60) as resp:
      data = json.load(resp)
      text = data['candidates'][0]['content']['parts'][0]['text']
      print(text)
      print(f'\n[model={model}]', file=sys.stderr)
      sys.exit(0)
  except Exception as e:
    last_err = e
    if hasattr(e, 'read'):
      err_body = e.read().decode('utf-8', errors='replace')
      print(f'{model} failed: {err_body[:500]}', file=sys.stderr)
    else:
      print(f'{model} failed: {e}', file=sys.stderr)

print('ERROR', last_err)
sys.exit(1)
