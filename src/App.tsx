import { useEffect, useMemo, useRef, useState } from 'react'
import EtchedAccretion, { type AccretionParams } from '@/components/ui/etched-accretion'
import { MENU, TABS } from './menu'

const IG = 'https://www.instagram.com/nks24space/'
const TICKER = ['NKS space', 'Coffee', 'Pit stop', 'Fresh daily', 'Good vibes', 'Take away']
const SHOTS = [
  ['facade', 'Вход в NKS space вечером, у входа стоит классический кабриолет', 'вход'],
  ['wall', 'Стена с рамами: мотоциклы и теннисная ракетка', 'стена'],
  ['porsche', 'Модель Porsche в раме на стене', '911 в раме'],
  ['table', 'Стол-витрина с моделями машин и мячами', 'стол'],
] as const

function useNarrow() {
  const [narrow, setNarrow] = useState(() => window.matchMedia('(max-width: 860px)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 860px)')
    const sync = () => setNarrow(mq.matches)
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  return narrow
}

export default function App() {
  const narrow = useNarrow()
  const [active, setActive] = useState(MENU[0].id)
  const tabsRef = useRef<HTMLElement>(null)

  // чёрная дыра в цветах кофейни: красный диск, кремовые штрихи; на телефоне она выше и по центру
  const hole = useMemo<Partial<AccretionParams>>(
    () => ({
      diskColor: '#d32a20',
      streakColor: '#f4efe6',
      cloudColor: '#d9cfc2',
      background: '#070505',
      crimson: 0.7,
      center: narrow ? [0.5, 0.27] : [0.7, 0.46],
      holeSize: narrow ? 0.04 : 0.058,
      angle: narrow ? 16 : 13,
    }),
    [narrow],
  )

  // подсветка раздела, до которого долистали
  useEffect(() => {
    const spy = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-30% 0px -60% 0px' },
    )
    document.querySelectorAll('.cat').forEach((el) => spy.observe(el))
    return () => spy.disconnect()
  }, [])
  useEffect(() => {
    const nav = tabsRef.current
    const on = nav?.querySelector<HTMLElement>('a.on')
    if (nav && on) nav.scrollTo({ left: on.offsetLeft - 20, behavior: 'smooth' })
  }, [active])

  return (
    <>
      <div className="demo">Демо-версия. Позиции и цены в меню стоят для примера: заменим на ваши.</div>

      <header className="top">
        <div className="bar">
          <a href="#top"><img src="./assets/logo.png" alt="NKS space" width={44} height={44} /></a>
          <div className="name">NKS space<small>COFFEE · PIT STOP</small></div>
          <a className="ig" href={IG} target="_blank" rel="noopener">@nks24space ↗</a>
        </div>
        <nav className="tabs" ref={tabsRef} aria-label="Разделы меню">
          {MENU.map((c) => (
            <a key={c.id} href={`#${c.id}`} className={c.id === active ? 'on' : undefined}>{TABS[c.id]}</a>
          ))}
        </nav>
      </header>

      <main id="top">
        <EtchedAccretion
          height={narrow ? '88svh' : 'min(92svh, 900px)'}
          params={hole}
          aria-label="Чёрная дыра с красным диском — заставка NKS space"
        >
          <div className="bh-shade" />
          <div className="bh">
            <div className="kicker"><i />NKS space · кофе на орбите</div>
            <div className="title">
              <h1>Меню</h1>
              <div className="space" aria-hidden="true">space</div>
            </div>
            <p>Кофе, авторские напитки и выпечка. Заходи на орбиту: выбирай, что берёшь сегодня.</p>
            <div className="hero-btns">
              <a className="btn" href="#coffee">Смотреть меню ↓</a>
              <a className="btn line" href="#place">Как у нас внутри</a>
            </div>
            <div className="bh-hint">{narrow ? 'зажми экран — диск разгонится' : 'двигай курсор · зажми, чтобы разогнать диск'}</div>
          </div>
        </EtchedAccretion>

        <div className="ticker" aria-hidden="true">
          <div>
            {Array.from({ length: 4 }, (_, k) => TICKER.map((w) => <span key={`${k}-${w}`}>{w}</span>))}
          </div>
        </div>

        <section className="menu">
          <div className="wrap">
            {MENU.map((c, i) => (
              <section key={c.id} id={c.id} className={`cat${c.hot ? ' hot' : ''}`}>
                <div className="cat-head">
                  <div className="plate">{String(i + 1).padStart(2, '0')}</div>
                  <h2>{c.title[0]} <em>{c.title[1]}</em></h2>
                  <p>{c.note}</p>
                </div>
                <ul className="items">
                  {c.items.map(([name, desc, vol, price, tag]) => (
                    <li className="item" key={name}>
                      <h3>
                        {name}
                        {tag === 'hit' && <span className="tag">ХИТ</span>}
                        {tag === 'new' && <span className="tag new">NEW</span>}
                      </h3>
                      <p>{desc}</p>
                      <div className="price">{price} ₽{vol && <small>{vol}</small>}</div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </section>

        <div className="check" aria-hidden="true" />

        <section className="place" id="place">
          <div className="wrap">
            <div className="place-head">
              <h2>Как у нас <em>внутри</em></h2>
              <span>заходи посмотреть ↓</span>
            </div>
            <div className="shots">
              {SHOTS.map(([file, alt, cap]) => (
                <figure className="shot" key={file}>
                  <img src={`./assets/${file}.jpg`} alt={alt} loading="lazy" />
                  <b>{cap}</b>
                </figure>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap">
          <div className="foot-grid">
            <img src="./assets/logo.png" alt="" width={92} height={92} />
            <div>
              <h2>До встречи <em>в NKS space</em></h2>
              <p>Новости, новинки меню и жизнь кофейни — в Instagram.</p>
            </div>
            <a className="btn" href={IG} target="_blank" rel="noopener">@nks24space ↗</a>
          </div>
          <small>© 2026 NKS space. Состав и наличие позиций уточняйте у бариста.</small>
        </div>
      </footer>
    </>
  )
}
