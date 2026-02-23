import type { Meta, StoryObj } from '@storybook/react-vite';
import Logo from '../components/ui/Logo';

const meta = {
    title: 'Logo',
    component: Logo,
    tags: ['autodocs'],
    parameters: {
        backgrounds: {
            default: 'white',
            values: [
                { name: 'white', value: '#FFFFFF' },
                { name: 'black', value: '#1e1e1e' },
            ],
        },
    },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dark: Story = {
    parameters: {
        backgrounds: { default: 'black' },
    },
    args: {
        // Logo 컴포넌트의 props가 있다면 여기에 작성
        // 예: size: 'medium'
        invert: false,
    },
};

export const Light: Story = {
    parameters: {
        backgrounds: { default: 'white' },
    },
    args: {
        // Logo 컴포넌트의 props가 있다면 여기에 작성
        // 예: size: 'medium'
        invert: true,
    },
};
