// دالة إظهار الإشعارات
function showNotification(message, type = 'info', duration = 5000) {
    const notificationContainer = document.getElementById('notification-container');

    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    // إضافة تأثير ظهور للإشعار
    notification.style.animation = 'fadeInDown 0.5s forwards';

    // إنشاء محتوى الإشعار
    const notificationContent = document.createElement('div');
    notificationContent.className = 'notification-content';

    // إضافة أيقونة حسب نوع الإشعار
    const icon = document.createElement('span');
    icon.className = 'notification-icon';

    switch (type) {
        case 'success':
            icon.innerHTML = '<i class="fas fa-check-circle"></i>';
            break;
        case 'error':
            icon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
            break;
        case 'warning':
            icon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
            break;
        case 'hijab-notification':
            icon.innerHTML = '<i class="fas fa-ban"></i>';
            break;
        case 'awl-notification':
            icon.innerHTML = '<i class="fas fa-balance-scale"></i>';
            break;
        default:
            icon.innerHTML = '<i class="fas fa-info-circle"></i>';
    }

    // إضافة نص الإشعار (يدعم HTML)
    const text = document.createElement('span');
    text.className = 'notification-text';
    text.innerHTML = message; // استخدام innerHTML لدعم وسوم HTML

    // إضافة زر الإغلاق
    const closeBtn = document.createElement('span');
    closeBtn.className = 'notification-close';
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'fadeOutUp 0.5s forwards';
        setTimeout(() => {
            notification.remove();
        }, 500);
    });

    // تجميع عناصر الإشعار
    notificationContent.appendChild(icon);
    notificationContent.appendChild(text);
    notification.appendChild(notificationContent);
    notification.appendChild(closeBtn);

    // عمل تأثير نبض للإشعارات المهمة
    if (type === 'hijab-notification' || type === 'awl-notification') {
        notification.classList.add('pulse-notification');
    }

    // إضافة الإشعار إلى الحاوية
    notificationContainer.appendChild(notification);

    // إخفاء الإشعار بعد مدة محددة (إلا إذا كانت المدة 0 فسيبقى حتى يتم إغلاقه يدوياً)
    if (duration > 0) {
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'fadeOutUp 0.5s forwards';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 500);
            }
        }, duration);
    }

    // تحريك الإشعار للأعلى لضمان الرؤية
    notificationContainer.scrollTop = 0;

    return notification;
}

document.addEventListener('DOMContentLoaded', function() {
    // بداية تشغيل الصفحة
    setupHeirCounters();
    setupGenderEffects();

    // إعداد أحداث النقر والتغيير
    document.getElementById('calculate-inheritance').addEventListener('click', calculateInheritance);

    // استمع للتغييرات في جنس المتوفي
    document.querySelectorAll('input[name="deceased-gender"]').forEach(radio => {
        radio.addEventListener('change', updateHeirsBasedOnGender);
    });

    // إعداد حالة البداية
    updateHeirsBasedOnGender();
});

// إضافة تأثيرات تحسن تفاعل المستخدم مع قسم جنس المتوفي
function setupGenderEffects() {
    const maleOption = document.querySelector('.male-option');
    const femaleOption = document.querySelector('.female-option');
    const maleRadio = document.getElementById('male-deceased');
    const femaleRadio = document.getElementById('female-deceased');

    // تحديث الفئات عند التحميل الأولي
    updateGenderSelectionClasses();

    // إضافة أحداث النقر والتحويم
    maleOption.addEventListener('click', function() {
        maleRadio.checked = true;
        updateGenderSelectionClasses();
        updateHeirsBasedOnGender();
    });

    femaleOption.addEventListener('click', function() {
        femaleRadio.checked = true;
        updateGenderSelectionClasses();
        updateHeirsBasedOnGender();
    });

    // إضافة تأثيرات التحويم
    maleOption.addEventListener('mouseenter', function() {
        if (!maleRadio.checked) {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 8px 15px rgba(33, 150, 243, 0.3)';
        }
    });

    maleOption.addEventListener('mouseleave', function() {
        if (!maleRadio.checked) {
            this.style.transform = '';
            this.style.boxShadow = '';
        }
    });

    femaleOption.addEventListener('mouseenter', function() {
        if (!femaleRadio.checked) {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 8px 15px rgba(233, 30, 99, 0.3)';
        }
    });

    femaleOption.addEventListener('mouseleave', function() {
        if (!femaleRadio.checked) {
            this.style.transform = '';
            this.style.boxShadow = '';
        }
    });
}

// تحديث فئات التصميم عند اختيار الجنس
function updateGenderSelectionClasses() {
    const maleOption = document.querySelector('.male-option');
    const femaleOption = document.querySelector('.female-option');
    const maleRadio = document.getElementById('male-deceased');

    if (maleRadio.checked) {
        maleOption.classList.add('selected-gender');
        femaleOption.classList.remove('selected-gender');
        maleOption.style.borderColor = 'rgba(33, 150, 243, 0.7)';
        maleOption.style.background = 'linear-gradient(135deg, rgba(33, 150, 243, 0.2), rgba(33, 150, 243, 0.1))';
        maleOption.style.boxShadow = '0 5px 15px rgba(33, 150, 243, 0.3)';
        femaleOption.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        femaleOption.style.background = 'rgba(255, 255, 255, 0.08)';
        femaleOption.style.boxShadow = 'none';
    } else {
        femaleOption.classList.add('selected-gender');
        maleOption.classList.remove('selected-gender');
        femaleOption.style.borderColor = 'rgba(233, 30, 99, 0.7)';
        femaleOption.style.background = 'linear-gradient(135deg, rgba(233, 30, 99, 0.2), rgba(233, 30, 99, 0.1))';
        femaleOption.style.boxShadow = '0 5px 15px rgba(233, 30, 99, 0.3)';
        maleOption.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        maleOption.style.background = 'rgba(255, 255, 255, 0.08)';
        maleOption.style.boxShadow = 'none';
    }
}

// تحديث قائمة الورثة بناءً على جنس المتوفي
function updateHeirsBasedOnGender() {
    const isMaleDeceased = document.getElementById('male-deceased').checked;

    // الزوج/الزوجة
    const husbandGroup = document.getElementById('husband').parentNode;
    const wifeGroup = document.getElementById('wife').parentNode;

    // تحديث عناصر الزوج/الزوجة
    if (isMaleDeceased) {
        // إذا كان المتوفي ذكر
        husbandGroup.style.display = 'none';
        document.getElementById('husband').checked = false;
        wifeGroup.style.display = 'flex';

        // تغيير نص الملصق
        const wifeLabel = wifeGroup.querySelector('label');
        wifeLabel.textContent = 'الزوجة/الزوجات (زوجات المتوفي)';
    } else {
        // إذا كانت المتوفاة أنثى
        husbandGroup.style.display = 'flex';
        wifeGroup.style.display = 'none';
        document.getElementById('wife').checked = false;
        document.getElementById('wife-count-container').style.display = 'none';

        // تغيير نص الملصق
        const husbandLabel = husbandGroup.querySelector('label');
        husbandLabel.textContent = 'الزوج (زوج المتوفاة)';
    }

    // إخفاء حقل العد عند تغيير الجنس
    document.getElementById('wife-count-container').style.display = 
        (document.getElementById('wife').checked && isMaleDeceased) ? 'flex' : 'none';
}

