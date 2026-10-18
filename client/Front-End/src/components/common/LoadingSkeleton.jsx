import React from 'react';

export function LoadingSkeleton({ type = 'text', count = 3, height, width, className = '' }) {
  if (type === 'card') {
    return (
      <div className={`row g-3 ${className}`}>
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="col-12 col-md-6 col-lg-3">
            <div className="card erp-card-elevated p-3 border-0">
              <div className="d-flex justify-content-between mb-3">
                <div className="erp-shimmer-bg rounded" style={{ width: '40%', height: 16 }} />
                <div className="erp-shimmer-bg rounded-circle" style={{ width: 36, height: 36 }} />
              </div>
              <div className="erp-shimmer-bg rounded mb-2" style={{ width: '70%', height: 28 }} />
              <div className="erp-shimmer-bg rounded" style={{ width: '50%', height: 14 }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className={`card erp-card-elevated border-0 p-3 ${className}`}>
        <div className="d-flex justify-content-between mb-3">
          <div className="erp-shimmer-bg rounded" style={{ width: 180, height: 32 }} />
          <div className="erp-shimmer-bg rounded" style={{ width: 120, height: 32 }} />
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                {Array.from({ length: 5 }).map((_, i) => (
                  <th key={i}>
                    <div className="erp-shimmer-bg rounded" style={{ width: '80%', height: 16 }} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: count }).map((_, rowIdx) => (
                <tr key={rowIdx}>
                  {Array.from({ length: 5 }).map((_, colIdx) => (
                    <td key={colIdx}>
                      <div className="erp-shimmer-bg rounded" style={{ width: `${60 + (colIdx * 8)}%`, height: 16 }} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className={`d-flex flex-column gap-2 ${className}`}>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="erp-shimmer-bg rounded"
          style={{
            height: height || 20,
            width: width || (idx === count - 1 ? '60%' : '100%')
          }}
        />
      ))}
    </div>
  );
}

export default LoadingSkeleton;
