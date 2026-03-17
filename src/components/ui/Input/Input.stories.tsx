import type { Meta, StoryObj } from '@storybook/react-vite';
import { Search, Eye } from 'lucide-react';
import FormField from '../FormField';
import Input from './Input';

const meta = {
    title: 'Components/Input',
    component: Input,
    tags: ['autodocs'],
    argTypes: {
        variant: { control: 'radio', options: ['default', 'error'] },
        disabled: { control: 'boolean' },
    },
    args: { placeholder: '입력해주세요' },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Error: Story = {
    args: { variant: 'error' },
};

export const Disabled: Story = {
    args: { disabled: true, value: 'disabled value' },
};

export const WithLeftAdornment: Story = {
    args: {
        leftAdornment: <Search size={16} />,
        placeholder: '검색어를 입력하세요',
    },
};

export const WithRightAdornment: Story = {
    args: {
        type: 'password',
        rightAdornment: <Eye size={16} />,
        placeholder: '비밀번호',
    },
};

// FormField와 실제 조합 — 실사용 맥락 확인용
export const WithFormField: Story = {
    render: () => (
        <div className="flex flex-col gap-4 w-80">
            <FormField label="이름" htmlFor="name">
                <Input id="name" placeholder="홍길동" />
            </FormField>
            <FormField label="이메일" htmlFor="email">
                <Input id="email" type="email" leftAdornment={<Search size={16} />} placeholder="example@email.com" />
            </FormField>
            <FormField label="비밀번호" htmlFor="pw">
                <Input
                    id="pw"
                    type="password"
                    rightAdornment={<Eye size={16} />}
                    variant="error"
                    placeholder="비밀번호 입력"
                />
            </FormField>
        </div>
    ),
};
