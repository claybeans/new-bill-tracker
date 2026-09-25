'use client'

import { useMemo, useState } from 'react'
import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  CircleDollarSign,
  CreditCard,
  FileText,
  LayoutDashboard,
  ListFilter,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  SlidersHorizontal,
  Tags,
  WalletCards,
  X,
} from 'lucide-react'

type Bill = {
  id: number
  name: string
  category: string
  due: string
  amount: number
  status: 'Paid' | 'Due soon' | 'Overdue' | 'Upcoming'
  color: string
  icon: string
}

const initialBills: Bill[] = [
  { id: 1, name: 'Electricity bill', category: 'Utilities', due: 'Today', amount: 84.5, status: 'Due soon', color: 'amber', icon: 'E' },
  { id: 2, name: 'Netflix', category: 'Subscriptions', due: 'Sep 28', amount: 15.49, status: 'Upcoming', color: 'red', icon: 'N' },
  { id: 3, name: 'Internet service', category: 'Utilities', due: 'Oct 02', amount: 59.99, status: 'Upcoming', color: 'blue', icon: 'I' },
  { id: 4, name: 'Rent', category: 'Housing', due: 'Sep 01', amount: 1200, status: 'Paid', color: 'violet', icon: 'R' },
  { id: 5, name: 'Car insurance', category: 'Insurance', due: 'Sep 05', amount: 128.2, status: 'Paid', color: 'emerald', icon: 'C' },
  { id: 6, name: 'Student loan', category: 'Loans', due: 'Sep 10', amount: 240, status: 'Overdue', color: 'orange', icon: 'S' },
]

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Bills', icon: FileText },
  { label: 'Calendar', icon: CalendarDays },
  { label: 'Analytics', icon: BarChart3 },
]

