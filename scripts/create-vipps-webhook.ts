import { createWebhook } from '@/lib/vipps'

createWebhook()
    .then((webhook) => {
        console.log(webhook);
    })
    .catch((error) => {
        console.error(error);
    })
    