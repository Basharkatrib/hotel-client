# كيفية التحقق من حل Merge Conflicts ✅

## طريقة 1: استخدام Git Status (الأسهل والأسرع) 🔍

```bash
git status
```

### ماذا تبحث عنه:

#### ✅ **إذا تم حل جميع Conflicts:**
```
On branch your-branch
All conflicts fixed but you are still merging.
  (use "git commit" to conclude merge)
```

#### ❌ **إذا لا يزال هناك Conflicts:**
```
On branch your-branch
You have unmerged paths.
  (fix conflicts and run "git add/rm <file>")
  (use "git commit" to conclude merge)

Unmerged paths:
  (use "git add <file>..." to mark as resolved)
        both modified:   src/pages/Home/index.js
        both modified:   src/components/Button.jsx
```

---

## طريقة 2: البحث عن Conflict Markers في الكود 🔎

### استخدام VS Code:

1. **افتح البحث (Ctrl+Shift+F أو Cmd+Shift+F)**
2. **ابحث عن:**
   ```
   <<<<<<< HEAD
   ```
3. **إذا لم تجد نتائج = ✅ تم حل جميع Conflicts**

### استخدام Terminal (PowerShell/CMD):

```bash
# في PowerShell
Select-String -Path "src\**\*.js","src\**\*.jsx" -Pattern "<<<<<<< HEAD|=======|>>>>>>> origin" -Recurse

# أو في CMD/Bash
grep -r "<<<<<<< HEAD\|=======\|>>>>>>> origin" src/
```

#### ✅ **إذا لم تظهر أي نتائج = تم حل جميع Conflicts**

#### ❌ **إذا ظهرت نتائج، سترى شيئاً مثل:**
```
src/pages/Home/index.js:15:<<<<<<< HEAD
src/components/Button.jsx:23:=======
src/components/Button.jsx:25:>>>>>>> origin/j-branch
```

---

## طريقة 3: استخدام Git Diff 🔄

```bash
git diff --check
```

هذا الأمر يبحث عن conflict markers وعلامات مشاكل أخرى.

#### ✅ **إذا كان الناتج فارغاً = لا توجد مشاكل**

#### ❌ **إذا ظهرت تحذيرات:**
```
src/pages/Home/index.js:15: leftover conflict marker
src/pages/Home/index.js:16: leftover conflict marker
```

---

## طريقة 4: البحث البرمجي في المشروع 🔧

### سكريبت PowerShell للتحقق:

أنشئ ملف `check-conflicts.ps1`:

```powershell
# check-conflicts.ps1
Write-Host "Checking for merge conflict markers..." -ForegroundColor Cyan

$conflicts = Get-ChildItem -Path "src" -Recurse -Include *.js,*.jsx,*.ts,*.tsx,*.json | 
    Select-String -Pattern "<<<<<<< HEAD|=======|>>>>>>> origin" |
    Select-Object -Unique Path, LineNumber, Line

if ($conflicts) {
    Write-Host "`n❌ Found conflicts in the following files:" -ForegroundColor Red
    $conflicts | ForEach-Object {
        Write-Host "  - $($_.Path):$($_.LineNumber)" -ForegroundColor Yellow
        Write-Host "    $($_.Line.Trim())" -ForegroundColor Gray
    }
    exit 1
} else {
    Write-Host "`n✅ No conflict markers found! All conflicts are resolved." -ForegroundColor Green
    exit 0
}
```

### استخدم السكريبت:

```powershell
.\check-conflicts.ps1
```

---

## طريقة 5: التحقق من أن الكود يعمل بدون أخطاء Syntax 🚀

### في VS Code:

1. **افتح Terminal في VS Code**
2. **شغل:**
   ```bash
   npm run lint
   # أو
   npm run build
   ```

إذا كان هناك conflict markers، ستحصل على أخطاء مثل:
```
SyntaxError: Unexpected token '<<'
```

---

## طريقة 6: استخدام Git GUI (اختياري) 🖥️

```bash
git mergetool
```

هذا يفتح أداة merge visual تظهر لك جميع الملفات التي بها conflicts.

---

## خطوات التحقق السريع (Checklist) ✅

قبل عمل `git commit`، تأكد من:

- [ ] `git status` لا يظهر "Unmerged paths"
- [ ] البحث عن `<<<<<<< HEAD` لا يعطي نتائج
- [ ] البحث عن `=======` لا يعطي نتائج (في سياق conflicts)
- [ ] البحث عن `>>>>>>> origin` لا يعطي نتائج
- [ ] `npm run lint` أو `npm run build` يعمل بدون أخطاء syntax
- [ ] جميع الملفات المفتوحة في VS Code لا تحتوي على conflict markers

---

## مثال عملي: التحقق قبل Commit 📝

```bash
# 1. تحقق من git status
git status

# 2. إذا كان هناك "All conflicts fixed" أو "nothing to commit"
#    تحقق يدوياً من الملفات المشتبهة:

# 3. ابحث عن conflict markers
grep -r "<<<<<<< HEAD" src/  # في Git Bash أو Linux/Mac
# أو في PowerShell:
Select-String -Path "src" -Pattern "<<<<<<< HEAD" -Recurse

# 4. إذا لم تجد أي شيء، جرب build
npm run build

# 5. إذا نجح build بدون أخطاء syntax، فأنت جاهز للـ commit
git add .
git commit -m "Resolve merge conflicts"
```

---

## علامات تدل على أن Conflict لم يُحل بشكل صحيح ❌

1. **في VS Code:** ترى علامات حمراء أو تحذيرات على السطور التي تحتوي على:
   - `<<<<<<< HEAD`
   - `=======`
   - `>>>>>>> origin/j-branch`

2. **في Terminal:** عند تشغيل الكود، تحصل على:
   ```
   SyntaxError: Unexpected token '<<'
   ```

3. **في git status:** لا يزال يظهر:
   ```
   Unmerged paths:
         both modified:   filename.js
   ```

---

## نصائح إضافية 💡

1. **استخدم VS Code Git Features:**
   - VS Code يحدد الملفات التي بها conflicts بشكل واضح
   - في Source Control panel، الملفات التي بها conflicts تظهر بحرف `U` أو `C`

2. **قبل Commit مباشرة، شغل:**
   ```bash
   git diff HEAD
   ```
   للتحقق من التغييرات التي سترفعها

3. **استخدم Pre-commit Hook (اختياري):**
   أنشئ `.git/hooks/pre-commit`:
   ```bash
   #!/bin/bash
   if grep -r "<<<<<<< HEAD" src/; then
       echo "❌ Conflict markers found! Cannot commit."
       exit 1
   fi
   ```

---

## ملخص سريع 🎯

**أفضل طريقة سريعة:**
```bash
git status
# إذا ظهر "All conflicts fixed" ✅
# وإذا ظهر "Unmerged paths" ❌
```

**أفضل طريقة للتأكد 100%:**
```bash
# ابحث عن جميع conflict markers
grep -r "<<<<<<< HEAD\|=======\|>>>>>>> origin" src/
# إذا لم تجد نتائج = ✅ تم الحل
```

---

**ملاحظة:** بعد حل جميع conflicts، **لا تنسى** عمل:
```bash
git add .
git commit -m "Resolve merge conflicts"
```
