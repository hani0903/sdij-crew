/*
  [시니어 관점] Header 같은 레이아웃 컴포넌트의 설계 원칙

  Header 는 여러 페이지에 공통으로 쓰이는 컴포넌트다.
  그래서 내부에 특정 페이지의 내용을 하드코딩하면 안 된다.

  나쁜 예: <header><span>홈</span><span>소개</span><span>연락</span></header>
    → 메뉴가 바뀔 때마다 이 파일을 열어서 수정해야 함.

  좋은 예: 메뉴 목록을 props 로 받아서 렌더링
    → 사용하는 쪽에서 데이터만 바꾸면 된다. Header 는 건드리지 않아도 됨.

  이것을 "데이터와 UI 의 분리" 라고 한다.
*/

import Button from './Button';

/* ─── 타입 정의 ──────────────────────────────────────────────────
  NavItem: 네비게이션 메뉴 하나의 데이터 구조.
  배열로 만들어서 props 로 넘기면 메뉴 개수가 몇 개든 동작한다.
*/
export interface NavItem {
    /** 메뉴에 표시될 텍스트 */
    label: string;
    /** 이동할 경로 */
    href: string;
    /** 현재 페이지 여부. 활성화 스타일 적용에 사용 */
    active?: boolean;
}

export interface HeaderProps {
    /** 좌측에 표시될 서비스 이름 */
    title: string;
    /** 네비게이션 메뉴 목록. 없으면 메뉴 영역 미표시 */
    navItems?: NavItem[];
    /** 우측 CTA 버튼 텍스트. 없으면 버튼 미표시 */
    ctaLabel?: string;
    /** CTA 버튼 클릭 핸들러 */
    onCtaClick?: () => void;
}

export default function Header({ title, navItems, ctaLabel, onCtaClick }: HeaderProps) {
    return (
        /*
      [왜 <header> 태그를 쓰나?]
      <div> 대신 <header> 를 쓰면 스크린리더(시각장애인 보조 기술)가
      "이 영역이 헤더입니다" 라고 알 수 있다.
      이를 시맨틱(Semantic) HTML 이라고 부른다.
    */
        <header className="w-full border-b-1 border-gray-2 bg-white flex items-center py-5">
            <div className="flex w-full items-center justify-between px-6 gap-8">
                {/* 좌측: 서비스 이름 */}
                <span className="inline-block font-pretendard text-20 font-bold text-black">{title}</span>

                {/* 중앙: 네비게이션 메뉴 */}
                {/*
          [왜 navItems?.length 로 체크하나?]
          navItems 가 undefined 이거나 빈 배열([])일 때 모두 숨긴다.
          navItems 만 체크하면 빈 배열일 때 빈 <nav> 태그가 남는다.
        */}
                {navItems && navItems.length > 0 && (
                    <nav>
                        <ul className="flex items-center gap-6 list-none">
                            {navItems.map((item) => (
                                <li key={item.href}>
                                    <a
                                        href={item.href}
                                        className={[
                                            'font-pretendard text-14 transition-colors duration-150 no-underline',
                                            /*
                        active 여부에 따라 다른 스타일 적용.
                        삼항연산자는 조건이 단순할 때만 사용.
                        조건이 복잡해지면 variantClasses 패턴으로 분리할 것.
                      */
                                            item.active
                                                ? 'font-semibold text-point'
                                                : 'font-regular text-gray-4 hover:text-black',
                                        ].join(' ')}
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                )}

                {/* 우측: CTA 버튼 */}
                {/*
          ctaLabel 이 있을 때만 버튼을 렌더링.
          없으면 빈 div 로 justify-between 레이아웃 균형을 유지.
        */}
                {ctaLabel ? <Button variant="ghost" label={ctaLabel} size="sm" onClick={onCtaClick} /> : <div />}
            </div>
        </header>
    );
}
