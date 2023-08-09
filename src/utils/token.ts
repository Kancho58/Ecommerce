export function createOtp(): string {
  const text = '0123456789';
  let OTP = '';
  const len = text.length;
  for (let i = 0; i < 6; i++) {
    OTP += text[Math.floor(Math.random() * len)];
  }
  return OTP;
}

export function isTokenExpired(createdAt: string): boolean {
  const now: any = Date.now();
  const codeSentDate: any = new Date(createdAt);
  const differenceInMs = now - codeSentDate;
  const differenceInMinutes = differenceInMs / 60000;

  if (differenceInMinutes > 60) {
    return true;
  }

  return false;
}
