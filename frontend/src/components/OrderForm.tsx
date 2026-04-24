import { FormEvent, useState } from 'react';
import { CreateOrderRequest, OrderSide } from '../types/order';

interface Props {
  onSubmit: (payload: CreateOrderRequest) => Promise<void>;
}

const defaultState: CreateOrderRequest = {
  symbol: '',
  side: 'BUY',
  quantity: 100,
  price: 100
};

export function OrderForm({ onSubmit }: Props) {
  const [form, setForm] = useState<CreateOrderRequest>(defaultState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        ...form,
        symbol: form.symbol.toUpperCase().trim()
      });
      setForm(defaultState);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <h2>New Order</h2>
      <div className="grid">
        <label>
          Symbol
          <input
            required
            maxLength={12}
            value={form.symbol}
            onChange={(e) => setForm((prev) => ({ ...prev, symbol: e.target.value }))}
            placeholder="AAPL"
          />
        </label>
        <label>
          Side
          <select
            value={form.side}
            onChange={(e) => setForm((prev) => ({ ...prev, side: e.target.value as OrderSide }))}
          >
            <option value="BUY">Buy</option>
            <option value="SELL">Sell</option>
          </select>
        </label>
        <label>
          Quantity
          <input
            type="number"
            min={1}
            value={form.quantity}
            onChange={(e) => setForm((prev) => ({ ...prev, quantity: Number(e.target.value) }))}
          />
        </label>
        <label>
          Limit Price
          <input
            type="number"
            min={0.0001}
            step="0.0001"
            value={form.price}
            onChange={(e) => setForm((prev) => ({ ...prev, price: Number(e.target.value) }))}
          />
        </label>
      </div>
      <button disabled={isSubmitting} className="primary-button" type="submit">
        {isSubmitting ? 'Submitting...' : 'Submit Order'}
      </button>
    </form>
  );
}
