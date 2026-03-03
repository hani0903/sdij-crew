import { createFileRoute, useNavigate } from '@tanstack/react-router';
import CheckIcon from './../../assets/icons/check.svg?react';
import BreakFastImg from './../../assets/images/breakfast-setting.jpg';
import LeftArrowIcon from './../../assets/icons/ic-left-arrow.svg?react';

export const Route = createFileRoute('/docs/pre-first-period-tasks')({
    component: RouteComponent,
});

const TOC_ITEMS = [
    { id: 'classroom-setup', label: '강의실 세팅하기' },
    { id: 'breakfast-setup', label: '조식 세팅하기' },
    { id: 'jog-setup', label: '조그 세팅하기' },
    { id: 'lounge-setup', label: '강사 대기실 세팅하기' },
];

function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

function RouteComponent() {
    const navigate = useNavigate();
    return (
        <main className="w-full h-full flex flex-col">
            {/* <ul className="w-full flex items-center p-2">
                <li>
                    <button className="p-3 font-bold text-xs">1. 강의실 세팅</button>
                </li>
                <li>
                    <button className="p-3 font-bold text-xs">2. 조식 세팅</button>
                </li>
                <li>
                    <button className="p-3 font-bold text-xs">3. 조그 세팅</button>
                </li>
                <li>
                    <button className="p-3 font-bold text-xs">4. 현판 세팅</button>
                </li>
                <li>
                    <button className="p-3 font-bold text-xs">5. 지우개 세팅</button>
                </li>
            </ul> */}
            <section className="w-full flex flex-col p-5 flex-1 gap-6">
                <div className="w-full flex flex-col gap-5">
                    <h2 className="font-bold text-3xl flex items-center gap-5">
                        <button type="button" onClick={() => navigate({ to: '..' })} className="cursor-pointer">
                            <LeftArrowIcon className="size-5" />
                        </button>
                        1교시 시작 전 할 일
                    </h2>

                    <p className="text-[#475569] break-keep">
                        1교시 입실 시작 시간인 8시 10분 이전에 끝내야 할 일들입니다.
                    </p>

                    <div className="w-full flex rounded-r-lg bg-point/5">
                        <div className="h-full w-2 bg-point rounded-l-lg" />
                        <div className="flex flex-1 flex-col p-4 gap-2">
                            <span className="text-point font-bold text-sm">목차</span>
                            <ol className="list-none space-y-1">
                                {TOC_ITEMS.map((item, i) => (
                                    <li key={item.id}>
                                        <button
                                            onClick={() => scrollToSection(item.id)}
                                            className="text-[#334155] font-regular text-sm hover:text-point transition-colors text-left"
                                        >
                                            {i + 1}. {item.label}
                                        </button>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>

                <article id="classroom-setup" className="w-full flex flex-col gap-4">
                    <h3 className="text-[#0F172A] text-xl font-bold flex items-baseline gap-2 leading-normal">
                        <span className="text-[#CBD5E1]">#</span> 강의실 세팅하기
                    </h3>
                    <p className="text-[#334155] text-base font-regular">
                        출근하면 각자 한 개의 강의실을 맡아서 세팅합니다. 강의실을 세팅할 때는 해당 교실 첫 수업
                        선생님의 [세팅 요청사항]을 참고하여 분필과 지우개를 세팅합니다.
                    </p>

                    <img />

                    <p className="text-[#334155] text-base font-regular">
                        앰프를 켜고 가장 얇은 선이 꽂힌 열의 볼륨만 최대로 올려두고 나머지는 다 0으로 세팅합니다.
                        파란색을 각각 9시/9시/7시 방향으로 돌립니다. 맨 오른쪽 마이크 볼륨(빨간색 두 개)은 최대로
                        해둡니다. 마이크 배터리를 교체 후 마이크 테스트를 진행합니다.
                    </p>

                    <img />

                    <p className="text-[#334155] text-base font-regular">
                        칠판, 마이크 세팅을 완료하면 아래 체크리스트를 확인합니다
                    </p>

                    <ul className="text-base font-regular text-[#334155] p-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]">
                        <li className="flex items-center gap-3">
                            <CheckIcon className="size-4" /> <span>냉장고에 물 8개 채우기</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <CheckIcon /> <span>교탁 옆에 물 2개 올리기</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <CheckIcon /> <span>물티슈 1/3 이하로 남은 경우 교체하기</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <CheckIcon /> <span>티비, 공기청정기 켜기</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <CheckIcon /> <span>피피티 쓰시는 선생님의 경우 빔 켜두기</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <CheckIcon className="size-4 shrink-0" />{' '}
                            <span className="flex-wrap break-keep">
                                교탁 위에 마이크(학원 마이크 쓰시는 경우)/에어컨 리모컨/포인터(피피티 있는 경우)
                                세팅하기
                            </span>
                        </li>
                    </ul>

                    <p className="text-[#334155] text-base font-regular">
                        체크 리스트를 모두 완료했으면, 본인이 세팅한 교실 앞의 입실자료를 확인하고 사진 찍어 잔디에
                        올립니다.
                    </p>
                </article>

                <hr className="text-[#dae0e8]" />

                <article id="breakfast-setup" className="w-full flex flex-col gap-4">
                    <h3 className="text-[#0F172A] text-xl font-bold flex items-baseline gap-2 leading-normal">
                        <span className="text-[#CBD5E1]">#</span> 조식 세팅하기
                    </h3>
                    <ol className="text-base font-regular text-[#334155] p-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] list-none space-y-2">
                        <li className="flex gap-3">
                            <span className="shrink-0 font-bold text-point">①</span>
                            <span className="flex-wrap break-keep">
                                <strong>명단 확인:</strong> [잔디 주중조교방] 상단 고정 공지 [강사님 ...식사 준비 확인]
                                링크 클릭하여 조식 인원 확인
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <span className="shrink-0 font-bold text-point">②</span>
                            <span className="flex-wrap break-keep">
                                <strong>카드 수령:</strong> 7층 데스크 맨 오른쪽 선생님께 카드 수령
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <span className="shrink-0 font-bold text-point">③</span>
                            <span className="flex-wrap break-keep">
                                <strong>샌드위치 구매:</strong> 가장 가까운 스벅에서 [콜드 샌드위치]를 조식 인원수만큼
                                구매
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <span className="shrink-0 font-bold text-point">④</span>
                            <span className="flex-wrap break-keep">
                                <strong>영수증 처리:</strong> 영수증 상단에 선생님 성함을 적어 카드와 함께 반환
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <span className="shrink-0 font-bold text-point">⑤</span>
                            <span className="flex-wrap break-keep">
                                <strong>세팅 및 보고:</strong> 강사대기실 세팅 후 현판이 보이도록 사진 찍어 잔디 업로드
                            </span>
                        </li>
                    </ol>
                    <img src={BreakFastImg} className="self-center w-[60%]" />
                </article>

                <hr className="text-[#dae0e8]" />

                <article id="jog-setup" className="w-full flex flex-col gap-4">
                    <h3 className="text-[#0F172A] text-xl font-bold flex items-baseline gap-2 leading-normal">
                        <span className="text-[#CBD5E1]">#</span> 조그 세팅하기
                    </h3>
                    <ul className="text-base font-regular text-[#334155] p-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] space-y-3">
                        <li className="flex gap-3">
                            <CheckIcon className="size-4 mt-1 shrink-0 text-gray-400" />
                            <span className="break-keep">
                                수업이 있는 교실들의 <strong>노트북 전원 상태</strong>를 확인합니다.
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <CheckIcon className="size-4 mt-1 shrink-0 text-gray-400" />
                            <span className="break-keep">
                                <b>OBS</b>를 실행하고, 1교시 수업 교실은{' '}
                                <b className="whitespace-nowrap text-point">[녹화 시작]</b>을 클릭합니다.
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <CheckIcon className="size-4 mt-1 shrink-0 text-gray-400" />
                            <span className="break-keep">조그를 적절히 조절하여 화면 구도를 잡습니다.</span>
                        </li>
                    </ul>
                </article>

                <article id="lounge-setup" className="w-full flex flex-col gap-4">
                    <h3 className="text-[#0F172A] text-xl font-bold flex items-baseline gap-2 leading-normal">
                        <span className="text-[#CBD5E1]">#</span> 강사 대기실 세팅하기
                    </h3>
                    <ul className="text-base font-regular text-[#334155] p-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] space-y-3">
                        <li className="flex gap-3">
                            <CheckIcon className="size-4 mt-1 shrink-0 text-gray-400" />
                            <span className="break-keep">
                                냉장고 안에 물 8개가 채워져 있는지 확인하고 부족하면 채워 넣습니다.
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <CheckIcon className="size-4 mt-1 shrink-0 text-gray-400" />
                            <span className="break-keep">
                                물티슈와 휴지가 있는지 확인하고, 거의 다 쓴 경우에 새 걸로 교체합니다.
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <CheckIcon className="size-4 mt-1 shrink-0 text-gray-400" />
                            <span className="break-keep">책상 위에 생수 두 병을 세팅합니다</span>
                        </li>
                    </ul>
                </article>
            </section>
        </main>
    );
}
