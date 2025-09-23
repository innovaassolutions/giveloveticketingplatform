# Next.js + SurrealDB Concept Mock Build — Modern UI + Playwright

*(Extended with Seating Map Stub + Charity Uplift Slider)*

---

## 10.5 Seating Map Stub Component (`src/components/seating/SeatingMap.tsx`)
A lightweight stub simulating venue seating (click to select seats). For concept demo only.

```tsx
'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const seats = Array.from({ length: 30 }).map((_, i) => ({
  id: `S${i+1}`,
  taken: i % 7 === 0 // mark some seats as already taken
}))

export default function SeatingMap({ onSelect }: { onSelect: (seatId: string) => void }) {
  const [selected, setSelected] = useState<string[]>([])

  const toggleSeat = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(s => s !== id))
    } else {
      setSelected([...selected, id])
      onSelect(id)
    }
  }

  return (
    <div className="grid grid-cols-6 gap-2 p-6 bg-black/20 rounded-2xl">
      {seats.map((s) => (
        <motion.button
          key={s.id}
          whileTap={{ scale: 0.9 }}
          disabled={s.taken}
          onClick={() => toggleSeat(s.id)}
          className={cn(
            'h-10 w-10 rounded-md flex items-center justify-center text-xs font-medium',
            s.taken && 'bg-red-600/60 text-zinc-800 cursor-not-allowed',
            !s.taken && !selected.includes(s.id) && 'bg-zinc-700 hover:bg-brand-500/80',
            selected.includes(s.id) && 'bg-brand-500 text-white'
          )}
        >
          {s.id}
        </motion.button>
      ))}
    </div>
  )
}
```

Usage inside Fan Event Page (`src/app/(fan)/event/[id]/page.tsx`):
```tsx
import SeatingMap from '@/components/seating/SeatingMap'

// inside component return:
<div className="mt-8">
  <h3 className="text-lg mb-2">Choose Your Seats</h3>
  <SeatingMap onSelect={(id) => console.log('seat selected', id)} />
</div>
```

---

## 10.6 Charity Uplift Slider Component (`src/components/charity/UpliftSlider.tsx`)

```tsx
'use client'
import { useState } from 'react'
import { Slider } from '@/components/ui/slider'

export default function UpliftSlider({ onChange }: { onChange: (value: number) => void }) {
  const [value, setValue] = useState(5)

  const update = (v: number[]) => {
    setValue(v[0])
    onChange(v[0])
  }

  return (
    <div className="p-6 bg-black/20 rounded-2xl">
      <h3 className="text-lg font-semibold">Charity Uplift</h3>
      <p className="text-sm text-zinc-400">% of resale uplift directed to charity</p>
      <div className="mt-4">
        <Slider value={[value]} max={20} step={1} onValueChange={update} />
        <p className="mt-2 text-brand-400 text-lg font-bold">{value}%</p>
      </div>
    </div>
  )
}
```

Usage in Artist Portal (`src/app/(artist)/artist/page.tsx`):
```tsx
import UpliftSlider from '@/components/charity/UpliftSlider'

<UpliftSlider onChange={(v)=>console.log('charity uplift set to', v)} />
```

---

## Demo Flow Updates
- **Fan:** Select seats visually via SeatingMap before checkout.
- **Artist:** Adjust charity uplift % and see dashboard charts update accordingly.
- **Charity:** See resulting funds in dashboard tied to uplift %.

---

These stubs keep complexity low but **visually sell the concept**: a modern interactive seat map and an artist‑controlled charity slider that differentiates your platform.



---

