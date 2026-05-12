import React from 'react';

export default function Breadcrumb({ items, goto }) {
  return (
    <div className="breadcrumb">
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <i className="ti ti-chevron-right"></i>}
          <span
            onClick={() => item.onClick && item.onClick()}
            style={{ color: item.active ? 'var(--sky)' : 'inherit' }}
          >
            {item.label}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}
