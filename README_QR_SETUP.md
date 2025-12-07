QR Scanner Setup and Usage:

1) Install dependencies: run npm install to add jsqr.

2) Place or print QR codes that contain either full AR URLs (e.g. https://your-site/ar-viewer?model=stone_chariot_in_hampi.glb) or short model slugs/filenames (e.g. stone_chariot_in_hampi or stone_chariot_in_hampi.glb).

3) Upload GLB files to public/models/ so ar-viewer can load them.

4) The scanner opens absolute URLs in a new tab (scanner stays open). If the QR contains a slug or filename, the scanner opens /ar-viewer?model=<value or value+.glb> in a new tab.

5) Edit src/config/qr-config.json to add your domain(s) to whitelistDomains if you want to block external redirects.

6) Testing: open https://localhost:3000/qr-scanner on mobile, allow camera permission, point at printed QR, confirm new tab opens with AR viewer.

7) Optional: add logging of scans to Firestore for analytics (ask me and I'll add it).
