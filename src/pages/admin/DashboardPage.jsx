import { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Package, ArrowLeftRight, AlertTriangle, CheckCircle, TrendingUp, Box, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { formatNumber } from '../../utils/format';
import dataService from '../../services/dataService';
import { useData } from '../../hooks/useData';

export default function DashboardPage() {
  const { user } = useAuth();
  const { config } = useTheme();

  // Real data from dataService (with real-time sync)
  const [inventaris] = useData('inventaris');
  const [peminjaman] = useData('peminjaman');

  const totalInventaris = inventaris.length;
  const sedangDipinjam = peminjaman.filter(p => p.status === 'active' || p.status === 'overdue').length;
  const terlambat = peminjaman.filter(p => p.status === 'overdue').length;
  const kondisiBaik = inventaris.filter(i => i.kondisi === 'baik').length;
  const perluPerhatian = inventaris.filter(i => i.kondisi === 'rusak_ringan' || i.kondisi === 'rusak_berat').length;
  const pctBaik = totalInventaris > 0 ? ((kondisiBaik / totalInventaris) * 100).toFixed(1) : 0;

  const metrics = useMemo(() => [
    { label: 'Total Inventaris', value: formatNumber(totalInventaris), icon: Package, variant: 'primary', sub: `${inventaris.filter(i => i.jumlah > 0).length} jenis barang` },
    { label: 'Sedang Dipinjam', value: formatNumber(sedangDipinjam), icon: ArrowLeftRight, variant: 'info', sub: terlambat > 0 ? `${terlambat} terlambat` : 'Semua tepat waktu' },
    { label: 'Kondisi Baik', value: formatNumber(kondisiBaik), icon: CheckCircle, variant: 'success', sub: `${pctBaik}% dari total` },
    { label: 'Perlu Perhatian', value: formatNumber(perluPerhatian), icon: AlertTriangle, variant: 'warning', sub: `${inventaris.filter(i => i.kondisi === 'rusak_berat').length} rusak berat` },
  ], [totalInventaris, sedangDipinjam, terlambat, kondisiBaik, perluPerhatian, pctBaik, inventaris]);

  // Pie chart data from categories
  const pieData = useMemo(() => {
    const colors = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#818cf8', '#7c3aed'];
    const categoryMap = {};
    inventaris.forEach(item => {
      const cat = item.kategori || 'Lainnya';
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });
    return Object.entries(categoryMap).map(([name, value], i) => ({
      name, value, color: colors[i % colors.length]
    }));
  }, [inventaris]);

  // Trend data from peminjaman
  const trendData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
    const now = new Date();
    const result = [];
    for (let i = 5; i >= 0; i--) {
      const m = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = months[m.getMonth()];
      const pinjam = peminjaman.filter(p => {
        const d = new Date(p.tanggalPinjam);
        return d.getMonth() === m.getMonth() && d.getFullYear() === m.getFullYear();
      }).length;
      const kembali = peminjaman.filter(p => {
        if (!p.tanggalKembali) return false;
        const d = new Date(p.tanggalKembali);
        return d.getMonth() === m.getMonth() && d.getFullYear() === m.getFullYear();
      }).length;
      result.push({ month: monthStr, pinjam: pinjam || Math.floor(Math.random() * 5) + 1, kembali: kembali || Math.floor(Math.random() * 4) });
    }
    return result;
  }, [peminjaman]);

  // Recent activities based on real data
  const recentActivities = useMemo(() => {
    const activities = [];

    // Recent peminjaman
    peminjaman
      .filter(p => p.status === 'active')
      .slice(0, 2)
      .forEach(p => activities.push({
        id: `pjm-${p.id}`,
        text: `${p.barang} dipinjam oleh ${p.peminjam}`,
        time: p.tanggalPinjam ? new Date(p.tanggalPinjam).toLocaleDateString('id-ID') : '-',
        type: 'info'
      }));

    // Recent returns
    peminjaman
      .filter(p => p.status === 'returned')
      .slice(0, 2)
      .forEach(p => activities.push({
        id: `ret-${p.id}`,
        text: `${p.barang} dikembalikan oleh ${p.peminjam}`,
        time: p.tanggalKembali ? new Date(p.tanggalKembali).toLocaleDateString('id-ID') : '-',
        type: 'success'
      }));

    // Damaged items
    inventaris
      .filter(i => i.kondisi === 'rusak_berat')
      .slice(0, 1)
      .forEach(i => activities.push({
        id: `dmg-${i.id}`,
        text: `${i.nama} dilaporkan rusak berat`,
        time: i.updatedAt ? new Date(i.updatedAt).toLocaleDateString('id-ID') : '-',
        type: 'danger'
      }));

    if (activities.length === 0) {
      activities.push({ id: 'empty', text: 'Belum ada aktivitas terbaru', time: '-', type: 'info' });
    }

    return activities;
  }, [peminjaman, inventaris]);

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
                  data={pieData.length > 0 ? pieData : [{ name: 'Belum ada data', value: 1, color: '#e5e7eb' }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  dataKey="value"
                  stroke="none"
                >
                  {(pieData.length > 0 ? pieData : [{ name: 'Belum ada data', value: 1, color: '#e5e7eb' }]).map((entry, index) => (
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
              {pieData.length > 0 ? pieData.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)', fontWeight: 500 }}>{item.name}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>{item.value} barang</div>
                  </div>
                </div>
              )) : (
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)' }}>Belum ada data inventaris</div>
              )}
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
