import webpush from 'web-push';
const vapidKeys = webpush.generateVAPIDKeys();
console.log('Public:', vapidKeys.publicKey);
console.log('Private:', vapidKeys.privateKey);
