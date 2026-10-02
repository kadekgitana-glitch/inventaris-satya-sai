import { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Package, ArrowLeftRight, AlertTriangle, CheckCircle, TrendingUp, Box, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { formatNumber } from '../../utils/format';

// Sample chart data (will be replaced with real data later)
const pieData = [
  { name: 'Elektronik', value: 45, color: '#6366f1' },
  { name: 'Furniture', value: 30, color: '#8b5cf6' },
  { name: 'ATK', value: 15, color: '#a78bfa' },
  { name: 'Kebersihan', value: 10, color: '#c4b5fd' },
];

const trendData = [
  { month: 'Jan', pinjam: 12, kembali: 10 },
  { month: 'Feb', pinjam: 19, kembali: 15 },
  { month: 'Mar', pinjam: 8, kembali: 12 },
  { month: 'Apr', pinjam: 15, kembali: 14 },
  { month: 'Mei', pinjam: 22, kembali: 18 },
  { month: 'Jun', pinjam: 14, kembali: 20 },
];

const recentActivities = [
  { id: 1, text: 'Laptop Asus #L-001 dipinjam oleh Guru Matematika', time: '2 jam lalu', type: 'info' },
  { id: 2, text: 'Proyektor Epson #P-003 dikembalikan dalam kondisi baik', time: '3 jam lalu', type: 'success' },
  { id: 3, text: 'Stok ATK Kertas HVS menipis (sisa 5 rim)', time: '5 jam lalu', type: 'warning' },
  { id: 4, text: '20 unit kursi baru masuk dari supplier CV Maju Jaya', time: 'Kemarin', type: 'info' },
  { id: 5, text: 'Printer Canon #PR-002 dilaporkan rusak berat', time: 'Kemarin', type: 'danger' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { config } = useTheme();

  const metrics = useMemo(() => [
    { label: 'Total Inventaris', value: '1.247', icon: Package, variant: 'primary', sub: '+12 bulan ini' },
    { label: 'Sedang Dipinjam', value: '34', icon: ArrowLeftRight, variant: 'info', sub: '5 terlambat' },
    { label: 'Kondisi Baik', value: '1.180', icon: CheckCircle, variant: 'success', sub: '94.6% dari total' },
    { label: 'Perlu Perhatian', value: '67', icon: AlertTriangle, variant: 'warning', sub: '42 rusak, 25 hilang' },
  ], []);

  const getActivityDot = (type) => {
    const colors = { info: 'var(--info)', success: 'var(--success)', warning: 'var(--warning)', danger: 'var(--danger)' };
    return colors[type] || 'var(--text-tertiary)';
  };

  return (
    <div>
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <h1 className="welcome-title">
          Selamat datang, {user?.name || 'Admin'}! 👋
        </h1>
        <p className="welcome-text">
          Kelola inventaris {config.schoolName} dengan mudah. Berikut ringkasan hari ini.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-6)' }}>
        {metrics.map((m, i) => (
          <div key={i} className="metric-card">
            <div className={`metric-icon ${m.variant}`}>
              <m.icon size={24} />
            </div>
            <div className="metric-content">
              <div className="metric-label">{m.label}</div>
              <div className="metric-value">{m.value}</div>
              <div className="metric-sub">{m.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid-2" style={{ marginBottom: 'var(--space-6)' }}>
        {/* Trend Chart */}
        <div className="chart-card">
          <div className="chart-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} style={{ color: 'var(--primary)' }} />
            Tren Peminjaman (6 Bulan Terakhir)
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorPinjam" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorKembali" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-md)',
                  color: 'var(--text-primary)',
                }}
              />
              <Area type="monotone" dataKey="pinjam" stroke="#6366f1" fillOpacity={1} fill="url(#colorPinjam)" name="Dipinjam" strokeWidth={2} />
              <Area type="monotone" dataKey="kembali" stroke="#10b981" fillOpacity={1} fill="url(#colorKembali)" name="Dikembalikan" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="chart-card">
          <div className="chart-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Box size={18} style={{ color: 'var(--primary)' }} />
            Distribusi per Kategori
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
            <ResponsiveContainer width="50%" height={240}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              {pieData.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)', fontWeight: 500 }}>{item.name}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>{item.value}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-4)' }}>
          <Clock size={18} style={{ color: 'var(--primary)' }} />
          <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700 }}>Aktivitas Terbaru</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {recentActivities.map(activity => (
            <div key={activity.id} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--space-3)',
              padding: 'var(--space-3) var(--space-3)',
              borderRadius: 'var(--radius-md)',
              transition: 'background 150ms',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{
                width: 8, height: 8, borderRadius: '50%', marginTop: 6,
                background: getActivityDot(activity.type), flexShrink: 0,
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>{activity.text}</div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
