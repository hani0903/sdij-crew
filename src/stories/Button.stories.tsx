/*
  ┌─────────────────────────────────────────────────────────────┐
  │  [시니어 관점] Storybook 이란 무엇인가?                         │
  │                                                             │
  │  "컴포넌트를 앱에 붙이기 전에, 독립적으로 실행해보는 환경"         │
  │                                                             │
  │  스토리(Story) = 컴포넌트의 특정 상태 하나.                      │
  │  예) 버튼 컴포넌트에 variant="primary", size="md" 인 상태        │
  │                                                             │
  │  좋은 스토리의 기준:                                           │
  │  - 컴포넌트의 모든 상태를 빠짐없이 보여준다                       │
  │  - 이름만 봐도 어떤 상태인지 알 수 있다                          │
  │  - 실제로 쓰이는 조합을 보여준다 (AllVariants 같은 것)            │
  └─────────────────────────────────────────────────────────────┘
*/

import type { Meta, StoryObj } from '@storybook/react-vite';
import Button from '../components/ui/Button';

/*
  Meta: "이 스토리 파일이 어떤 컴포넌트를 다루는지" 설정하는 객체.

  title: Storybook 사이드바에서 보이는 경로.
    'UI/Button' → UI 폴더 안의 Button 으로 표시됨.

  component: 실제 React 컴포넌트.

  tags: ['autodocs'] → props 목록과 설명을 자동으로 페이지로 만들어줌.

  argTypes: Storybook Controls 패널에서 props 를 어떻게 조작할지 설정.
    control: 'select' → 드롭다운으로 선택
    control: 'boolean' → 체크박스로 토글
    control: 'text' → 텍스트 입력창
*/
const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      description: '버튼의 시각적 스타일',
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
    },
    size: {
      description: '버튼의 크기',
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      description: '비활성화 여부',
      control: 'boolean',
    },
    label: {
      description: '버튼 텍스트',
      control: 'text',
    },
    onClick: {
      description: '클릭 이벤트 핸들러',
      action: 'clicked',  /* Storybook Actions 패널에 클릭 로그를 찍어줌 */
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

/*
  StoryObj: 각 스토리의 타입.
  args 에 넣은 값이 컴포넌트의 props 로 전달된다.
*/
type Story = StoryObj<typeof meta>;

/* ────────────────────────────────────────────────────────────
   기본 스토리: 각 variant 하나씩
   Storybook 에서 Controls 패널로 props 를 직접 바꿔볼 수 있다.
──────────────────────────────────────────────────────────── */

export const Primary: Story = {
  args: {
    label: '확인',
    variant: 'primary',
    size: 'md',
  },
};

export const Secondary: Story = {
  args: {
    label: '취소',
    variant: 'secondary',
    size: 'md',
  },
};

export const Ghost: Story = {
  args: {
    label: '더 보기',
    variant: 'ghost',
    size: 'md',
  },
};

/* ────────────────────────────────────────────────────────────
   엣지 케이스(Edge Case): 반드시 확인해야 하는 특수 상태들.

   [시니어 관점]
   주니어들이 자주 놓치는 것 → disabled, 긴 텍스트, 아이콘 조합 등.
   스토리에 없으면 나중에 QA 에서 발견된다.
──────────────────────────────────────────────────────────── */

export const Disabled: Story = {
  args: {
    label: '처리 중...',
    variant: 'primary',
    disabled: true,
  },
};

export const LongLabel: Story = {
  name: '긴 텍스트',
  args: {
    label: '이 버튼은 텍스트가 매우 길 경우에도 올바르게 표시됩니다',
    variant: 'primary',
    size: 'md',
  },
};

/* ────────────────────────────────────────────────────────────
   조합 스토리: render 함수로 여러 상태를 한 번에 보여줌.

   [시니어 관점]
   디자이너/기획자에게 보여줄 때 이런 조합 스토리가 있으면
   한 화면에서 전체 디자인 시스템을 검토할 수 있다.
──────────────────────────────────────────────────────────── */

export const AllVariants: Story = {
  name: '모든 변형',
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <Button label="Primary"   variant="primary" />
      <Button label="Secondary" variant="secondary" />
      <Button label="Ghost"     variant="ghost" />
    </div>
  ),
};

export const AllSizes: Story = {
  name: '모든 크기',
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <Button label="Small"  size="sm" />
      <Button label="Medium" size="md" />
      <Button label="Large"  size="lg" />
    </div>
  ),
};

export const AllDisabledVariants: Story = {
  name: '비활성화 상태 전체',
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <Button label="Primary"   variant="primary"   disabled />
      <Button label="Secondary" variant="secondary" disabled />
      <Button label="Ghost"     variant="ghost"     disabled />
    </div>
  ),
};
