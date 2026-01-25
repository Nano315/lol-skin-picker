import "./TelemetryConsentModal.css";

interface Props {
  onAccept: () => void;
  onDecline: () => void;
}

export function TelemetryConsentModal({ onAccept, onDecline }: Props) {
  return (
    <div className="consent-overlay">
      <div className="consent-modal">
        <h2 className="consent-title">Help improve SkinPicker?</h2>
        <p className="consent-text">
          By enabling telemetry, you help us improve the app by sharing
          anonymous usage data and crash reports.
        </p>
        <p className="consent-privacy">
          No personal data is ever collected.
        </p>
        <div className="consent-actions">
          <button onClick={onDecline} className="consent-btn consent-btn-secondary">
            No thanks
          </button>
          <button onClick={onAccept} className="consent-btn consent-btn-primary">
            Enable
          </button>
        </div>
      </div>
    </div>
  );
}
