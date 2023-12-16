
var fulldays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const formatDate = (someDateTimeStamp: number) => {
  var dt = new Date(someDateTimeStamp),
    date = dt.getDate(),
    month = months[dt.getMonth()],
    timeDiff = someDateTimeStamp - Date.now(),
    diffDays = new Date().getDate() - date,
    diffMonths = new Date().getMonth() - dt.getMonth(),
    diffYears = new Date().getFullYear() - dt.getFullYear();

  if (diffYears === 0 && diffDays === 0 && diffMonths === 0) {
    return "today";
  } else if (diffYears === 0 && diffDays === 1) {
    return "yesterday";
  } else if (diffYears === 0 && diffDays === -1) {
    return "tomorrow";
  } else if (diffYears === 0 && (diffDays < -1 && diffDays > -7)) {
    return fulldays[dt.getDay()];
  } else if (diffYears >= 1) {
    return month + " " + date + ", " + new Date(someDateTimeStamp).getFullYear();
  } else {
    return month + " " + date;
  }
}

function formatTime(ms: number) {
  return new Date(ms).toTimeString().substring(0, 5)
}


const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

const hexToRGB = (hex: string) => {
  let alpha = false,
    h = hex.slice(hex.startsWith('#') ? 1 : 0);
  if (h.length === 3) h = [...(h as any)].map(x => x + x).join('');
  else if (h.length === 8) alpha = true;
  let h2 = parseInt(h, 16);
  return {
    r: (h2 >>> (alpha ? 24 : 16)),
    g: ((h2 & (alpha ? 0x00ff0000 : 0x00ff00)) >>> (alpha ? 16 : 8)),
    b: ((h2 & (alpha ? 0x0000ff00 : 0x0000ff)) >>> (alpha ? 8 : 0))
  }
};

export default {
  formatDate,
  formatTime,
  formatBytes,
  hexToRGB
}
