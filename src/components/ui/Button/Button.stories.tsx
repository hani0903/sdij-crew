import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta = {
    title: 'Components/Button',
    component: Button,
    tags: ['autodocs'], // argTable 자동 생성
    argTypes: {
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
        },
        size: {
            control: 'radio',
            options: ['sm', 'md', 'lg'],
        },
    },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { children: 'Button', variant: 'primary', size: 'md' },
};

export const Loading: Story = {
    args: { children: '저장 중...', isLoading: true },
};

export const Disabled: Story = {
    args: { children: 'Button', disabled: true },
};

// 모든 variant
export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-wrap gap-3">
            {(['primary', 'secondary', 'outline', 'ghost', 'danger'] as const).map((v) => (
                <Button key={v} variant={v}>
                    {v}
                </Button>
            ))}
        </div>
    ),
};

// 모든 size
export const AllSizes: Story = {
    render: () => (
        <div className="flex items-center gap-3">
            {(['sm', 'md', 'lg'] as const).map((s) => (
                <Button key={s} size={s}>
                    {s}
                </Button>
            ))}
        </div>
    ),
};
