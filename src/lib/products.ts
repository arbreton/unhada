export interface Product {
    id: string;
    name: string;
    price: number; // in cents
    description: string;
    longDescription: string;
    downloadUrl: string; // [NEW] Added for dynamic delivery
    upsell?: {
        id: string;
        name: string;
        price: number; // in cents
        description: string;
        downloadUrl: string; // [NEW] Upsells also need downloads
    };
}

export const products: Product[] = [
    {
        id: 'astral-chart',
        name: 'Tu Carta Astral & Biohacking',
        price: 1500, // $15.00
        description: 'Sincroniza tu dieta con tus tránsitos.',
        longDescription: 'Descubre cómo los astros influyen en tu biología. Esta guía personalizada te enseña a comer y entrenar según tu carta natal. Incluye protocolo de sueño y suplementación basica.',
        downloadUrl: 'https://example.com/carta-astral-biohacking.pdf',
        upsell: {
            id: 'meditation-audio',
            name: 'Audio de Meditación Guiada',
            price: 500, // $5.00
            description: 'Potencia tu lectura con una meditación de 15 min para integrar la información.',
            downloadUrl: 'https://example.com/meditacion-guiada.mp3'
        }
    },
    {
        id: 'self-love-ritual',
        name: 'Rituales de Amor Propio',
        price: 0, // Free
        description: 'Guía de 7 días para conectar contigo.',
        longDescription: 'Un viaje de una semana a través de los espejos del alma. Cada día incluye un ejercicio de escritura, una infusión recomendada y una afirmación de poder.',
        downloadUrl: 'https://example.com/rituales-amor-propio.pdf'
    }
];

// Helper to look up download URL by Product ID
export function getProductDownloadUrl(productId: string): string | null {
    for (const p of products) {
        if (p.id === productId) return p.downloadUrl;
        if (p.upsell && p.upsell.id === productId) return p.upsell.downloadUrl;
    }
    return null;
}
