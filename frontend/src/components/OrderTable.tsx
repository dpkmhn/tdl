import { Ban, CheckCheck } from 'lucide-react';
import { Order } from '../types/order';

interface Props {
  orders: Order[];
  onCancel: (id: string) => Promise<void>;
  onFill: (id: string) => Promise<void>;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);

export function OrderTable({ orders, onCancel, onFill }: Props) {
  return (
    <section className="panel">
      <div className="table-heading">
        <h2>Order Blotter</h2>
        <span className="pill">{orders.length} matching orders</span>
      </div>

      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Symbol</th>
            <th>Side</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{new Date(order.createdAt).toLocaleTimeString()}</td>
              <td>{order.symbol}</td>
              <td>
                <span className={`tag ${order.side === 'BUY' ? 'buy' : 'sell'}`}>{order.side}</span>
              </td>
              <td>{order.quantity.toLocaleString()}</td>
              <td>{formatCurrency(order.price)}</td>
              <td>{order.status}</td>
              <td>
                <div className="action-group">
                  <button className="ghost-button" onClick={() => onFill(order.id)} disabled={order.status !== 'NEW'}>
                    <CheckCheck size={16} /> Fill
                  </button>
                  <button
                    className="ghost-button danger"
                    onClick={() => onCancel(order.id)}
                    disabled={order.status !== 'NEW'}
                  >
                    <Ban size={16} /> Cancel
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan={7} className="empty">
                No orders match the current filter.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
