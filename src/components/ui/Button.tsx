/*
  ┌─────────────────────────────────────────────────────────────┐
  │  [시니어 관점] 좋은 컴포넌트의 기준                             │
  │                                                             │
  │  1. props 타입이 명확하다 → 사용하는 사람이 틀릴 수 없게         │
  │  2. 변형(variant)과 크기(size)를 props로 분리한다              │
  │     → 버튼의 색상과 크기는 독립적으로 바꿀 수 있어야 함           │
  │  3. 스타일 로직이 컴포넌트 바깥에 있다                          │
  │     → JSX가 깔끔해지고 스타일만 테스트하기도 쉬워짐              │
  │  4. disabled 상태를 반드시 처리한다                            │
  │     → 상태를 빠뜨리면 나중에 버그가 된다                        │
  └─────────────────────────────────────────────────────────────┘
*/

/*
  [왜 이렇게 타입을 쓰나?]

  type ButtonVariant = 'primary' | 'secondary' | 'ghost'

  이렇게 하면 Button variant="primar" 처럼 오타를 쳐도
  TypeScript가 빨간 줄로 바로 잡아준다.
  string 으로만 쓰면 아무 값이나 들어와서 런타임에서야 버그를 발견한다.
*/
type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
    /** 버튼 안에 표시될 텍스트 */
    label: string;
    /** 버튼 종류. 기본값: 'primary' */
    variant?: ButtonVariant;
    /** 버튼 크기. 기본값: 'md' */
    size?: ButtonSize;
    /** 비활성화 여부 */
    disabled?: boolean;
    /** 클릭 이벤트 핸들러 */
    onClick?: () => void;
}

/*
  [왜 스타일을 컴포넌트 밖에 꺼냈나?]

  컴포넌트 안에 if/else 나 삼항연산자로 클래스를 조합하면
  JSX가 지저분해지고 읽기 어렵다.

  Record<ButtonVariant, string> 은
  "ButtonVariant 의 모든 값에 대해 string 을 가진 객체" 라는 타입.
  → primary/secondary/ghost 중 하나라도 빠뜨리면 TypeScript 오류 발생.
  → 나중에 variant 추가할 때 여기만 수정하면 된다.
*/
const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-point disabled:bg-gray-3 disabled:opacity-100 text-white hover:opacity-90 active:opacity-80',
    secondary: 'bg-gray-1 text-black hover:bg-gray-2 active:bg-gray-2',
    ghost: 'bg-transparent border border-gray-3 text-black hover:bg-gray-1 active:bg-gray-2',
};

const sizeClasses: Record<ButtonSize, string> = {
    sm: 'text-12 font-medium px-5 py-3 rounded-md', // 반영 완료
    md: 'text-14 font-medium px-8 py-[18px] rounded-md', // 반영 완료
    lg: 'text-20 px-6 py-3 rounded-xl',
};

export default function Button({ label, variant = 'primary', size = 'md', disabled = false, onClick }: ButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={[
                /*
          [왜 배열로 합치나?]
          템플릿 리터럴(백틱) 으로 여러 줄 이어붙이면
          중간에 공백이 생겨서 클래스가 깨질 수 있다.
          배열 + join(' ') 이 더 안전하다.
        */
                'font-pretendard font-medium',
                'transition-all duration-150 cursor-pointer',
                'disabled:opacity-40 disabled:cursor-not-allowed',
                variantClasses[variant],
                sizeClasses[size],
            ].join(' ')}
        >
            {label}
        </button>
    );
}
