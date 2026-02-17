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
    title: 'BMW Série 3 320d',
    brand: 'BMW',
    model: 'Série 3',
    year: 2020,
    price: 35000,
    fuel_type: 'Diesel',
    transmission: 'Automática',
    mileage: 45000,
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
            title: 'Mercedes-Benz Classe C 220d AMG',
            brand: 'Mercedes-Benz',
            model: 'Classe C',
            price: 42000,
        },
    },
};

export const ExternalLink: Story = {
    args: {
        listing: {
            ...baseListing,
            external_url: 'https://example.com/car',
            source_name: 'StandVirtual',
        },
    },
};

export const LowMileage: Story = {
    args: {
        listing: {
            ...baseListing,
            title: 'Audi A4 2.0 TDI',
            brand: 'Audi',
            model: 'A4',
            year: 2022,
            price: 38000,
            mileage: 5000,
            location: 'Porto',
        },
    },
};
