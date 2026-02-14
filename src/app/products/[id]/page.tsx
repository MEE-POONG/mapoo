import { Metadata } from 'next';
import ProductDetailClient from './ProductDetailClient';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

interface Props {
    params: { id: string };
}

async function getProduct(id: string) {
    const product = await prisma.product.findUnique({
        where: { id },
        include: { reviews: true }
    });
    return product;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const product = await getProduct(params.id);
    if (!product) return {};

    return {
        title: `${product.name} | SiamSausage`,
        description: product.description.slice(0, 160),
        openGraph: {
            title: product.name,
            description: product.description,
            images: [product.imageUrl],
        },
    };
}

export default async function Page({ params }: Props) {
    const product = await getProduct(params.id);
    if (!product) notFound();

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.imageUrl,
        description: product.description,
        sku: product.id,
        offers: {
            '@type': 'Offer',
            url: `https://siamsausage.com/products/${product.id}`,
            priceCurrency: 'THB',
            price: product.price,
            availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        },
        aggregateRating: product.reviews.length > 0 ? {
            '@type': 'AggregateRating',
            ratingValue: product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length,
            reviewCount: product.reviews.length,
        } : undefined,
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ProductDetailClient params={params} initialProduct={product} />
        </>
    );
}
