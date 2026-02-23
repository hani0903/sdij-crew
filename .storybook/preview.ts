/*
  [시니어 관점] Storybook 에 CSS 가 적용되지 않는 문제

  Storybook 은 앱과 별도의 환경에서 실행된다.
  따라서 main.tsx 에서 import 한 CSS 는 Storybook 에서 보이지 않는다.
  여기서 직접 import 해줘야 Tailwind 클래스와 디자인 토큰이 적용된다.
*/
import '../src/index.css';
import type { Preview } from '@storybook/react-vite'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};

export default preview;