let vehicleData = {}; // هيخزن Vehicle -> Client

// تحميل ملف XLSX تلقائيًا من نفس المجلد
fetch('data.xlsx')
  .then(response => response.arrayBuffer())
  .then(data => {
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    // حفظ البيانات في object
    jsonData.forEach(row => {
      if (row.Vehicle && row.Client) {
        vehicleData[row.Vehicle.trim()] = row.Client.trim();
      }
    });

    document.getElementById('status').textContent = "✅ تم تحميل ملف البيانات بنجاح";
  })
  .catch(err => {
    console.error(err);
    document.getElementById('status').textContent = "❌ فشل تحميل ملف البيانات";
  });

// إظهار إدخال السرعة عند اختيار Overspeed
document.getElementById('alertType').addEventListener('change', function () {
  const speedInput = document.getElementById('speedInput');
  if (this.value === "Overspeed") {
    speedInput.classList.remove('hidden');
  } else {
    speedInput.classList.add('hidden');
  }
});

// عند الضغط على "إنشاء التنبيه"
document.getElementById('generateAlert').addEventListener('click', function () {
  const trackingText = document.getElementById('trackingData').value.trim();
  const alertType = document.getElementById('alertType').value;
  const speedValue = document.getElementById('speedInput').value.trim();
  const alertOutput = document.getElementById('alertOutput');
  const copyBtn = document.getElementById('copyAlert');

  if (!trackingText || !alertType) {
    alert("⚠️ من فضلك أدخل بيانات التتبع واختر نوع التنبيه");
    return;
  }

  // استخراج رقم العربية
  const vehicleMatch = trackingText.match(/^[^\s]+ [^\s]+ [^\s]+/);
  let vehicleName = vehicleMatch ? vehicleMatch[0].trim() : null;

  let clientName = "غير معروف";
  if (vehicleName && vehicleData[vehicleName]) {
    clientName = vehicleData[vehicleName];
  }

  let finalAlert = `🚨 ${alertType}\n`;
  finalAlert += `الشركة: ${clientName}\n`;
  finalAlert += `العربية: ${vehicleName || "غير محدد"}\n`;
  if (alertType === "Overspeed" && speedValue) {
    finalAlert += `السرعة: ${speedValue} كم/س\n`;
  }
  finalAlert += `\n${trackingText}`;

  alertOutput.value = finalAlert;
  copyBtn.classList.remove('hidden');
});

// نسخ التنبيه
document.getElementById('copyAlert').addEventListener('click', function () {
  const output = document.getElementById('alertOutput');
  output.select();
  document.execCommand('copy');
  alert("✅ تم نسخ التنبيه");
});