// إعداد أعداد الورثة عند تحديد الصناديق
function setupHeirCounters() {
    const heirsWithCount = [
        'wife', 'son', 'daughter', 'son-of-son', 'daughter-of-son', 
        'brother', 'sister', 'brother-paternal', 'sister-paternal',
        'brother-maternal', 'sister-maternal'
    ];

    heirsWithCount.forEach(heir => {
        const checkbox = document.getElementById(heir);
        const countContainer = document.getElementById(`${heir}-count-container`);

        if (checkbox && countContainer) {
            checkbox.addEventListener('change', function() {
                countContainer.style.display = this.checked ? 'flex' : 'none';
            });
        }
    });
}

// حساب المواريث
function calculateInheritance() {
    // مسح جميع الإشعارات القديمة
    document.getElementById('notification-container').innerHTML = '';

    // التحقق من إدخال قيمة التركة
    const estateValue = parseFloat(document.getElementById('estate-value').value);
    if (!estateValue || estateValue <= 0) {
        showNotification('يرجى إدخال قيمة صحيحة للتركة', 'error', 3000);
        document.getElementById('estate-value').classList.add('input-error');
        setTimeout(() => {
            document.getElementById('estate-value').classList.remove('input-error');
        }, 1000);
        return;
    }

    // التحقق من اختيار وارث واحد على الأقل
    if (!isAnyHeirSelected()) {
        showNotification('يرجى تحديد وارث واحد على الأقل', 'error', 3000);
        return;
    }

    // إظهار إشعار البدء في الحساب
    const calculatingNotification = showNotification('جاري حساب المواريث...', 'info', 2000);

    // جمع بيانات الورثة المحددين
    const heirs = collectSelectedHeirs();

    // حساب المواريث بالفريضة الإسلامية
    const results = computeInheritance(estateValue, heirs);

    // إظهار إشعار النجاح بعد إتمام الحساب
    setTimeout(() => {
        if (calculatingNotification.parentNode) {
            calculatingNotification.remove();
        }
        const successNotification = showNotification('تم حساب المواريث بنجاح', 'success', 5000);

        // جمع الورثة المحجوبين
        const blockedHeirs = results.filter(result => 
            result.share === "محجوبة" || result.share === "محجوب"
        );

        // إظهار إشعارات الحجب فوراً - بعد الإشعار الناجح
        if (blockedHeirs.length > 0) {
            setTimeout(() => {
                // إشعار رئيسي بوجود ورثة محجوبين
                const mainHijabNotification = showNotification(
                    `تنبيه: يوجد ${blockedHeirs.length} من الورثة المحجوبين من الميراث`,
                    'hijab-notification',
                    12000
                );

                // إظهار شريط أفقي بين الإشعارات للفصل
                setTimeout(() => {
                    const dividerEl = document.createElement('div');
                    dividerEl.className = 'notification-divider';
                    dividerEl.style.height = '2px';
                    dividerEl.style.background = 'rgba(255, 255, 255, 0.2)';
                    dividerEl.style.margin = '8px 0';
                    dividerEl.style.borderRadius = '2px';
                    dividerEl.style.animation = 'fadeInDown 0.5s forwards';
                    document.getElementById('notification-container').appendChild(dividerEl);
                }, 500);

                // إظهار إشعارات مفصلة لكل وارث محجوب
                blockedHeirs.forEach((result, index) => {
                    setTimeout(() => {
                        showNotification(
                            `<strong>${result.heir}</strong>: محجوب من الميراث بسبب وجود وارث أقرب منه في الدرجة.`,
                            'hijab-notification',
                            10000 + (index * 1000)
                        );
                    }, 1000 + (index * 800)); // تأخير تدريجي بين الإشعارات المتتالية
                });
            }, 800);
        }

        // جمع الورثة المتأثرين بالعول
        const awlHeirs = results.filter(result => result.awl);

        // إظهار إشعارات العول بعد إشعارات الحجب
        if (awlHeirs.length > 0) {
            const awlDelayTime = blockedHeirs.length > 0 ? 
                1500 + (blockedHeirs.length * 800) : 1000;

            setTimeout(() => {
                // إظهار شريط أفقي بين الإشعارات للفصل
                const dividerEl = document.createElement('div');
                dividerEl.className = 'notification-divider';
                dividerEl.style.height = '2px';
                dividerEl.style.background = 'rgba(255, 255, 255, 0.2)';
                dividerEl.style.margin = '8px 0';
                dividerEl.style.borderRadius = '2px';
                dividerEl.style.animation = 'fadeInDown 0.5s forwards';
                document.getElementById('notification-container').appendChild(dividerEl);

                // إشعار رئيسي بوجود عول
                const mainAwlNotification = showNotification(
                    `تنبيه العول: زادت أنصبة الورثة عن أصل المسألة، فتم تخفيض أنصبتهم بنسبة التزاحم`,
                    'awl-notification',
                    12000
                );

                // إظهار إشعارات مفصلة لكل وارث متأثر بالعول
                awlHeirs.forEach((result, index) => {
                    setTimeout(() => {
                        showNotification(
                            `<strong>${result.heir}</strong>: تأثر نصيبه بالعول وتم تخفيضه من 
                            <span style="color:#FFC107">${result.originalShareValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span> ريال إلى 
                            <span style="color:#4CAF50">${result.shareValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span> ريال`,
                            'awl-notification',
                            10000 + (index * 1000)
                        );
                    }, 1000 + (index * 800)); // تأخير تدريجي بين الإشعارات المتتالية
                });
            }, awlDelayTime);
        }
    }, 800);

    // عرض النتائج
    displayResults(results, estateValue);
}

// التحقق من اختيار وارث واحد على الأقل
function isAnyHeirSelected() {
    const checkboxes = document.querySelectorAll('.heir-checkbox');
    for (let checkbox of checkboxes) {
        if (checkbox.checked) {
            return true;
        }
    }
    return false;
}

// جمع بيانات الورثة المحددين
function collectSelectedHeirs() {
    const heirs = {};

    // تجميع الزوج/الزوجة
    if (document.getElementById('husband').checked) {
        heirs.husband = { count: 1 };
    }

    if (document.getElementById('wife').checked) {
        heirs.wife = { count: parseInt(document.getElementById('wife-count').value) || 1 };
    }

    // تجميع الأصول
    if (document.getElementById('father').checked) {
        heirs.father = { count: 1 };
    }

    if (document.getElementById('mother').checked) {
        heirs.mother = { count: 1 };
    }

    if (document.getElementById('grandfather').checked) {
        heirs.grandfather = { count: 1 };
    }

    if (document.getElementById('grandmother-paternal').checked) {
        heirs.grandmotherPaternal = { count: 1 };
    }

    if (document.getElementById('grandmother-maternal').checked) {
        heirs.grandmotherMaternal = { count: 1 };
    }

    // تجميع الفروع
    if (document.getElementById('son').checked) {
        heirs.son = { count: parseInt(document.getElementById('son-count').value) || 1 };
    }

    if (document.getElementById('daughter').checked) {
        heirs.daughter = { count: parseInt(document.getElementById('daughter-count').value) || 1 };
    }

    if (document.getElementById('son-of-son').checked) {
        heirs.sonOfSon = { count: parseInt(document.getElementById('son-of-son-count').value) || 1 };
    }

    if (document.getElementById('daughter-of-son').checked) {
        heirs.daughterOfSon = { count: parseInt(document.getElementById('daughter-of-son-count').value) || 1 };
    }

    // تجميع الحواشي
    if (document.getElementById('brother').checked) {
        heirs.brother = { count: parseInt(document.getElementById('brother-count').value) || 1 };
    }

    if (document.getElementById('sister').checked) {
        heirs.sister = { count: parseInt(document.getElementById('sister-count').value) || 1 };
    }

    if (document.getElementById('brother-paternal').checked) {
        heirs.brotherPaternal = { count: parseInt(document.getElementById('brother-paternal-count').value) || 1 };
    }

    if (document.getElementById('sister-paternal').checked) {
        heirs.sisterPaternal = { count: parseInt(document.getElementById('sister-paternal-count').value) || 1 };
    }

    if (document.getElementById('brother-maternal').checked) {
        heirs.brotherMaternal = { count: parseInt(document.getElementById('brother-maternal-count').value) || 1 };
    }

    if (document.getElementById('sister-maternal').checked) {
        heirs.sisterMaternal = { count: parseInt(document.getElementById('sister-maternal-count').value) || 1 };
    }

    return heirs;
}

