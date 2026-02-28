# 🔧 Troubleshooting: CSS Not Updating

**ปัญหา:** CSS แก้ไขแล้วแต่หน้าเว็บยังไม่เปลี่ยน  
**สาเหตุ:** Cache issues  
**วิธีแก้:** ตามขั้นตอนด้านล่าง

---

## ✅ วิธีแก้ไข (ทำตามลำดับ)

### 1. Hard Refresh Browser 🔄
```
Windows: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

**หรือ:**
```
Windows: Ctrl + F5
Mac: Cmd + Shift + Delete (Clear cache)
```

---

### 2. Clear Browser Cache 🗑️

#### Chrome
1. กด `F12` เปิด DevTools
2. คลิกขวาที่ปุ่ม Refresh
3. เลือก "Empty Cache and Hard Reload"

#### Firefox
1. กด `Ctrl + Shift + Delete`
2. เลือก "Cached Web Content"
3. กด "Clear Now"

---

### 3. Restart Development Server 🔄

```bash
# Stop server (Ctrl + C)

# Clear cache and restart
npm run dev

# หรือ
npm start
```

---

### 4. Clear npm Cache 🗑️

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules
npm install

# Restart
npm run dev
```

---

### 5. Clear Build Cache 🗑️

```bash
# Delete build/dist folder
rm -rf dist
rm -rf build
rm -rf .next  # if using Next.js

# Rebuild
npm run build
npm run dev
```

---

### 6. Check CSS File 📄

**Verify the CSS is correct:**

```css
/* VillageBoundariesPage.css - Line 36-42 */
.page-header h1 {
  margin: 0 0 0.75rem 0;
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;  /* ✅ Should be white */
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
```

---

### 7. Check Browser DevTools 🔍

1. กด `F12` เปิด DevTools
2. ไปที่ tab "Elements"
3. เลือก `<h1>` element
4. ดูที่ "Styles" panel
5. ตรวจสอบว่า CSS ไหนถูก apply

**ควรเห็น:**
```css
.page-header h1 {
  color: #ffffff;  /* ✅ */
}
```

**ถ้าเห็น (ผิด):**
```css
.page-header h1 {
  background: linear-gradient(...);  /* ❌ */
  -webkit-text-fill-color: transparent;  /* ❌ */
}
```

---

### 8. Force CSS Reload 🔄

**Add timestamp to CSS import:**

```tsx
// In your component
import './VillageBoundariesPage.css?v=' + Date.now();
```

**Or add to HTML:**
```html
<link rel="stylesheet" href="style.css?v=1.0.1">
```

---

### 9. Disable Browser Extensions 🔌

Some extensions cache CSS:
- AdBlock
- Dark Reader
- CSS Injectors

**Try:**
1. Open Incognito/Private mode
2. Test if CSS works there

---

### 10. Check CSS Specificity ⚖️

**If still not working, add `!important`:**

```css
.page-header h1 {
  color: #ffffff !important;
  background: none !important;
  -webkit-text-fill-color: #ffffff !important;
}
```

---

## 🎯 Quick Fix Commands

### Full Reset
```bash
# Stop server
Ctrl + C

# Clear everything
rm -rf node_modules
rm -rf dist
rm -rf build
npm cache clean --force

# Reinstall and restart
npm install
npm run dev

# In browser
Ctrl + Shift + R (Hard refresh)
```

---

## 🔍 Debugging Checklist

### Check File
- [ ] CSS file saved
- [ ] No syntax errors
- [ ] Correct file path
- [ ] Correct class name

### Check Browser
- [ ] Hard refresh (Ctrl + Shift + R)
- [ ] Cache cleared
- [ ] DevTools shows correct CSS
- [ ] No extension conflicts

### Check Server
- [ ] Server restarted
- [ ] No build errors
- [ ] CSS file included
- [ ] Hot reload working

### Check Code
- [ ] CSS imported correctly
- [ ] Class name matches
- [ ] No typos
- [ ] Correct specificity

---

## 🎨 Expected Result

### Should See
```
🌐 กำหนดขอบเขตหมู่บ้าน
(Pure white text on blue gradient background)
```

### CSS Applied
```css
.page-header {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.page-header h1 {
  color: #ffffff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
```

---

## 🚨 If Still Not Working

### Last Resort
1. **Check if CSS file is loaded:**
   - Open DevTools → Network tab
   - Refresh page
   - Look for `.css` file
   - Check if it loads (200 status)

2. **Check CSS content:**
   - Click on CSS file in Network tab
   - Verify content is correct
   - Check if changes are there

3. **Create new CSS file:**
   ```bash
   # Rename old file
   mv VillageBoundariesPage.css VillageBoundariesPage.old.css
   
   # Create new file
   touch VillageBoundariesPage.css
   
   # Copy content
   cat VillageBoundariesPage.old.css > VillageBoundariesPage.css
   ```

---

## ✅ สรุป

**ปัญหา:** CSS ไม่อัปเดต  
**สาเหตุ:** Cache  
**วิธีแก้:**
1. ✅ Hard refresh (Ctrl + Shift + R)
2. ✅ Clear cache
3. ✅ Restart server
4. ✅ Check DevTools

**Most Common Fix:**
```bash
# Stop server
Ctrl + C

# Restart
npm run dev

# In browser
Ctrl + Shift + R
```

---

**หมายเหตุ:** ถ้าทำทุกอย่างแล้วยังไม่ได้ ให้ส่งภาพหน้าจอ DevTools (Elements tab + Styles panel) มาดู
