# Firebase Setup Guide for Photo Slideshow

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add Project"** or **"Create a project"**
3. Enter project name: `birthday-website` (or any name)
4. Disable Google Analytics (optional) or enable it
5. Click **"Create Project"**

## Step 2: Enable Firebase Storage

1. In your Firebase project, click **"Storage"** in the left menu
2. Click **"Get Started"**
3. Choose **"Start in test mode"** (for now - you can secure it later)
4. Select a location for your storage bucket
5. Click **"Done"**

## Step 3: Enable Firestore Database

1. Click **"Firestore Database"** in the left menu
2. Click **"Create Database"**
3. Choose **"Start in test mode"** (for now)
4. Select a location (same as Storage if possible)
5. Click **"Enable"**

## Step 4: Get Your Firebase Config

1. Click the **gear icon** ⚙️ next to "Project Overview"
2. Click **"Project Settings"**
3. Scroll down to **"Your apps"** section
4. Click the **Web icon** `</>`
5. Register your app with nickname: `birthday-website`
6. Copy the `firebaseConfig` object

## Step 5: Update Your Firebase Config

1. Open `src/firebase.js` in your project
2. Replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
}
```

## Step 6: Set Up Firestore Security Rules (Important!)

1. Go to **Firestore Database** → **Rules** tab
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /photos/{document=**} {
      allow read: if true;  // Anyone can read photos
      allow create: if true; // Anyone can upload photos
      allow update, delete: if false; // Only you can modify/delete (optional)
    }
  }
}
```

3. Click **"Publish"**

## Step 7: Set Up Storage Security Rules

1. Go to **Storage** → **Rules** tab
2. Replace the rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /photos/{allPaths=**} {
      allow read: if true;  // Anyone can view photos
      allow write: if request.resource.size < 5 * 1024 * 1024  // Max 5MB
                   && request.resource.contentType.matches('image/.*'); // Only images
    }
  }
}
```

3. Click **"Publish"**

## Step 8: Test Your Setup

1. Run `npm run dev`
2. Enter the password: `DEST1NY`
3. Try uploading a photo using the "Add Photo" button
4. Check Firebase Console → Storage to see if the photo uploaded
5. Check Firebase Console → Firestore to see if the metadata was saved

## Troubleshooting

### Photos not showing?
- Check browser console for errors
- Verify Firebase config is correct
- Check Firestore rules allow read access

### Upload failing?
- Check Storage rules allow write access
- Verify file size is under 5MB
- Check browser console for error messages

### Real-time updates not working?
- Verify Firestore rules allow read access
- Check internet connection
- Look for errors in browser console

## Security Notes

⚠️ **For Production:**
- Consider adding authentication
- Limit uploads per user/IP
- Add moderation for uploaded photos
- Set up proper security rules

## Need Help?

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)
- [Storage Rules Guide](https://firebase.google.com/docs/storage/security)