## 10.5 Seating Map Component (stub)
Create `src/components/seating/SeatMap.tsx` — lightweight SVG grid with selectable seats; supports GA fallback.
```tsx
'use client'
import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'

type Seat = { id: string; row: number; col: number; status: 'available'|'held'|'sold' }
export type SeatMapProps = {
  rows?: number; cols?: number; // simple grid stub
  sold?: string[]; held?: string[];
  onChange?: (selected: string[]) => void
}

export default function SeatMap({ rows=8, cols=16, sold=[], held=[], onChange }: SeatMapProps){
  const base: Seat[] = useMemo(()=>{
    const a: Seat[]=[]
    for(let r=0;r<rows;r++) for(let c=0;c<cols;c++) a.push({ id:`R${r+1}C${c+1}`, row:r, col:c, status:'available' })
    return a
  },[rows,cols])
  const [selected, setSelected] = useState<string[]>([])

  const seats = base.map(s=> sold.includes(s.id)?{...s,status:'sold'}: held.includes(s.id)?{...s,status:'held'}:s)

  function toggle(id:string){
    const seat = seats.find(s=>s.id===id)
    if(!seat || seat.status!=='available') return
    const next = selected.includes(id)? selected.filter(x=>x!==id): [...selected,id]
    setSelected(next); onChange?.(next)
  }

  const size = 24, gap = 8
  const width = cols*size + (cols-1)*gap
  const height = rows*size + (rows-1)*gap

  return (
    <div className="rounded-2xl p-4 bg-white/5 border border-white/10">
      <div className="text-sm text-zinc-400 mb-3">Tap seats to select</div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {seats.map((s, i)=>{
          const x = s.col*(size+gap), y = s.row*(size+gap)
          const fill = s.status==='sold' ? '#3f3f46' : s.status==='held' ? '#f59e0b' : (selected.includes(s.id)? '#0ea5e9' : '#22c55e')
          const a = 0.12
          return (
            <motion.rect key={s.id} x={x} y={y} width={size} height={size} rx={6}
              initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}}
              transition={{duration:0.2, delay:i*0.001}}
              fill={fill} fillOpacity={s.status==='sold'?0.35:a} stroke="#000" strokeOpacity={0.2}
              onClick={()=>toggle(s.id)}
            />)
        })}
      </svg>
      <div className="mt-3 text-sm text-zinc-400">Selected: <span className="text-white">{selected.join(', ')||'—'}</span></div>
    </div>
  )
}
```

### Integration in Fan Event Page
Update `src/app/(fan)/event/[id]/page.tsx` to include SeatMap and pass selected seats into checkout body as `seatIds`.
```tsx
'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import SeatMap from '@/components/seating/SeatMap'

export default function EventPage() {
  const [items, setItems] = useState<{ ticketTypeId: string; qty: number }[]>([])
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const add = (id: string) => setItems((p) => { const i=p.find(x=>x.ticketTypeId===id); return i? p.map(x=>x.ticketTypeId===id?{...x,qty:x.qty+1}:x):[...p,{ticketTypeId:id,qty:1}] })

  const checkout = async () => {
    const res = await fetch('/api/checkout', { method:'POST', body: JSON.stringify({ userEmail:'demo+fan@innovaas.co', name:'Demo Fan', items, seatIds: selectedSeats }), headers:{'Content-Type':'application/json'} })
    const j = await res.json(); alert('Order '+j.orderId+' completed. (Mock)')
  }

  return (
    <div className="p-6 grid lg:grid-cols-2 gap-6">
      <Card className="p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Lady Gaga — One Night in KL</h2>
          <p className="text-zinc-400">KLCC Arena · Tonight</p>
        </div>
        <SeatMap rows={8} cols={16} sold={["R2C5","R2C6","R3C8"]} held={["R1C1"]} onChange={setSelectedSeats}/>
        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <span>GA — MYR 100</span>
            <Button onClick={()=>add('ticket_type:ga')}>Add</Button>
          </div>
          <div className="flex items-center justify-between">
            <span>VIP — MYR 250</span>
            <Button onClick={()=>add('ticket_type:vip')}>Add</Button>
          </div>
        </div>
      </Card>
      <Card className="p-6">
        <h3 className="text-xl font-medium">Your Order</h3>
        <div className="mt-2 text-sm text-zinc-400">Seats: <span className="text-white">{selectedSeats.join(', ')||'—'}</span></div>
        <pre className="mt-4 bg-black/30 rounded-xl p-4 text-sm">{JSON.stringify(items, null, 2)}</pre>
        <Button className="mt-6 w-full rounded-2xl" disabled={!items.length} onClick={checkout}>Checkout (Mock)</Button>
      </Card>
    </div>
  )
}
```

