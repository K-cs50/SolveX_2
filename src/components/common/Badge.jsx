import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export function StatusBadge({ status, size = "md" }) {
  const s = (status || "").toLowerCase();

  if (s === "current" || s === "verified" || s === "valid") {
    return (
      <span className={`badge badge-current ${size === 'sm' ? 'text-xs' : ''}`}>
        <CheckCircle2 size={12} strokeWidth={2.5} />
        Current
      </span>
    );
  }

  if (s === "superseded" || s === "withdrawn") {
    return (
      <span className={`badge badge-superseded ${size === 'sm' ? 'text-xs' : ''}`}>
        <AlertTriangle size={12} strokeWidth={2.5} />
        Superseded
      </span>
    );
  }

  if (s === "amended" || s === "under revision") {
    return (
      <span className={`badge badge-amended ${size === 'sm' ? 'text-xs' : ''}`}>
        <Info size={12} strokeWidth={2.5} />
        Amended
      </span>
    );
  }

  return (
    <span className={`badge badge-neutral ${size === 'sm' ? 'text-xs' : ''}`}>
      {status || "Unverified"}
    </span>
  );
}

export function RelevanceBadge({ relevance }) {
  const r = (relevance || "").toLowerCase();

  if (r.includes("high")) {
    return (
      <span className="badge badge-saffron">
        Highly Relevant
      </span>
    );
  }

  if (r.includes("potent")) {
    return (
      <span className="badge badge-neutral">
        Potentially Relevant
      </span>
    );
  }

  return (
    <span className="badge badge-current">
      Relevant
    </span>
  );
}
