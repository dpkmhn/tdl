import { useEffect, useMemo, useState } from 'react';
import { OrderForm } from './components/OrderForm';
import { OrderTable } from './components/OrderTable';
import { CreateOrderRequest, Order, OrderFilter, OrderStatus, OrderSummary } from './types/order';

const API_BASE_URL = 'http://localhost:8080/api/orders';

const EMPTY_SUMMARY: OrderSummary = {
  totalOrders: 0,
  openOrders: 0,
  cancelledOrders: 0,
  filledOrders: 0,
  notionalOpenValue: 0
};

function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [summary, setSummary] = useState<OrderSummary>(EMPTY_SUMMARY);
  const [error, setError] = useState<string | null>(null);
  const [symbolFilter, setSymbolFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderFilter>('ALL');

  const loadDashboard = async () => {
    const [ordersResponse, summaryResponse] = await Promise.all([
      fetch(API_BASE_URL),
      fetch(`${API_BASE_URL}/summary`)
    ]);

    if (!ordersResponse.ok || !summaryResponse.ok) {
      throw new Error('Unable to load dashboard data');
    }

    const [ordersPayload, summaryPayload] = await Promise.all([
      ordersResponse.json() as Promise<Order[]>,
      summaryResponse.json() as Promise<OrderSummary>
    ]);

    setOrders(ordersPayload);
    setSummary(summaryPayload);
  };

  useEffect(() => {
    loadDashboard().catch((err: Error) => setError(err.message));
  }, []);

  const submitAction = async (path: string, method: 'POST' | 'PATCH', payload?: CreateOrderRequest) => {
    setError(null);
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: payload ? JSON.stringify(payload) : undefined
    });

    if (!response.ok) {
      const message = await response.json();
      setError(message.message ?? 'Action failed');
      return;
    }

    await loadDashboard();
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const symbolMatches = symbolFilter.trim().length === 0 || order.symbol.includes(symbolFilter.toUpperCase().trim());
      const statusMatches = statusFilter === 'ALL' || order.status === statusFilter;
      return symbolMatches && statusMatches;
    });
  }, [orders, statusFilter, symbolFilter]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);

  const summaryCards: Array<{ label: string; value: string; tone: OrderStatus | 'NEUTRAL' }> = [
    { label: 'Total Orders', value: summary.totalOrders.toString(), tone: 'NEUTRAL' },
    { label: 'Open Orders', value: summary.openOrders.toString(), tone: 'NEW' },
    { label: 'Filled Orders', value: summary.filledOrders.toString(), tone: 'FILLED' },
    { label: 'Cancelled Orders', value: summary.cancelledOrders.toString(), tone: 'CANCELLED' },
    { label: 'Open Notional', value: formatCurrency(summary.notionalOpenValue), tone: 'NEUTRAL' }
  ];

  return (
    <main>
      <header>
        <p className="eyebrow">Trading Infrastructure</p>
        <h1>Order Management System</h1>
        <p className="description">Institutional-style dashboard for routing, monitoring, and managing trade lifecycle.</p>
      </header>

      <section className="kpi-grid">
        {summaryCards.map((card) => (
          <article className={`kpi-card tone-${card.tone.toLowerCase()}`} key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </section>

      {error && <div className="error-banner">{error}</div>}

      <OrderForm onSubmit={(payload) => submitAction('', 'POST', payload)} />

      <section className="panel filter-row">
        <h2>Filters</h2>
        <div className="grid">
          <label>
            Symbol
            <input value={symbolFilter} onChange={(event) => setSymbolFilter(event.target.value)} placeholder="Filter by symbol" />
          </label>
          <label>
            Status
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as OrderFilter)}>
              <option value="ALL">All</option>
              <option value="NEW">Open</option>
              <option value="FILLED">Filled</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </label>
        </div>
      </section>

      <OrderTable
        orders={filteredOrders}
        onFill={(id) => submitAction(`/${id}/fill`, 'PATCH')}
        onCancel={(id) => submitAction(`/${id}/cancel`, 'PATCH')}
      />
    </main>
  );
}

export default App;