function money(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

export default function Page() {
  const [active, setActive] = useState('Overview')
  const [bills, setBills] = useState(initialBills)
  const [query, setQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const filteredBills = useMemo(() => bills.filter((bill) => bill.name.toLowerCase().includes(query.toLowerCase()) || bill.category.toLowerCase().includes(query.toLowerCase())), [bills, query])
  const dueTotal = bills.filter((bill) => bill.status !== 'Paid').reduce((sum, bill) => sum + bill.amount, 0)
  const paidTotal = bills.filter((bill) => bill.status === 'Paid').reduce((sum, bill) => sum + bill.amount, 0)

  function markPaid(id: number) {
    setBills((current) => current.map((bill) => bill.id === id ? { ...bill, status: 'Paid' } : bill))
  }

  function addBill(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') || 'New bill')
    const amount = Number(data.get('amount') || 0)
    setBills((current) => [{ id: Date.now(), name, category: String(data.get('category') || 'Other'), due: 'Oct 15', amount, status: 'Upcoming', color: 'blue', icon: name.charAt(0).toUpperCase() }, ...current])
    setShowModal(false)
  }

  return (
    <main className="tracker-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark"><WalletCards size={19} /></span><span>Billwise</span></div>
        <div className="workspace"><div className="workspace-avatar">JD</div><div><strong>Jordan&apos;s space</strong><span>Personal account</span></div><ChevronDown size={15} /></div>
        <nav className="side-nav" aria-label="Main navigation">
          <p className="nav-label">Workspace</p>
          {navItems.map(({ label, icon: Icon }) => <button key={label} className={`nav-link ${active === label ? 'active' : ''}`} onClick={() => setActive(label)}><Icon size={18} /><span>{label}</span>{label === 'Bills' && <span className="nav-count">6</span>}</button>)}
          <p className="nav-label settings-label">Manage</p>
          <button className="nav-link" onClick={() => setActive('Categories')}><Tags size={18} /><span>Categories</span></button>
          <button className="nav-link" onClick={() => setActive('Settings')}><Settings size={18} /><span>Settings</span></button>
        </nav>
        <div className="sidebar-footer"><div className="tip-icon"><CircleDollarSign size={18} /></div><div><strong>Stay on top of it</strong><span>Track every due date in one place.</span></div></div>
      </aside>

      <section className="content-area">
        <header className="topbar">
          <button className="mobile-menu" aria-label="Open menu"><Menu size={20} /></button>
          <div className="breadcrumbs"><span>Workspace</span><span>/</span><strong>{active}</strong></div>
          <div className="top-actions"><div className="search-box"><Search size={17} /><input aria-label="Search bills" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search bills..." /></div><button className="icon-button notification-button" aria-label="Notifications" onClick={() => setShowNotifications(!showNotifications)}><Bell size={18} /><span className="notification-dot" /></button><button className="profile-button"><span>JD</span><ChevronDown size={14} /></button></div>
          {showNotifications && <div className="notification-popover"><strong>Notifications</strong><p><AlertCircle size={15} /> Electricity is due today.</p><p><Check size={15} /> 2 bills paid this month.</p></div>}
        </header>

        <div className="page-content">
          <div className="page-heading"><div><p className="eyebrow">Tuesday, September 24, 2024</p><h1>Good morning, Jordan <span className="heading-period">.</span></h1><p className="subheading">Here&apos;s your financial overview for this month.</p></div><button className="primary-button" onClick={() => setShowModal(true)}><Plus size={18} /> Add bill</button></div>

          <div className="summary-grid">
            <SummaryCard label="Total due this month" value={money(dueTotal)} meta="3 bills remaining" icon={<WalletCards size={19} />} tone="blue" trend="+8.2%" />
            <SummaryCard label="Paid this month" value={money(paidTotal)} meta="2 bills paid" icon={<Check size={19} />} tone="green" trend="+12.4%" />
            <SummaryCard label="Upcoming in 7 days" value="2 bills" meta="Due by Sep 30" icon={<CalendarDays size={19} />} tone="orange" />
            <SummaryCard label="Overdue" value="1 bill" meta="Needs your attention" icon={<AlertCircle size={19} />} tone="red" />
          </div>

          <div className="dashboard-grid">
            <section className="panel bills-panel"><div className="panel-header"><div><h2>Upcoming bills</h2><p>Keep track of what&apos;s coming up next.</p></div><button className="text-button" onClick={() => setActive('Bills')}>View all <ArrowUpRight size={15} /></button></div><div className="bill-list">{filteredBills.filter((bill) => bill.status !== 'Paid').slice(0, 4).map((bill) => <BillRow key={bill.id} bill={bill} onPaid={() => markPaid(bill.id)} />)}</div></section>
            <section className="panel progress-panel"><div className="panel-header"><div><h2>Monthly spending</h2><p>September 2024</p></div><button className="icon-button" aria-label="More options"><MoreHorizontal size={19} /></button></div><div className="spend-total"><strong>{money(paidTotal + dueTotal)}</strong><span><ArrowUpRight size={13} /> 6.4% <em>vs last month</em></span></div><div className="chart" aria-label="Monthly spending chart"><div className="chart-grid"><span /><span /><span /><span /></div><svg viewBox="0 0 440 150" preserveAspectRatio="none" role="img" aria-label="Spending trend line"><defs><linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" stopOpacity=".2" /><stop offset="100%" stopColor="#3b82f6" stopOpacity="0" /></linearGradient></defs><path d="M0 117 C36 108 45 120 73 105 S112 96 135 108 S165 73 194 84 S224 57 251 71 S285 94 310 71 S342 62 365 69 S400 27 440 38 V150 H0Z" fill="url(#chartFill)" /><path d="M0 117 C36 108 45 120 73 105 S112 96 135 108 S165 73 194 84 S224 57 251 71 S285 94 310 71 S342 62 365 69 S400 27 440 38" fill="none" stroke="#3b82f6" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round" /></svg><div className="chart-labels"><span>Sep 1</span><span>Sep 8</span><span>Sep 15</span><span>Sep 22</span><span>Sep 30</span></div></div><div className="budget-row"><div><span>Monthly budget</span><strong>$2,500.00</strong></div><div className="budget-progress"><div style={{ width: '67%' }} /></div><span className="budget-percent">67%</span></div></section>
          </div>

          <div className="lower-grid"><section className="panel"><div className="panel-header"><div><h2>All bills</h2><p>{bills.length} recurring and one-time bills</p></div><div className="panel-tools"><button className="filter-button"><SlidersHorizontal size={15} /> Filters</button><button className="icon-button"><MoreHorizontal size={19} /></button></div></div><div className="table-head"><span>Bill</span><span>Due date</span><span>Amount</span><span>Status</span><span /></div>{filteredBills.map((bill) => <BillRow key={bill.id} bill={bill} onPaid={() => markPaid(bill.id)} detailed />)}</section><section className="panel category-panel"><div className="panel-header"><div><h2>By category</h2><p>Where your money goes</p></div><button className="icon-button"><MoreHorizontal size={19} /></button></div><div className="category-list"><CategoryRow label="Housing" amount="$1,200.00" percent="46%" color="#8b5cf6" /><CategoryRow label="Utilities" amount="$144.49" percent="18%" color="#3b82f6" /><CategoryRow label="Loans" amount="$240.00" percent="14%" color="#f59e0b" /><CategoryRow label="Subscriptions" amount="$15.49" percent="8%" color="#ef4444" /></div><button className="outline-button" onClick={() => setActive('Analytics')}>View spending report <ArrowUpRight size={15} /></button></section></div>
        </div>
      </section>

      <nav className="mobile-nav">{navItems.map(({ label, icon: Icon }) => <button key={label} className={active === label ? 'active' : ''} onClick={() => setActive(label)}><Icon size={19} /><span>{label}</span></button>)}</nav>
      {showModal && <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="add-bill-title"><form className="modal" onSubmit={addBill}><div className="modal-header"><div><p className="eyebrow">New entry</p><h2 id="add-bill-title">Add a bill</h2></div><button type="button" className="icon-button" aria-label="Close" onClick={() => setShowModal(false)}><X size={19} /></button></div><label>Bill name<input name="name" placeholder="e.g. Electricity bill" required /></label><div className="form-row"><label>Amount<input name="amount" type="number" min="0" step="0.01" placeholder="0.00" required /></label><label>Category<select name="category"><option>Utilities</option><option>Housing</option><option>Subscriptions</option><option>Insurance</option><option>Loans</option><option>Other</option></select></label></div><label>Due date<input type="date" defaultValue="2024-10-15" /></label><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setShowModal(false)}>Cancel</button><button className="primary-button" type="submit"><Plus size={17} /> Add bill</button></div></form></div>}
    </main>
  )
}

function SummaryCard({ label, value, meta, icon, tone, trend }: { label: string; value: string; meta: string; icon: React.ReactNode; tone: string; trend?: string }) { return <div className="summary-card"><div className={`summary-icon ${tone}`}>{icon}</div><div className="summary-copy"><span>{label}</span><strong>{value}</strong><small>{trend && <b className="positive"><ArrowUpRight size={12} /> {trend}</b>} {meta}</small></div></div> }
function BillRow({ bill, onPaid, detailed = false }: { bill: Bill; onPaid: () => void; detailed?: boolean }) { return <div className={`bill-row ${detailed ? 'detailed' : ''}`}><div className="bill-main"><button className={`bill-logo ${bill.color}`} onClick={onPaid} aria-label={bill.status === 'Paid' ? `Mark ${bill.name} unpaid` : `Mark ${bill.name} paid`}>{bill.status === 'Paid' ? <Check size={17} /> : bill.icon}</button><div><strong>{bill.name}</strong><span>{bill.category}</span></div></div><span className="bill-due">{bill.due}</span><strong className="bill-amount">{money(bill.amount)}</strong><span className={`status ${bill.status.toLowerCase().replace(' ', '-')}`}>{bill.status}</span><button className="row-more" aria-label={`More options for ${bill.name}`}><MoreHorizontal size={17} /></button></div> }
function CategoryRow({ label, amount, percent, color }: { label: string; amount: string; percent: string; color: string }) { return <div className="category-row"><div className="category-name"><span style={{ background: color }} />{label}</div><strong>{amount}</strong><span>{percent}</span></div> }