// حساب المواريث وفق الشريعة الإسلامية
function computeInheritance(estateValue, heirs) {
    // النتائج النهائية
    const results = [];

    // أسهم كل وارث (الكسر)
    const shares = {};

    // مجموع الأسهم
    let totalShares = 0;

    // تحديد وجود الفرع الوارث
    const hasMaleDescendant = heirs.son && heirs.son.count > 0 || heirs.sonOfSon && heirs.sonOfSon.count > 0;
    const hasFemaleDescendant = heirs.daughter && heirs.daughter.count > 0 || heirs.daughterOfSon && heirs.daughterOfSon.count > 0;
    const hasDescendants = hasMaleDescendant || hasFemaleDescendant;

    // تحديد وجود الأصل الوارث من الذكور
    const hasMaleAscendant = heirs.father && heirs.father.count > 0 || heirs.grandfather && heirs.grandfather.count > 0;

    // تحديد حجب الإخوة والأخوات
    const siblingsBlocked = heirs.father && heirs.father.count > 0;

    // حساب نصيب الزوج
    if (heirs.husband) {
        // الزوج يأخذ النصف إذا لم يكن هناك فرع وارث، والربع إذا كان هناك فرع وارث
        shares.husband = hasDescendants ? "1/4" : "1/2";
        heirs.husband.share = shares.husband;
        heirs.husband.shareFraction = hasDescendants ? 0.25 : 0.5;
        heirs.husband.shareValue = estateValue * heirs.husband.shareFraction;
        totalShares += heirs.husband.shareFraction;

        results.push({
            heir: "الزوج",
            count: 1,
            share: shares.husband,
            shareValue: heirs.husband.shareValue
        });
    }

    // حساب نصيب الزوجة/الزوجات
    if (heirs.wife && heirs.wife.count > 0) {
        // الزوجة تأخذ الربع إذا لم يكن هناك فرع وارث، والثمن إذا كان هناك فرع وارث
        shares.wife = hasDescendants ? "1/8" : "1/4";
        heirs.wife.share = shares.wife;
        heirs.wife.shareFraction = hasDescendants ? 0.125 : 0.25;
        heirs.wife.shareValue = estateValue * heirs.wife.shareFraction;
        totalShares += heirs.wife.shareFraction;

        if (heirs.wife.count === 1) {
            results.push({
                heir: "الزوجة",
                count: 1,
                share: shares.wife,
                shareValue: heirs.wife.shareValue,
                sharePerPerson: heirs.wife.shareValue
            });
        } else {
            results.push({
                heir: "الزوجات",
                count: heirs.wife.count,
                share: shares.wife,
                shareValue: heirs.wife.shareValue,
                sharePerPerson: heirs.wife.shareValue / heirs.wife.count,
                details: `(${heirs.wife.shareValue / heirs.wife.count} ريال لكل زوجة)`
            });
        }
    }

    // حساب نصيب الأب
    if (heirs.father) {
        if (hasMaleDescendant) {
            // الأب يأخذ السدس فرضًا مع وجود الابن أو ابن الابن
            shares.father = "1/6";
            heirs.father.share = shares.father;
            heirs.father.shareFraction = 1/6;
        } else if (hasFemaleDescendant) {
            // الأب يأخذ السدس فرضًا مع وجود البنت أو بنت الابن + التعصيب
            shares.father = "1/6 + الباقي تعصيبًا";
            heirs.father.share = shares.father;
            heirs.father.shareFraction = 1/6; // سنضيف التعصيب لاحقًا
        } else {
            // الأب يأخذ كل المال تعصيبًا في حالة عدم وجود فرع وارث
            shares.father = "الباقي تعصيبًا";
            heirs.father.share = shares.father;
            heirs.father.shareFraction = 0; // سنحسب التعصيب لاحقًا
        }

        heirs.father.shareValue = estateValue * heirs.father.shareFraction; // مبدئياً
        totalShares += heirs.father.shareFraction;

        results.push({
            heir: "الأب",
            count: 1,
            share: shares.father,
            shareValue: heirs.father.shareValue, // سيتم تحديثه لاحقًا إذا كان يرث بالتعصيب
            isMale: true
        });
    }

    // حساب نصيب الأم
    if (heirs.mother) {
        if (hasDescendants || (heirs.brother && heirs.brother.count > 0) || (heirs.sister && heirs.sister.count > 0) || 
            (heirs.brotherPaternal && heirs.brotherPaternal.count > 0) || (heirs.sisterPaternal && heirs.sisterPaternal.count > 0) ||
            (heirs.brotherMaternal && heirs.brotherMaternal.count > 0) || (heirs.sisterMaternal && heirs.sisterMaternal.count > 0)) {
            // الأم تأخذ السدس إذا كان هناك فرع وارث أو جمع من الإخوة والأخوات
            shares.mother = "1/6";
            heirs.mother.share = shares.mother;
            heirs.mother.shareFraction = 1/6;
        } else {
            // الأم تأخذ الثلث إذا لم يكن هناك فرع وارث أو جمع من الإخوة والأخوات
            // مع مراعاة حالة العمريتين (إذا كان الورثة هم الزوج والأم والأب أو الزوجة والأم والأب)
            const isOmariyaCase = (heirs.husband && heirs.father) || (heirs.wife && heirs.father);

            if (isOmariyaCase) {
                // في العمريتين الأم تأخذ ثلث الباقي بعد فرض الزوج/الزوجة
                if (heirs.husband) {
                    // مع الزوج
                    shares.mother = "1/3 الباقي";
                    heirs.mother.share = shares.mother;
                    heirs.mother.shareFraction = (1/3) * (1 - heirs.husband.shareFraction);
                } else {
                    // مع الزوجة
                    shares.mother = "1/3 الباقي";
                    heirs.mother.share = shares.mother;
                    heirs.mother.shareFraction = (1/3) * (1 - heirs.wife.shareFraction);
                }
            } else {
                // الحالة العادية
                shares.mother = "1/3";
                heirs.mother.share = shares.mother;
                heirs.mother.shareFraction = 1/3;
            }
        }

        heirs.mother.shareValue = estateValue * heirs.mother.shareFraction;
        totalShares += heirs.mother.shareFraction;

        results.push({
            heir: "الأم",
            count: 1,
            share: shares.mother,
            shareValue: heirs.mother.shareValue
        });
    }

    // تحديد نصيب الجد (في حالة عدم وجود الأب)
    if (heirs.grandfather && (!heirs.father || heirs.father.count === 0)) {
        if (hasMaleDescendant) {
            // الجد يأخذ السدس فرضًا مع وجود الابن أو ابن الابن
            shares.grandfather = "1/6";
            heirs.grandfather.share = shares.grandfather;
            heirs.grandfather.shareFraction = 1/6;
        } else if (hasFemaleDescendant) {
            // الجد يأخذ السدس فرضًا مع وجود البنت أو بنت الابن + التعصيب
            shares.grandfather = "1/6 + الباقي تعصيبًا";
            heirs.grandfather.share = shares.grandfather;
            heirs.grandfather.shareFraction = 1/6; // سنضيف التعصيب لاحقًا
        } else {
            // الجد يأخذ كل المال تعصيبًا في حالة عدم وجود فرع وارث
            shares.grandfather = "الباقي تعصيبًا";
            heirs.grandfather.share = shares.grandfather;
            heirs.grandfather.shareFraction = 0; // سنحسب التعصيب لاحقًا
        }

        heirs.grandfather.shareValue = estateValue * heirs.grandfather.shareFraction; // مبدئياً
        totalShares += heirs.grandfather.shareFraction;

        results.push({
            heir: "الجد (أبو الأب)",
            count: 1,
            share: shares.grandfather,
            shareValue: heirs.grandfather.shareValue, // سيتم تحديثه لاحقًا إذا كان يرث بالتعصيب
            isMale: true
        });
    }

    // تحديد نصيب الجدة (أم الأب) - إذا لم توجد الأم
    if (heirs.grandmotherPaternal && (!heirs.mother || heirs.mother.count === 0) && (!heirs.father || heirs.father.count === 0)) {
        shares.grandmotherPaternal = "1/6";
        heirs.grandmotherPaternal.share = shares.grandmotherPaternal;
        heirs.grandmotherPaternal.shareFraction = 1/6;
        heirs.grandmotherPaternal.shareValue = estateValue * heirs.grandmotherPaternal.shareFraction;
        totalShares += heirs.grandmotherPaternal.shareFraction;

        results.push({
            heir: "الجدة (أم الأب)",
            count: 1,
            share: shares.grandmotherPaternal,
            shareValue: heirs.grandmotherPaternal.shareValue
        });
    }

    // تحديد نصيب الجدة (أم الأم) - إذا لم توجد الأم
    if (heirs.grandmotherMaternal && (!heirs.mother || heirs.mother.count === 0)) {
        shares.grandmotherMaternal = "1/6";
        heirs.grandmotherMaternal.share = shares.grandmotherMaternal;
        heirs.grandmotherMaternal.shareFraction = 1/6;
        heirs.grandmotherMaternal.shareValue = estateValue * heirs.grandmotherMaternal.shareFraction;
        totalShares += heirs.grandmotherMaternal.shareFraction;

        results.push({
            heir: "الجدة (أم الأم)",
            count: 1,
            share: shares.grandmotherMaternal,
            shareValue: heirs.grandmotherMaternal.shareValue
        });
    }

    // حساب نصيب الإبن
    if (hasMaleDescendant) {
        // الابن يرث بالتعصيب
        shares.son = "الباقي تعصيبًا";
        heirs.son = heirs.son || { count: 0 };
        heirs.son.share = shares.son;
        // نصيب الابن سيتم حسابه لاحقًا

        if (heirs.son && heirs.son.count > 0) {
            results.push({
                heir: "الإبن",
                count: heirs.son.count,
                share: shares.son,
                isMale: true
                // shareValue سيتم حسابه لاحقًا
            });
        }
    }

    // حساب نصيب البنت
    if (heirs.daughter && heirs.daughter.count > 0) {
        if (hasMaleDescendant) {
            // البنت ترث بالتعصيب مع الابن (للذكر مثل حظ الأنثيين)
            shares.daughter = "الباقي تعصيبًا مع الابن (للذكر مثل حظ الأنثيين)";
            heirs.daughter.share = shares.daughter;
            // نصيب البنت سيتم حسابه لاحقًا
        } else if (heirs.daughter.count === 1) {
            // البنت الواحدة ترث النصف
            shares.daughter = "1/2";
            heirs.daughter.share = shares.daughter;
            heirs.daughter.shareFraction = 1/2;
            heirs.daughter.shareValue = estateValue * heirs.daughter.shareFraction;
            totalShares += heirs.daughter.shareFraction;
        } else {
            // البنات (أكثر من واحدة) يرثن الثلثين
            shares.daughter = "2/3";
            heirs.daughter.share = shares.daughter;
            heirs.daughter.shareFraction = 2/3;
            heirs.daughter.shareValue = estateValue * heirs.daughter.shareFraction;
            totalShares += heirs.daughter.shareFraction;
        }

        results.push({
            heir: "البنت",
            count: heirs.daughter.count,
            share: shares.daughter,
            shareValue: heirs.daughter.shareValue,
            sharePerPerson: heirs.daughter.shareValue ? heirs.daughter.shareValue / heirs.daughter.count : null
        });
    }

    // حساب نصيب ابن الابن (إذا لم يوجد ابن)
    if (heirs.sonOfSon && heirs.sonOfSon.count > 0 && (!heirs.son || heirs.son.count === 0)) {
        // ابن الابن يرث بالتعصيب
        shares.sonOfSon = "الباقي تعصيبًا";
        heirs.sonOfSon.share = shares.sonOfSon;
        // نصيب ابن الابن سيتم حسابه لاحقًا

        results.push({
            heir: "إبن الإبن",
            count: heirs.sonOfSon.count,
            share: shares.sonOfSon,
            isMale: true
            // shareValue سيتم حسابه لاحقًا
        });
    }

    // حساب نصيب بنت الابن (إذا لم توجد بنت صلبية أو ابن)
    if (heirs.daughterOfSon && heirs.daughterOfSon.count > 0 && (!heirs.son || heirs.son.count === 0)) {
        if (heirs.sonOfSon && heirs.sonOfSon.count > 0) {
            // بنت الابن ترث بالتعصيب مع ابن الابن (للذكر مثل حظ الأنثيين)
            shares.daughterOfSon = "الباقي تعصيبًا مع ابن الابن (للذكر مثل حظ الأنثيين)";
            heirs.daughterOfSon.share = shares.daughterOfSon;
            // نصيب بنت الابن سيتم حسابه لاحقًا
        } else if (!heirs.daughter || heirs.daughter.count === 0) {
            // إذا لم توجد بنت صلبية
            if (heirs.daughterOfSon.count === 1) {
                // بنت الابن الواحدة ترث النصف
                shares.daughterOfSon = "1/2";
                heirs.daughterOfSon.share = shares.daughterOfSon;
                heirs.daughterOfSon.shareFraction = 1/2;
                heirs.daughterOfSon.shareValue = estateValue * heirs.daughterOfSon.shareFraction;
                totalShares += heirs.daughterOfSon.shareFraction;
            } else {
                // بنات الابن (أكثر من واحدة) يرثن الثلثين
                shares.daughterOfSon = "2/3";
                heirs.daughterOfSon.share = shares.daughterOfSon;
                heirs.daughterOfSon.shareFraction = 2/3;
                heirs.daughterOfSon.shareValue = estateValue * heirs.daughterOfSon.shareFraction;
                totalShares += heirs.daughterOfSon.shareFraction;
            }
        } else if (heirs.daughter.count === 1) {
            // إذا كانت هناك بنت واحدة فقط، بنت الابن تكمل الثلثين
            shares.daughterOfSon = "1/6";
            heirs.daughterOfSon.share = shares.daughterOfSon;
            heirs.daughterOfSon.shareFraction = 1/6;
            heirs.daughterOfSon.shareValue = estateValue * heirs.daughterOfSon.shareFraction;
            totalShares += heirs.daughterOfSon.shareFraction;
        } else {
            // إذا كان هناك بنتان أو أكثر، بنت الابن تُحجب
            shares.daughterOfSon = "محجوبة";
            heirs.daughterOfSon.share = shares.daughterOfSon;
            heirs.daughterOfSon.shareFraction = 0;
            heirs.daughterOfSon.shareValue = 0;
        }

        results.push({
            heir: "بنت الإبن",
            count: heirs.daughterOfSon.count,
            share: shares.daughterOfSon,
            shareValue: heirs.daughterOfSon.shareValue,
            sharePerPerson: heirs.daughterOfSon.shareValue ? heirs.daughterOfSon.shareValue / heirs.daughterOfSon.count : null
        });
    }

    // حساب نصيب الإخوة والأخوات إذا لم يوجد أب أو ابن
    if (!siblingsBlocked && !hasMaleDescendant) {

        // الإخوة الأشقاء
        if (heirs.brother && heirs.brother.count > 0) {
            shares.brother = "الباقي تعصيبًا";
            heirs.brother.share = shares.brother;
            // نصيب الأخ الشقيق سيتم حسابه لاحقًا

            results.push({
                heir: "الأخ الشقيق",
                count: heirs.brother.count,
                share: shares.brother,
                isMale: true
                // shareValue سيتم حسابه لاحقًا
            });
        }

        if (heirs.sister && heirs.sister.count > 0) {
            if (heirs.brother && heirs.brother.count > 0) {
                // الأخت الشقيقة ترث بالتعصيب مع الأخ الشقيق
                shares.sister = "الباقي تعصيبًا مع الأخ الشقيق (للذكر مثل حظ الأنثيين)";
                heirs.sister.share = shares.sister;
                // نصيب الأخت الشقيقة سيتم حسابه لاحقًا
            } else if (heirs.sister.count === 1) {
                // الأخت الشقيقة الواحدة ترث النصف
                shares.sister = "1/2";
                heirs.sister.share = shares.sister;
                heirs.sister.shareFraction = 1/2;
                heirs.sister.shareValue = estateValue * heirs.sister.shareFraction;
                totalShares += heirs.sister.shareFraction;
            } else {
                // الأخوات الشقيقات (أكثر من واحدة) يرثن الثلثين
                shares.sister = "2/3";
                heirs.sister.share = shares.sister;
                heirs.sister.shareFraction = 2/3;
                heirs.sister.shareValue = estateValue * heirs.sister.shareFraction;
                totalShares += heirs.sister.shareFraction;
            }

            results.push({
                heir: "الأخت الشقيقة",
                count: heirs.sister.count,
                share: shares.sister,
                shareValue: heirs.sister.shareValue,
                sharePerPerson: heirs.sister.shareValue ? heirs.sister.shareValue / heirs.sister.count : null
            });
        }

        // الإخوة لأب (إذا لم يوجد أخ شقيق)
        if ((!heirs.brother || heirs.brother.count === 0) && heirs.brotherPaternal && heirs.brotherPaternal.count > 0) {
            shares.brotherPaternal = "الباقي تعصيبًا";
            heirs.brotherPaternal.share = shares.brotherPaternal;
            // نصيب الأخ لأب سيتم حسابه لاحقًا

            results.push({
                heir: "الأخ لأب",
                count: heirs.brotherPaternal.count,
                share: shares.brotherPaternal,
                isMale: true
                // shareValue سيتم حسابه لاحقًا
            });
        }

        if (heirs.sisterPaternal && heirs.sisterPaternal.count > 0) {
            if (heirs.brotherPaternal && heirs.brotherPaternal.count > 0) {
                // الأخت لأب ترث بالتعصيب مع الأخ لأب
                shares.sisterPaternal = "الباقي تعصيبًا مع الأخ لأب (للذكر مثل حظ الأنثيين)";
                heirs.sisterPaternal.share = shares.sisterPaternal;
                // نصيب الأخت لأب سيتم حسابه لاحقًا
            } else if ((!heirs.sister || heirs.sister.count === 0) && (!heirs.brother || heirs.brother.count === 0)) {
                // إذا لم توجد أخت شقيقة أو أخ شقيق
                if (heirs.sisterPaternal.count === 1) {
                    // الأخت لأب الواحدة ترث النصف
                    shares.sisterPaternal = "1/2";
                    heirs.sisterPaternal.share = shares.sisterPaternal;
                    heirs.sisterPaternal.shareFraction = 1/2;
                    heirs.sisterPaternal.shareValue = estateValue * heirs.sisterPaternal.shareFraction;
                    totalShares += heirs.sisterPaternal.shareFraction;
                } else {
                    // الأخوات لأب (أكثر من واحدة) يرثن الثلثين
                    shares.sisterPaternal = "2/3";
                    heirs.sisterPaternal.share = shares.sisterPaternal;
                    heirs.sisterPaternal.shareFraction = 2/3;
                    heirs.sisterPaternal.shareValue = estateValue * heirs.sisterPaternal.shareFraction;
                    totalShares += heirs.sisterPaternal.shareFraction;
                }
            } else if (heirs.sister && heirs.sister.count === 1 && (!heirs.brother || heirs.brother.count === 0)) {
                // إذا كانت هناك أخت شقيقة واحدة فقط، الأخت لأب تكمل الثلثين
                shares.sisterPaternal = "1/6";
                heirs.sisterPaternal.share = shares.sisterPaternal;
                heirs.sisterPaternal.shareFraction = 1/6;
                heirs.sisterPaternal.shareValue = estateValue * heirs.sisterPaternal.shareFraction;
                totalShares += heirs.sisterPaternal.shareFraction;
            } else {
                // إذا كان هناك أختان شقيقتان أو أكثر، الأخت لأب تُحجب
                shares.sisterPaternal = "محجوبة";
                heirs.sisterPaternal.share = shares.sisterPaternal;
                heirs.sisterPaternal.shareFraction = 0;
                heirs.sisterPaternal.shareValue = 0;
            }

            results.push({
                heir: "الأخت لأب",
                count: heirs.sisterPaternal.count,
                share: shares.sisterPaternal,
                shareValue: heirs.sisterPaternal.shareValue,
                sharePerPerson: heirs.sisterPaternal.shareValue ? heirs.sisterPaternal.shareValue / heirs.sisterPaternal.count : null
            });
        }

        // الإخوة لأم (إذا لم يوجد فرع وارث ولا أب/جد)
        if ((!hasDescendants && !hasMaleAscendant) && 
            ((heirs.brotherMaternal && heirs.brotherMaternal.count > 0) || (heirs.sisterMaternal && heirs.sisterMaternal.count > 0))) {

            const maternalSiblingsCount = (heirs.brotherMaternal ? heirs.brotherMaternal.count : 0) + 
                                          (heirs.sisterMaternal ? heirs.sisterMaternal.count : 0);

            if (maternalSiblingsCount === 1) {
                // الأخ/الأخت لأم الواحد/ة ترث السدس
                const maternalShare = "1/6";
                const maternalShareFraction = 1/6;

                if (heirs.brotherMaternal && heirs.brotherMaternal.count > 0) {
                    shares.brotherMaternal = maternalShare;
                    heirs.brotherMaternal.share = shares.brotherMaternal;
                    heirs.brotherMaternal.shareFraction = maternalShareFraction;
                    heirs.brotherMaternal.shareValue = estateValue * heirs.brotherMaternal.shareFraction;
                    totalShares += heirs.brotherMaternal.shareFraction;

                    results.push({
                        heir: "الأخ لأم",
                        count: heirs.brotherMaternal.count,
                        share: shares.brotherMaternal,
                        shareValue: heirs.brotherMaternal.shareValue,
                        sharePerPerson: heirs.brotherMaternal.shareValue / heirs.brotherMaternal.count
                    });
                }

                if (heirs.sisterMaternal && heirs.sisterMaternal.count > 0) {
                    shares.sisterMaternal = maternalShare;
                    heirs.sisterMaternal.share = shares.sisterMaternal;
                    heirs.sisterMaternal.shareFraction = maternalShareFraction;
                    heirs.sisterMaternal.shareValue = estateValue * heirs.sisterMaternal.shareFraction;
                    totalShares += heirs.sisterMaternal.shareFraction;

                    results.push({
                        heir: "الأخت لأم",
                        count: heirs.sisterMaternal.count,
                        share: shares.sisterMaternal,
                        shareValue: heirs.sisterMaternal.shareValue,
                        sharePerPerson: heirs.sisterMaternal.shareValue / heirs.sisterMaternal.count
                    });
                }
            } else if (maternalSiblingsCount > 1) {
                // الإخوة/الأخوات لأم (أكثر من واحد/ة) يرثون الثلث
                const maternalShare = "1/3";
                const maternalShareFraction = 1/3;
                const maternalShareValue = estateValue * maternalShareFraction;
                totalShares += maternalShareFraction;

                if (heirs.brotherMaternal && heirs.brotherMaternal.count > 0) {
                    shares.brotherMaternal = maternalShare;
                    heirs.brotherMaternal.share = shares.brotherMaternal;
                    heirs.brotherMaternal.shareFraction = maternalShareFraction * (heirs.brotherMaternal.count / maternalSiblingsCount);
                    heirs.brotherMaternal.shareValue = maternalShareValue * (heirs.brotherMaternal.count / maternalSiblingsCount);

                    results.push({
                        heir: "الأخ لأم",
                        count: heirs.brotherMaternal.count,
                        share: shares.brotherMaternal,
                        shareValue: heirs.brotherMaternal.shareValue,
                        sharePerPerson: heirs.brotherMaternal.shareValue / heirs.brotherMaternal.count
                    });
                }

                if (heirs.sisterMaternal && heirs.sisterMaternal.count > 0) {
                    shares.sisterMaternal = maternalShare;
                    heirs.sisterMaternal.share = shares.sisterMaternal;
                    heirs.sisterMaternal.shareFraction = maternalShareFraction * (heirs.sisterMaternal.count / maternalSiblingsCount);
                    heirs.sisterMaternal.shareValue = maternalShareValue * (heirs.sisterMaternal.count / maternalSiblingsCount);

                    results.push({
                        heir: "الأخت لأم",
                        count: heirs.sisterMaternal.count,
                        share: shares.sisterMaternal,
                        shareValue: heirs.sisterMaternal.shareValue,
                        sharePerPerson: heirs.sisterMaternal.shareValue / heirs.sisterMaternal.count
                    });
                }
            }
        }
    }

    // حساب نصيب العصبات (الباقي)
    if (totalShares < 1) {
        const remainderValue = estateValue * (1 - totalShares);

        // إذا كان هناك ابن وبنت
        if (hasMaleDescendant && heirs.daughter && heirs.daughter.count > 0) {
            // تحديد الوحدات لحساب التعصيب
            const maleWeight = 2;
            const femaleWeight = 1;

            let sonCount = 0;
            if (heirs.son && heirs.son.count > 0) {
                sonCount = heirs.son.count;
            }

            let sonOfSonCount = 0;
            if (heirs.sonOfSon && heirs.sonOfSon.count > 0 && (!heirs.son || heirs.son.count === 0)) {
                sonOfSonCount = heirs.sonOfSon.count;
            }

            let daughterCount = 0;
            if (heirs.daughter && heirs.daughter.count > 0) {
                daughterCount = heirs.daughter.count;
            }

            let daughterOfSonCount = 0;
            if (heirs.daughterOfSon && heirs.daughterOfSon.count > 0 && (!heirs.son || heirs.son.count === 0)) {
                daughterOfSonCount = heirs.daughterOfSon.count;
            }

            const totalWeights = (sonCount * maleWeight) + (sonOfSonCount * maleWeight) + 
                               (daughterCount * femaleWeight) + (daughterOfSonCount * femaleWeight);

            // حساب نصيب الابن
            if (heirs.son && heirs.son.count > 0) {
                const sonShareValue = remainderValue * ((heirs.son.count * maleWeight) / totalWeights);
                const sonResult = results.find(r => r.heir === "الإبن");
                if (sonResult) {
                    sonResult.shareValue = sonShareValue;
                    sonResult.sharePerPerson = sonShareValue / heirs.son.count;
                }
            }

            // حساب نصيب البنت
            if (heirs.daughter && heirs.daughter.count > 0) {
                const daughterShareValue = remainderValue * ((heirs.daughter.count * femaleWeight) / totalWeights);
                const daughterResult = results.find(r => r.heir === "البنت");
                if (daughterResult) {
                    daughterResult.shareValue = daughterShareValue;
                    daughterResult.sharePerPerson = daughterShareValue / heirs.daughter.count;
                }
            }

            // حساب نصيب ابن الابن (إذا لم يوجد ابن)
            if (heirs.sonOfSon && heirs.sonOfSon.count > 0 && (!heirs.son || heirs.son.count === 0)) {
                const sonOfSonShareValue = remainderValue * ((heirs.sonOfSon.count * maleWeight) / totalWeights);
                const sonOfSonResult = results.find(r => r.heir === "إبن الإبن");
                if (sonOfSonResult) {
                    sonOfSonResult.shareValue = sonOfSonShareValue;
                    sonOfSonResult.sharePerPerson = sonOfSonShareValue / heirs.sonOfSon.count;
                }
            }

            // حساب نصيب بنت الابن (إذا لم يوجد ابن)
            if (heirs.daughterOfSon && heirs.daughterOfSon.count > 0 && (!heirs.son || heirs.son.count === 0)) {
                const daughterOfSonShareValue = remainderValue * ((heirs.daughterOfSon.count * femaleWeight) / totalWeights);
                const daughterOfSonResult = results.find(r => r.heir === "بنت الإبن");
                if (daughterOfSonResult) {
                    daughterOfSonResult.shareValue = daughterOfSonShareValue;
                    daughterOfSonResult.sharePerPerson = daughterOfSonShareValue / heirs.daughterOfSon.count;
                }
            }
        } 
        // إذا كان هناك أخ وأخت
        else if (!hasDescendants && !hasMaleAscendant) {
            if (heirs.brother && heirs.brother.count > 0 && heirs.sister && heirs.sister.count > 0) {
                // تحديد الوحدات لحساب التعصيب للأخوة الأشقاء
                const maleWeight = 2;
                const femaleWeight = 1;
                const totalWeights = (heirs.brother.count * maleWeight) + (heirs.sister.count * femaleWeight);

                // حساب نصيب الأخ الشقيق
                const brotherShareValue = remainderValue * ((heirs.brother.count * maleWeight) / totalWeights);
                const brotherResult = results.find(r => r.heir === "الأخ الشقيق");
                if (brotherResult) {
                    brotherResult.shareValue = brotherShareValue;
                    brotherResult.sharePerPerson = brotherShareValue / heirs.brother.count;
                }

                // حساب نصيب الأخت الشقيقة
                const sisterShareValue = remainderValue * ((heirs.sister.count * femaleWeight) / totalWeights);
                const sisterResult = results.find(r => r.heir === "الأخت الشقيقة");
                if (sisterResult) {
                    sisterResult.shareValue = sisterShareValue;
                    sisterResult.sharePerPerson = sisterShareValue / heirs.sister.count;
                }
            }
            // إذا كان هناك أخ لأب وأخت لأب
            else if ((!heirs.brother || heirs.brother.count === 0) && 
                     heirs.brotherPaternal && heirs.brotherPaternal.count > 0 && 
                     heirs.sisterPaternal && heirs.sisterPaternal.count > 0) {
                // تحديد الوحدات لحساب التعصيب للأخوة لأب
                const maleWeight = 2;
                const femaleWeight = 1;
                const totalWeights = (heirs.brotherPaternal.count * maleWeight) + (heirs.sisterPaternal.count * femaleWeight);

                // حساب نصيب الأخ لأب
                const brotherPaternalShareValue = remainderValue * ((heirs.brotherPaternal.count * maleWeight) / totalWeights);
                const brotherPaternalResult = results.find(r => r.heir === "الأخ لأب");
                if (brotherPaternalResult) {
                    brotherPaternalResult.shareValue = brotherPaternalShareValue;
                    brotherPaternalResult.sharePerPerson = brotherPaternalShareValue / heirs.brotherPaternal.count;
                }

                // حساب نصيب الأخت لأب
                const sisterPaternalShareValue = remainderValue * ((heirs.sisterPaternal.count * femaleWeight) / totalWeights);
                const sisterPaternalResult = results.find(r => r.heir === "الأخت لأب");
                if (sisterPaternalResult) {
                    sisterPaternalResult.shareValue = sisterPaternalShareValue;
                    sisterPaternalResult.sharePerPerson = sisterPaternalShareValue / heirs.sisterPaternal.count;
                }
            }
            // إذا كان هناك أخ شقيق فقط
            else if (heirs.brother && heirs.brother.count > 0) {
                const brotherShareValue = remainderValue;
                const brotherResult = results.find(r => r.heir === "الأخ الشقيق");
                if (brotherResult) {
                    brotherResult.shareValue = brotherShareValue;
                    brotherResult.sharePerPerson = brotherShareValue / heirs.brother.count;
                }
            }
            // إذا كان هناك أخ لأب فقط
            else if ((!heirs.brother || heirs.brother.count === 0) && heirs.brotherPaternal && heirs.brotherPaternal.count > 0) {
                const brotherPaternalShareValue = remainderValue;
                const brotherPaternalResult = results.find(r => r.heir === "الأخ لأب");
                if (brotherPaternalResult) {
                    brotherPaternalResult.shareValue = brotherPaternalShareValue;
                    brotherPaternalResult.sharePerPerson = brotherPaternalShareValue / heirs.brotherPaternal.count;
                }
            }
        }
        // إذا كان هناك ابن فقط
        else if (heirs.son && heirs.son.count > 0 && (!heirs.daughter || heirs.daughter.count === 0)) {
            const sonShareValue = remainderValue;
            const sonResult = results.find(r => r.heir === "الإبن");
            if (sonResult) {
                sonResult.shareValue = sonShareValue;
                sonResult.sharePerPerson = sonShareValue / heirs.son.count;
            }
        }
        // إذا كان هناك ابن ابن فقط (ولا يوجد ابن)
        else if ((!heirs.son || heirs.son.count === 0) && heirs.sonOfSon && heirs.sonOfSon.count > 0 && 
                 (!heirs.daughterOfSon || heirs.daughterOfSon.count === 0)) {
            const sonOfSonShareValue = remainderValue;
            const sonOfSonResult = results.find(r => r.heir === "إبن الإبن");
            if (sonOfSonResult) {
                sonOfSonResult.shareValue = sonOfSonShareValue;
                sonOfSonResult.sharePerPerson = sonOfSonShareValue / heirs.sonOfSon.count;
            }
        }
        // إذا كان هناك أب
        else if (heirs.father) {
            // تعصيب الأب
            const fatherResult = results.find(r => r.heir === "الأب");
            if (fatherResult) {
                if (fatherResult.share.includes("الباقي تعصيبًا")) {
                    fatherResult.shareValue = remainderValue;
                } else if (fatherResult.share.includes("1/6 + الباقي تعصيبًا")) {
                    fatherResult.shareValue = (estateValue * (1/6)) + remainderValue;
                }
            }
        }
        // إذا كان هناك جد (ولا يوجد أب)
        else if (heirs.grandfather && (!heirs.father || heirs.father.count === 0)) {
            // تعصيب الجد
            const grandfatherResult = results.find(r => r.heir === "الجد (أبو الأب)");
            if (grandfatherResult) {
                if (grandfatherResult.share.includes("الباقي تعصيبًا")) {
                    grandfatherResult.shareValue = remainderValue;
                } else if (grandfatherResult.share.includes("1/6 + الباقي تعصيبًا")) {
                    grandfatherResult.shareValue = (estateValue * (1/6)) + remainderValue;
                }
            }
        }
    }

    // تحقق من العول (إذا كان مجموع الأسهم أكبر من 1)
    if (totalShares > 1) {
        const awlFactor = 1 / totalShares;

        // تعديل جميع الأنصبة بنسبة العول
        results.forEach(result => {
            if (result.shareValue) {
                result.awl = true; // إشارة إلى أن هناك عول
                result.originalShareValue = result.shareValue;
                result.shareValue = result.shareValue * awlFactor;

                if (result.sharePerPerson) {
                    result.originalSharePerPerson = result.sharePerPerson;
                    result.sharePerPerson = result.sharePerPerson * awlFactor;
                }
            }
        });
    }

    return results;
}

