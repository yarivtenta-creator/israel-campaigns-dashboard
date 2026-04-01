import React, { useState } from 'react';
import '../styles/ResearchViewer.css';

export default function ResearchViewer({ data, title }) {
  const [expanded, setExpanded] = useState({});

  if (!data) {
    return <div className="research-viewer empty">No data available</div>;
  }

  const toggleExpand = (key) => {
    setExpanded(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderValue = (value, key) => {
    if (value === null || value === undefined) {
      return 'N/A';
    }

    if (typeof value === 'boolean') {
      return value ? '✓' : '✗';
    }

    if (Array.isArray(value)) {
      if (value.length === 0) return 'None';
      if (typeof value[0] === 'string') {
        return (
          <ul className="list">
            {value.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        );
      }
      return `[${value.length} items]`;
    }

    if (typeof value === 'object') {
      return '[Object]';
    }

    return String(value);
  };

  const renderNested = (obj, depth = 0) => {
    if (depth > 3) return '[Nested content...]';

    return (
      <div className={`nested-content depth-${depth}`}>
        {Object.entries(obj).map(([key, value]) => {
          const itemKey = `${key}-${depth}`;
          const isExpanded = expanded[itemKey];
          const isComplex = typeof value === 'object' && value !== null;

          return (
            <div key={itemKey} className="data-item">
              <div className="item-key">
                {isComplex && (
                  <button
                    className="expand-btn"
                    onClick={() => toggleExpand(itemKey)}
                  >
                    {isExpanded ? '▼' : '▶'}
                  </button>
                )}
                <label>{formatLabel(key)}:</label>
              </div>
              <div className="item-value">
                {isComplex ? (
                  isExpanded && (
                    <div className="nested-object">
                      {renderNested(value, depth + 1)}
                    </div>
                  )
                ) : (
                  renderValue(value, key)
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const formatLabel = (str) => {
    return str
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (c) => c.toUpperCase())
      .trim();
  };

  return (
    <div className="research-viewer">
      {title && <h2>{title}</h2>}
      {renderNested(data)}
    </div>
  );
}
