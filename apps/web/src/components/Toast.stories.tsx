import type { Meta, StoryObj } from '@storybook/react';
import Toast from './Toast';

const meta = {
    title: 'Components/Toast',
    component: Toast,
    decorators: [
        (Story) => (
            <div className="p-8 bg-gray-50 flex justify-center">
                <Story />
            </div>
        ),
    ],
    tags: ['autodocs'],
    argTypes: {
        type: {
            control: 'select',
            options: ['success', 'error'],
        },
    },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
    args: {
        message: 'Operação realizada com sucesso!',
        type: 'success',
    },
};

export const Error: Story = {
    args: {
        message: 'Ocorreu um erro. Por favor, tente novamente.',
        type: 'error',
    },
};

export const LongMessage: Story = {
    args: {
        message: 'Esta é uma mensagem muito longa para testar como o componente se comporta com texto extenso.',
        type: 'success',
    },
};
