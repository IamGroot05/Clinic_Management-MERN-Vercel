
export function generateNewUUID() {
  const genUUIDv4 = () =>
    "axxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });

  return genUUIDv4();
}

export function isNullOrUndef(obj: any) {
  return obj === null || obj === undefined;
}

export function getStr(data: any): string {
  return (data as string)?.toString()?.trim();
}

export function getStrLower(data: any): string {
  return getStr(data)?.toLowerCase();
}

export function strCmp(str1: any, str2: any): boolean {
  return getStrLower(str1) === getStrLower(str2);
}

export function isPropEmpty(val: any): boolean {
  return (
    isNullOrUndef(val) ||
    (typeof val === 'number' && val < 0) ||
    (typeof val === 'string' && !val?.trim()?.length) ||
    (Array.isArray(val) && !val?.filter(Boolean)?.length) ||
    (typeof val === 'object' && Object.keys(val).length === 0) ||
    (typeof val === 'boolean' && val !== true && _.isEmpty(val))
  );
}

export function getHashedString(str: string) {
  return new jssha.default('SHA-512', 'TEXT').update(str).getHash('HEX');
}

export function handleEmptyValue(val: any): any {
  if (isPropEmpty(val)) {
    return '―';
  } else {
    return val;
  }
}

export function convertMsIntoDayHrMinFormat(ms: number) {
  if (isPropEmpty(ms)) {
    return;
  }

  const totalDayMS = 24 * 60 * 60 * 1000;
  const totalHrMS = 60 * 60 * 1000;
  const totalMinMS = 60 * 1000;
  const totalSecMS = 1000;

  // let day = Math.floor(ms / totalDayMS);
  let hr = Math.floor(ms / totalHrMS);
  let min = Math.floor((ms - hr * totalHrMS) / totalMinMS);
  let sec = Math.abs(Math.ceil((ms - hr * totalHrMS - min * totalMinMS) / totalSecMS));

  if (sec === 60) {
    min++;
    sec = 0;
  }

  if (min === 60) {
    hr++;
    min = 0;
  }

  // if (hr === 24) {
  //   day++;
  //   hr = 0;
  // }
  const paddedStr = (time: number) => time.toString().padStart(2, '0');

  return `${paddedStr(hr)}:${paddedStr(min)}:${paddedStr(sec)}`;
}

//only on mobile and tablet
export function onlyMobileAndTablet(): boolean {
  return window.innerWidth < 1024;
}

// Get date and time from timestamp
export function getDateTime(timeStamp: number): { date: string; time: string } {
  const dateTime = new Date(timeStamp);

  const year = dateTime?.getFullYear();
  const month = dateTime?.toLocaleString('default', { month: 'short' }).toUpperCase();
  const day = dateTime?.getDate();
  const hr = dateTime?.getHours();
  const min = dateTime?.getMinutes();

  const date = `${day}-${month}-${year}`;
  const time = `${hr}:${min}`;

  return { date, time };
}

// Function to extract value inside parentheses
export function extractValueInsideParentheses(inputString:string): string {
  const startIndex = inputString.indexOf('(');
  const endIndex = inputString.indexOf(')');
  if (startIndex !== -1 && endIndex !== -1) {
    return inputString.substring(startIndex + 1, endIndex);
  }
  return ''; // Return empty string if parentheses are not found
}

export function calculateCountDifference(total, current) {
  // Calculate the difference
  const difference = current - total;

  // Determine if there is an excess or shortfall
  if (difference > 0) {
      return `${difference}(E)`; // Exceeds total
  } else if (difference < 0) {
      return `${Math.abs(difference)}(S)`; // Short of total
  } else {
      return '00'; // No difference
  }
}


export function getUrlLastSegment(url): string {
  // Split the URL into segments
  const parts = url.split('/').filter(part => part.length > 0);
  
  // Return the last segment
  return parts.length > 0 ? `${parts[parts.length - 1]}` : '';
}

export function getModuleFromUrl(url): string {
  // Split the URL into segments
  const parts = url.split('/').filter(part => part.length > 0);
  
  // Return the module
  return parts.length > 0 ? `${parts[0]}` : '';
}
