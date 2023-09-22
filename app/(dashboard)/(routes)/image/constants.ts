import * as z from 'zod';

export const formSchema = z.object({
    prompt: z.string().min(1, {
        message: "Image Prompt is Required"
    }),
    amount: z.string().min(1),
    resolution: z.string().min(1),
});

export const amountOptions = [
    {
        label: "1 image",
        value: "1"
    },
    {
        label: "2 images",
        value: "2"
    },
    {
        label: "3 images",
        value: "3"
    },
    {
        label: "4 images",
        value: "4"
    }
];

export const resolutionOptions = [
    {
        label: "256x256",
        value: "256x256"
    },
    {
        label: "512x512",
        value: "512x512"
    },
    {
        label: "1024x1024",
        value: "1024x1024"
    },
    {
        label: "2048x2048",
        value: "2048x2048"
    }
];