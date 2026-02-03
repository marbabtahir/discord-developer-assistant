# How to Get a GitHub Personal Access Token (GITHUB_TOKEN)

The `/github-analyze` and `/project-health` commands use the **GitHub REST API**. Without a token you get **60 requests per hour per IP**; with a token you get **5,000 requests per hour**, which is recommended for real use.

---

## Steps to Create a Token

1. **Log in to GitHub** and go to **Settings** (click your profile picture → **Settings**).

2. **Open Developer settings**  
   In the left sidebar, scroll down and click **Developer settings**.

3. **Personal access tokens**  
   Click **Personal access tokens** → **Tokens (classic)**.  
   (Or use **Fine-grained tokens** if you prefer; for classic, continue below.)

4. **Generate new token**  
   Click **Generate new token** → **Generate new token (classic)**.

5. **Configure the token**
   - **Note**: e.g. `Developer Assistant Discord Bot`
   - **Expiration**: 90 days, 1 year, or No expiration (your choice)
   - **Scopes**: Check only what the bot needs:
     - **`public_repo`** – read public repositories (repo metadata, languages, contents, commits, contributors).  
       This is enough for `/github-analyze` and `/project-health` on **public** repos only.

6. **Generate**  
   Click **Generate token** at the bottom.

7. **Copy the token**  
   Copy the token **once** (e.g. `ghp_xxxxxxxxxxxx`). GitHub will not show it again.

8. **Add to your project**  
   In your project root, open `.env` and add:
   ```env
   GITHUB_TOKEN=ghp_your_token_here
   ```
   Leave it empty or omit the line if you want to run without a token (60 req/hour).

---

## Direct link

- **Classic token**: https://github.com/settings/tokens/new  
- **Fine-grained token**: https://github.com/settings/tokens?type=beta  

For classic: enable **public_repo** (or **repo** if you ever need private repos). For fine-grained, create a token with **Read** access to **Contents** and **Metadata** for public repos.

---

## Security

- **Never commit `.env` or the token** to git (`.env` is in `.gitignore`).
- If the token leaks, revoke it at https://github.com/settings/tokens and create a new one.
- Use a short expiration in production and rotate the token periodically if you prefer.
