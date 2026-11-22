# Google Cloud Project & YouTube Data API Setup Guide

Follow these step-by-step instructions to get your Google OAuth Client ID and Secret for Social-Hub.

---

## Step 1: Create or Select a Google Cloud Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. In the top-left project dropdown, click **New Project**.
3. Name it **Social-Hub** (or any name you prefer) and click **Create**.
4. Make sure your new project is selected in the top bar.

---

## Step 2: Enable the YouTube Data API v3
1. In the search bar at the top, type **YouTube Data API v3** and select it.
2. Click the blue **Enable** button.

---

## Step 3: Configure the OAuth Consent Screen
1. In the left navigation menu, go to **APIs & Services** > **OAuth consent screen**.
2. Select **External** user type and click **Create**.
3. Fill in the **App Information**:
   - **App name**: `Social-Hub`
   - **User support email**: Your email address
   - **Developer contact information**: Your email address
4. Click **Save and Continue**.
5. In the **Scopes** step:
   - Click **Add or Remove Scopes**.
   - Search for and select:
     - `.../auth/youtube.upload` (Upload YouTube videos)
     - `.../auth/youtube.readonly` (View YouTube account details)
     - `.../auth/userinfo.profile` (View profile info)
     - `.../auth/userinfo.email` (View email)
   - Click **Update** and then **Save and Continue**.
6. In the **Test Users** step:
   - Click **+ Add Users**.
   - Add your Google account email (and any other Google accounts with channels you plan to test).
   - *Note: While the app is in "Testing" mode, only users added here can connect channels.*
7. Click **Save and Continue**, then review and click **Back to Dashboard**.

---

## Step 4: Create OAuth 2.0 Client Credentials
1. In the left navigation menu, go to **APIs & Services** > **Credentials**.
2. Click **+ Create Credentials** at the top and select **OAuth client ID**.
3. Set **Application type** to **Web application**.
4. Set **Name** to `Social-Hub Web Client`.
5. Under **Authorized JavaScript origins**, add:
   - `http://localhost:3000`
6. Under **Authorized redirect URIs**, add:
   - `http://localhost:3000/api/auth/youtube/callback`
   - *(When you deploy to production later, you will add your production URL here as well)*.
7. Click **Create**.
8. A modal will pop up with your:
   - **Client ID** (e.g., `123456789-xxxx.apps.googleusercontent.com`)
   - **Client Secret** (e.g., `GOCSPX-xxxx`)
9. Copy these values. You will paste them into your `.env.local` file:
   ```env
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

---

## Step 5: Ready for Social-Hub
You are now ready to connect any YouTube channel you own to Social-Hub!