---

## 10.6 Charity Uplift Slider Component
Create `src/components/artist/UpliftSlider.tsx` — controls charity %-split and emits computed breakdown.
```tsx
'use client'
import { useMemo, useState } from 'react'
import { Slider } from '@/components/ui/slider'

export type Split = { platform: number; artist: number; charity: number }
export default function UpliftSlider({ basePlatform=5, onChange }: { basePlatform?: number; onChange?: (split: Split)=>void }){
  const [uplift, setUplift] = useState<number[]>([5]) // % of resale premium
  const split = useMemo(()=>{
    const charity = uplift[0]
    const platform = basePlatform
    const artist = Math.max(0, 100 - (platform + charity))
    const s = { platform, artist, charity }
    onChange?.(s); return s
  },[uplift, basePlatform, onChange])

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-sm text-zinc-400">Charity Uplift</div>
          <div className="text-3xl font-semibold">{uplift[0]}%</div>
        </div>
        <div className="text-right text-sm text-zinc-400">
          <div>Platform: <span className="text-white">{split.platform}%</span></div>
          <div>Artist: <span className="text-white">{split.artist}%</span></div>
          <div>Charity: <span className="text-brand-400">{split.charity}%</span></div>
        </div>
      </div>
      <Slider value={uplift} onValueChange={setUplift} min={0} max={25} step={1} className="w-full"/>
      <p className="text-sm text-zinc-400">Controls the % of resale premium that goes to charity. Platform fee is fixed for demo.</p>
    </div>
  )
}
```

### Integration in Artist Portal
Update `src/app/(artist)/artist/page.tsx` with real‑time chart of revenue split.
```tsx
'use client'
import { Card } from '@/components/ui/card'
import UpliftSlider, { type Split } from '@/components/artist/UpliftSlider'
import { useState } from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'

const COLORS = ['#0ea5e9','#22c55e','#33b8aa'] // platform, artist, charity

export default function ArtistPage(){
  const [split, setSplit] = useState<Split>({ platform:5, artist:90, charity:5 })
  const data = [
    { name:'Platform', value: split.platform },
    { name:'Artist', value: split.artist },
    { name:'Charity', value: split.charity }
  ]
  return (
    <div className="p-6 grid lg:grid-cols-2 gap-6">
      <Card className="p-6 space-y-6">
        <h2 className="text-2xl font-semibold">Revenue Split (Resale Premium)</h2>
        <div className="h-72">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100}>
                {data.map((_, i)=> <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card className="p-6">
        <h3 className="text-xl font-medium">Charity Uplift</h3>
        <UpliftSlider onChange={setSplit} />
      </Card>
    </div>
  )
}
```

### Schema tweak (optional persistence)
- In `db/schema.surql`: `DEFINE FIELD charity_uplift_pct ON event TYPE number DEFAULT 5;`
- Add route `src/app/api/event/[id]/uplift/route.ts` (PATCH): `UPDATE event SET charity_uplift_pct = $pct WHERE id = $id;`

---

## 11.4 Playwright update (happy path)
Extend E2E test to cover slider + seat clicks.
```ts
// src/tests/e2e/happy.spec.ts
import { test, expect } from '@playwright/test'

test('artist sets uplift, fan selects seats and checks out (mock)', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Artist Portal' }).click()
  await expect(page.getByText('Revenue Split')).toBeVisible()
  const slider = page.locator('[role=slider]')
  await slider.first().press('ArrowRight'); await slider.first().press('ArrowRight')
  await page.screenshot({ path: 'src/tests/e2e/__screens__/artist-uplift.png', fullPage: true })

  await page.goto('/')
  await page.getByRole('link', { name: 'Fan Demo' }).click()
  await page.locator('svg').click({ position: { x: 120, y: 60 } })
  await page.locator('svg').click({ position: { x: 180, y: 60 } })
  await page.getByRole('button', { name: 'Add' }).first().click()
  await page.getByRole('button', { name: 'Checkout (Mock)' }).click()
})
```

---

