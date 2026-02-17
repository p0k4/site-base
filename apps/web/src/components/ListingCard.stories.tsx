import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import ListingCard, { Listing } from './ListingCard';

const meta = {
    title: 'Components/ListingCard',
    component: ListingCard,
    decorators: [
        (Story) => (
            <BrowserRouter>
                <div className="p-8 bg-gray-50">
                    <div className="max-w-sm">
                        <Story />
                    </div>
                </div>
            </BrowserRouter>
        ),
    ],
    tags: ['autodocs'],
} satisfies Meta<typeof ListingCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseListing: Listing = {
    id: '1',
    title: 'Pack de templates premium',
    category: 'Templates',
    item_condition: 'Novo',
    price: 490,
    location: 'Lisboa',
};

export const Default: Story = {
    args: {
        listing: baseListing,
    },
};

export const WithImage: Story = {
    args: {
        listing: {
            ...baseListing,
            cover_image_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400',
        },
    },
};

export const Featured: Story = {
    args: {
        listing: {
            ...baseListing,
            is_featured: true,
            title: 'Kit de onboarding enterprise',
            category: 'Recursos',
            item_condition: 'Atualizado',
            price: 1290,
        },
    },
};

export const ExternalLink: Story = {
    args: {
        listing: {
            ...baseListing,
            external_url: 'https://example.com/resource',
            source_name: 'Marketplace parceiro',
        },
    },
};

export const RemoteExample: Story = {
    args: {
        listing: {
            ...baseListing,
            title: 'Modelo de contrato digital',
            category: 'Documentos',
            item_condition: 'Usado',
            price: 290,
            location: 'Porto',
        },
    },
};
