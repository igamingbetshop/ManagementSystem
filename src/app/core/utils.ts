import * as JsEncryptModule from 'jsencrypt';

const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxDV6Tkh5noY4NWUd5G3q
mdLkhBCRwwG06buiCc34Xyshtc8eRMaLZarHeQpEkPk43f7Xo7UhOekqQ1+/JlZO
rCKRUb8VPdLv/gA9lxzDAJDuSTN8RY0BBJlwNjrP3nrDLIfxAe5OZXxgdwvSi5Rx
nghWaiM7qtrcaAKcnZnoNrHXvouw9CbLEJa92RJjKIUE94GbFozDSM62CokXrKC9
RgcwZfLQijzlgKM90pjLjAlw1Iz/IN3g5k+TqrbHX7zo8I85MIn/1yRyUIGMT3BU
MiPKRkCqVZ1NGPLLsuz4vCe/wA9dmhZxrEAECLEFp6/9PoT9abcIxIYJpV1PhxeG
1wIDAQAB
-----END PUBLIC KEY-----`;

let encryptor: any;

export function encryptData(data) {
  if (!encryptor)
    encryptor = new JsEncryptModule.JSEncrypt(null);

  encryptor.setPublicKey(publicKey);
  const encrypted = encryptor.encrypt(JSON.stringify(data));
  return encrypted;
}

export function getTimeZone() {
  const d = new Date();
  return -1 * d.getTimezoneOffset() / 60;
}

export function isEmpty(value): boolean {
  return Object.keys(value).length === 0 && value.constructor === Object;
}

export function formattedNumber(value: number) {
  return value.toLocaleString('en', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).replace(/,/g, ' ');
}

export function compressImage(imgToCompress, resizingFactor):any
{
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  const originalWidth = imgToCompress.width;
  const originalHeight = imgToCompress.height;

  const canvasWidth = originalWidth * resizingFactor;
  const canvasHeight = originalHeight * resizingFactor;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  context.drawImage(
    imgToCompress,
    0,
    0,
    originalWidth * resizingFactor,
    originalHeight * resizingFactor
  );
  return canvas;
}



