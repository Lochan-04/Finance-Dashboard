import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useFinanceStore } from '../context/FinanceContext';
import styles from './AddTransactionForm.module.css';

function AddTransactionForm() {
  const { addTransaction, categories, defaultTransaction } = useFinanceStore();
  const [draft, setDraft] = useState(defaultTransaction);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDraft((currentDraft) => ({ ...currentDraft, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!draft.label.trim() || !draft.amount) {
      return;
    }

    addTransaction({
      ...draft,
      label: draft.label.trim(),
    });
    setDraft(defaultTransaction);
  };

  return (
    <section className={styles.panel}>
      <div className={styles.heading}>
        <div>
          <h3>Add Transaction</h3>
          <p>Create a new income or expense record directly from the dashboard.</p>
        </div>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          <span>Date</span>
          <input type="date" name="date" value={draft.date} onChange={handleChange} required />
        </label>
        <label>
          <span>Label</span>
          <input
            type="text"
            name="label"
            placeholder="Enter label"
            value={draft.label}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          <span>Category</span>
          <select name="category" value={draft.category} onChange={handleChange}>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Amount</span>
          <input
            type="number"
            min="0"
            step="1"
            name="amount"
            placeholder="0"
            value={draft.amount}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          <span>Type</span>
          <select name="type" value={draft.type} onChange={handleChange}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>

        <button type="submit" className={styles.submitButton}>
          <Plus size={16} />
          <span>Add Transaction</span>
        </button>
      </form>
    </section>
  );
}

export default AddTransactionForm;