// عرض النتائج
function displayResults(results, estateValue) {
    const resultsContainer = document.getElementById('inheritance-results');
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>لم يتم العثور على ورثة مستحقين.</p>';
        return;
    }

    // التحقق مما إذا كان هناك عول
    const hasAwl = results.some(result => result.awl);

    // التحقق مما إذا كان هناك حجب
    const hasHijab = results.some(result => result.share === "محجوبة" || result.share === "محجوب");

    // إجمالي ما تم توزيعه
    let totalDistributed = 0;
    results.forEach(result => {
        if (result.shareValue) {
            totalDistributed += result.shareValue;
        }
    });

    // إظهار إشعارات للحالات الخاصة

    // إضافة معلومات العول إذا وجد
    if (hasAwl) {
        const awlInfo = document.createElement('div');
        awlInfo.className = 'awl-info';
        awlInfo.innerHTML = `
            <p style="color: #ff9800; background: rgba(255, 152, 0, 0.1); padding: 10px; border-radius: 5px; margin-bottom: 15px; border-right: 3px solid #ff9800;">
                <strong>تنبيه:</strong> حصل عول في المسألة. العول هو زيادة السهام عن أصل المسألة، فتم تعديل الأنصبة بالتناسب لضمان عدالة التوزيع.
                <br><small>* انظر للإشعارات في الجانب الأيسر للتفاصيل</small>
            </p>
        `;
        resultsContainer.appendChild(awlInfo);

        // إظهار إشعار منبثق عن العول
        showNotification(
            'تنبيه: حصل عول في المسألة. العول هو زيادة السهام عن أصل المسألة، فتقل حصة كل وارث بنسبة العول.', 
            'awl-notification', 
            10000
        );
    }

    // إضافة معلومات الحجب إذا وجد
    if (hasHijab) {
        const hijabInfo = document.createElement('div');
        hijabInfo.className = 'hijab-info';
        hijabInfo.innerHTML = `
            <p style="color: #8e44ad; background: rgba(142, 68, 173, 0.1); padding: 10px; border-radius: 5px; margin-bottom: 15px; border-right: 3px solid #8e44ad;">
                <strong>تنبيه:</strong> هناك ورثة محجوبون في هذه المسألة. الحجب هو منع الوارث من الميراث كليًا أو جزئيًا لوجود وارث أقرب منه.
                <br><small>* انظر للإشعارات في الجانب الأيسر للتفاصيل</small>
            </p>
        `;
        resultsContainer.appendChild(hijabInfo);

        // جمع أسماء الورثة المحجوبين
        const blockedHeirs = results
            .filter(result => result.share === "محجوبة" || result.share === "محجوب")
            .map(result => result.heir)
            .join('، ');

        // إظهار إشعار منبثق عن الحجب مع ذكر أسماء المحجوبين
        showNotification(
            `تنبيه: الورثة المحجوبون في هذه المسألة هم: ${blockedHeirs}`,
            'hijab-notification',
            10000
        );
    }

    // إضافة معلومات الرد إذا وجد (استرداد ما تبقى من التركة)
    if (totalDistributed < estateValue && Math.abs(estateValue - totalDistributed) > 0.01) {
        const remainingValue = estateValue - totalDistributed;
        const remainingInfo = document.createElement('div');
        remainingInfo.className = 'remaining-info';
        remainingInfo.innerHTML = `
            <p style="color: #4CAF50; background: rgba(76, 175, 80, 0.1); padding: 10px; border-radius: 5px; margin-bottom: 15px;">
                <strong>تنبيه:</strong> تبقى من التركة ${remainingValue.toLocaleString(undefined, { maximumFractionDigits: 2 })} ريال وسترد على الورثة حسب قواعد الرد في المواريث.
            </p>
        `;
        resultsContainer.appendChild(remainingInfo);

        // إظهار إشعار منبثق عن الرد
        showNotification(
            'تنبيه: هناك مبلغ متبقٍ من التركة سيتم رده على أصحاب الفروض (عدا الزوجين) بنسبة فروضهم.',
            'success',
            8000
        );
    }

    // إنشاء جدول النتائج
    const table = document.createElement('table');
    table.className = 'inheritance-results-table';

    // إنشاء رأس الجدول
    const tableHead = document.createElement('thead');
    tableHead.innerHTML = `
        <tr>
            <th>الوارث</th>
            <th>العدد</th>
            <th>الحصة الشرعية</th>
            <th>القيمة (ريال)</th>
            <th>نصيب الفرد</th>
        </tr>
    `;
    table.appendChild(tableHead);

    // إنشاء جسم الجدول
    const tableBody = document.createElement('tbody');

    // فرز النتائج حسب قيمة الحصة (تنازلياً)
    results.sort((a, b) => {
        if (a.shareValue === undefined) return 1;
        if (b.shareValue === undefined) return -1;
        return b.shareValue - a.shareValue;
    });

    // إضافة صفوف الجدول
    results.forEach(result => {
        const row = document.createElement('tr');

        // تنسيق مختلف للوارث المحجوب
        const isBlocked = result.share === "محجوبة" || result.share === "محجوب";
        if (isBlocked) {
            row.classList.add('heir-blocked');
        }

        // الوارث
        const heirCell = document.createElement('td');
        heirCell.className = 'heir-name';
        heirCell.textContent = result.heir;
        row.appendChild(heirCell);

        // العدد
        const countCell = document.createElement('td');
        countCell.textContent = result.count || 1;
        row.appendChild(countCell);

        // الحصة الشرعية
        const shareCell = document.createElement('td');
        shareCell.className = isBlocked ? 'inheritance-share blocked' : 'inheritance-share';
        shareCell.textContent = result.share || 'محجوب';

        // إضافة ملاحظة السبب إذا كان محجوبًا
        if (isBlocked) {
            const tooltipSpan = document.createElement('span');
            tooltipSpan.className = 'blocked-reason';
            tooltipSpan.innerHTML = '<i class="fas fa-info-circle"></i>';
            tooltipSpan.title = 'الحجب: تم حجب هذا الوارث بسبب وجود فرع وارث أقرب في الدرجة';
            shareCell.appendChild(tooltipSpan);
        }

        row.appendChild(shareCell);

        // القيمة
        const valueCell = document.createElement('td');
        if (result.shareValue !== undefined) {
            valueCell.textContent = result.shareValue.toLocaleString(undefined, { maximumFractionDigits: 2 }) + ' ريال';
        } else {
            valueCell.textContent = '0 ريال';
        }
        row.appendChild(valueCell);

        // نصيب الفرد
        const perPersonCell = document.createElement('td');
        if (result.sharePerPerson !== undefined) {
            perPersonCell.textContent = result.sharePerPerson.toLocaleString(undefined, { maximumFractionDigits: 2 }) + ' ريال';
            // إضافة التفاصيل إذا وجدت
            if (result.details) {
                const detailsSpan = document.createElement('span');
                detailsSpan.className = 'share-details';
                detailsSpan.textContent = ' ' + result.details;
                perPersonCell.appendChild(detailsSpan);
            }
        } else if (result.count === 1 || result.count === undefined) {
            perPersonCell.textContent = valueCell.textContent;
        } else {
            perPersonCell.textContent = '0 ريال';
        }
        row.appendChild(perPersonCell);

        tableBody.appendChild(row);
    });

    table.appendChild(tableBody);
    resultsContainer.appendChild(table);

    // إضافة إجمالي التركة
    const totalInfo = document.createElement('div');
    totalInfo.className = 'total-info';
    totalInfo.innerHTML = `
        <p style="margin-top: 15px;">
            <strong>إجمالي التركة:</strong> ${estateValue.toLocaleString()} ريال
        </p>
        <p>
            <strong>إجمالي ما تم توزيعه:</strong> ${totalDistributed.toLocaleString(undefined, { maximumFractionDigits: 2 })} ريال
            (${((totalDistributed / estateValue) * 100).toFixed(2)}%)
        </p>
    `;
    resultsContainer.appendChild(totalInfo);

    // إظهار إشعار النجاح
    showNotification('تم حساب المواريث بنجاح', 'success', 3000);
}