// Indonesian Holidays Map
// Format: "Month-Day": "Holiday Name" (Month is 0-indexed: 0=Jan, 11=Dec)

const HOLIDAYS_2025 = {
    "0-1": "Tahun Baru Masehi",
    "0-27": "Isra Mi'raj",
    "0-29": "Tahun Baru Imlek",
    "2-29": "Hari Suci Nyepi",
    "2-31": "Idul Fitri 1446H",
    "3-1": "Idul Fitri 1446H",
    "4-1": "Hari Buruh",
    "4-12": "Hari Waisak",
    "4-29": "Kenaikan Isa Al Masih",
    "5-1": "Hari Lahir Pancasila",
    "5-6": "Idul Adha 1446H",
    "6-27": "Tahun Baru Islam",
    "7-17": "HUT RI ke-80 🇮🇩",
    "8-5": "Maulid Nabi",
    "11-25": "Hari Raya Natal"
}

const HOLIDAYS_2026 = {
    "0-1": "Tahun Baru Masehi",
    "0-16": "Isra Mi'raj",
    "1-17": "Tahun Baru Imlek",
    "2-19": "Hari Suci Nyepi",
    "2-21": "Idul Fitri 1447 H",
    "2-22": "Idul Fitri 1447 H",
    "3-3": "Wafat Yesus Kristus",
    "3-5": "Kebangkitan Yesus Kristus",
    "4-1": "Hari Buruh",
    "4-14": "Kenaikan Yesus Kristus",
    "4-27": "Idul Adha 1447 H",
    "4-31": "Hari Raya Waisak",
    "5-1": "Hari Lahir Pancasila",
    "5-16": "Tahun Baru Islam",
    "7-17": "HUT RI ke-81 🇮🇩",
    "7-25": "Maulid Nabi",
    "11-25": "Hari Raya Natal"
}

export const getHoliday = (date) => {
    if (!date) return null
    const year = date.getFullYear()
    const key = `${date.getMonth()}-${date.getDate()}`

    if (year === 2026) return HOLIDAYS_2026[key] || null
    if (year === 2025) return HOLIDAYS_2025[key] || null

    return null
}
