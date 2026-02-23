/*
  [시니어 관점] 복잡한 컴포넌트일수록 스토리가 더 중요하다

  Header 는 여러 상태가 존재한다:
  - 메뉴가 있는 경우 / 없는 경우
  - CTA 버튼이 있는 경우 / 없는 경우
  - 특정 메뉴가 활성화된 경우

  이런 조합을 앱에서 일일이 확인하려면 페이지를 바꿔가며 확인해야 한다.
  Storybook 에 미리 만들어두면 클릭 한 번에 모든 상태를 확인할 수 있다.
*/

import type { Meta, StoryObj } from '@storybook/react-vite';
import Header from '../components/ui/Header';

const meta = {
    title: 'UI/Header',
    component: Header,
    tags: ['autodocs'],
    /*
    layout: 'fullscreen'
    기본값은 'padded' (컴포넌트 주변에 여백을 준다).
    Header 처럼 화면 전체 너비를 써야 하는 컴포넌트는 'fullscreen' 으로 설정.
  */
    parameters: {
        layout: 'fullscreen',
    },
    argTypes: {
        title: {
            description: '좌측에 표시될 서비스 이름',
            control: 'text',
        },
        navItems: {
            description: '네비게이션 메뉴 목록',
            control: 'object',
        },
        ctaLabel: {
            description: '우측 버튼 텍스트. 비워두면 버튼이 사라짐',
            control: 'text',
        },
        onCtaClick: {
            description: 'CTA 버튼 클릭 핸들러',
            action: 'ctaClicked',
        },
    },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ────────────────────────────────────────────────────────────
   자주 쓰이는 nav 데이터를 상수로 분리.

   [시니어 관점]
   같은 데이터를 여러 스토리에서 복붙하지 않는다.
   한 곳에 정의하면 나중에 메뉴 이름이 바뀔 때 여기 한 줄만 수정.
──────────────────────────────────────────────────────────── */
const defaultNavItems = [
    { label: '홈', href: '/' },
    { label: '소개', href: '/about' },
    { label: '작업', href: '/work' },
    { label: '연락', href: '/contact' },
];

/* ────────────────────────────────────────────────────────────
   기본 스토리들: 각각의 상태를 독립적으로 보여줌
──────────────────────────────────────────────────────────── */

/** 로고(타이틀)만 있는 가장 단순한 상태 */
export const TitleOnly: Story = {
    name: '타이틀만',
    args: {
        title: '서비스명',
    },
};

/** 네비게이션 메뉴가 추가된 상태 */
export const WithNavigation: Story = {
    name: '네비게이션 포함',
    args: {
        title: '서비스명',
        navItems: defaultNavItems,
    },
};

/** CTA 버튼까지 포함된 가장 일반적인 형태 */
export const WithCTA: Story = {
    name: 'CTA 버튼 포함',
    args: {
        title: '서비스명',
        navItems: defaultNavItems,
        ctaLabel: '시작하기',
    },
};

/* ────────────────────────────────────────────────────────────
   엣지 케이스: 실제 서비스에서 발생할 수 있는 특수 상태들
──────────────────────────────────────────────────────────── */

/** 특정 메뉴가 현재 페이지로 활성화된 상태 */
export const ActiveNavItem: Story = {
    name: '메뉴 활성화 상태',
    args: {
        title: '서비스명',
        navItems: [
            { label: '홈', href: '/', active: false },
            { label: '소개', href: '/about', active: true } /* ← 현재 페이지 */,
            { label: '작업', href: '/work', active: false },
            { label: '연락', href: '/contact', active: false },
        ],
        ctaLabel: '시작하기',
    },
};

/** 메뉴 없이 버튼만 있는 경우 (랜딩 페이지 등) */
export const NoNavWithCTA: Story = {
    name: '메뉴 없이 버튼만',
    args: {
        title: '서비스명',
        ctaLabel: '무료로 시작하기',
    },
};

/** 서비스 이름이 긴 경우 레이아웃이 깨지지 않는지 확인 */
export const LongTitle: Story = {
    name: '긴 서비스명',
    args: {
        title: '이름이 아주 긴 서비스',
        navItems: defaultNavItems,
        ctaLabel: '시작하기',
    },
};
