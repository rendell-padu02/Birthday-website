# Service account setup (for convert-to-webp)

The script needs a **service account** key file to read/write Google Drive. Follow these steps once.

## 1. Create the service account

1. Open **[Google Cloud Console](https://console.cloud.google.com/)** and select your project (the same one where you have the Drive API / API key).
2. Go to **APIs & Services** → **Credentials**.
3. Click **+ Create credentials** → **Service account**.
4. **Service account name:** e.g. `Drive WebP Converter` → **Create and continue** → **Done**.

## 2. Download the JSON key

1. On the Credentials page, under **Service accounts**, click the service account you just created.
2. Open the **Keys** tab → **Add key** → **Create new key**.
3. Choose **JSON** → **Create**. A JSON file will download.

## 3. Place the key file

- **Option A:** Rename the downloaded file to `service-account.json` and move it into your project’s **`scripts`** folder:
  ```
  Website/
    scripts/
      service-account.json   ← put it here
      convert-to-webp.js
  ```
- **Option B:** Put the file anywhere and add to your **`.env`**:
  ```
  GOOGLE_APPLICATION_CREDENTIALS=C:\path\to\your\downloaded-key.json
  ```

## 4. Share your Drive folders with the service account

1. In the service account details, copy the **email** (e.g. `drive-webp@your-project.iam.gserviceaccount.com`).
2. In **Google Drive**, right‑click **each** of these folders → **Share**:
   - The folder where guests upload (source).
   - The folder where you want WebP images (destination).
3. Add the service account email and give it **Editor** access. Click **Send** (you can uncheck “Notify” if you like).

## 5. Run the script

```bash
npm run convert-to-webp
```

Then upload the contents of **webp-output/** to your WebP folder in Drive. If you see permission errors, confirm the upload folder is shared with the service account as **Editor**.
