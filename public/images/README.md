# Add your real photo here

Drop your founder portrait in this folder named exactly one of:

```
founder.jpg      <- recommended
founder.jpeg
founder.png
founder.webp
```

It will **automatically appear** on the website Home hero and the About page —
no code changes and no admin action required. Just commit the file and redeploy.

## Recommended specs
- **Aspect ratio:** 4:5 portrait (e.g. 1080 x 1350)
- **Format:** JPG for photos (smallest file size)
- **Size:** under 8MB

## Precedence
1. A photo uploaded via **Admin Console > Overview > "Add Your Portrait Photo"**
   (or **Site Settings & CMS > Upload Your Own Photo & Company Logo**) always wins.
2. If nothing has been uploaded there, this `founder.*` file is used.
3. If neither exists, a branded placeholder card is shown.

> Note: the admin upload is stored in the database and survives redeploys.
> This file-based option is checked at runtime, so it also works either way —
> but uploading via the Admin Console is the simplest path.
