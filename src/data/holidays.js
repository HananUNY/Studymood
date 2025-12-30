// Simple Indonesian Holidays Map for 2025
// Format: "Month-Day": "Holiday Name" (Month is 0-indexed: 0=Jan, 11=Dec)

export const HOLIDAYS_2025 = {
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

export const getHoliday = (date) => {
    if (!date) return null
    const key = `${date.getMonth()}-${date.getDate()}`
    return HOLIDAYS_2025[key] || null
}
