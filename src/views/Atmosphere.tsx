import { useState } from 'react';

export function Atmosphere({ source }: { source: string | undefined }) {
  const [readySource, setReadySource] = useState<string>();
  const [frame, setFrame] = useState({ current: source, previous: source });

  if (frame.current !== source) {
    setFrame({ current: source, previous: readySource ?? frame.previous });
  }

  return (
    <div className="ambient-backdrop" aria-hidden="true">
      <div className="ambient-artwork">
        {frame.previous && <img className="ambient-image" src={frame.previous} alt="" />}
        {frame.current && (
          <img
            key={frame.current}
            className={`ambient-image ambient-image--incoming${readySource === frame.current ? ' ambient-image--ready' : ''}`}
            src={frame.current}
            alt=""
            onLoad={() => setReadySource(frame.current)}
          />
        )}
      </div>
      <div className="ambient-veil" />
    </div>
  );
}
