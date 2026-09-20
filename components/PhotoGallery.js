"use client";

import { useState, useEffect, useCallback } from "react";

export default function PhotoGallery({ photos = [], theme = "grad1", title = "Propiedad" }) {
  const [openIndex, setOpenIndex] = useState(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length)),
    [photos.length]
  );
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i + 1) % photos.length)),
    [photos.length]
  );

  useEffect(() => {
    if (openIndex === null) return;
    function handleKey(e) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [openIndex, close, prev, next]);

  if (photos.length === 0) {
    return (
      <div className="gallery">
        <div className={`main ${theme}`} />
        <div className="side">
          <div className="grad2" />
          <div className="grad3" />
        </div>
      </div>
    );
  }

  const extra = photos.length - 3;

  return (
    <>
      <div className="gallery">
        <div className="main" onClick={() => setOpenIndex(0)}>
          <img src={photos[0]} alt={`${title} — foto principal`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
        <div className="side">
          {photos[1] && (
            <div onClick={() => setOpenIndex(1)}>
              <img src={photos[1]} alt={`${title} — foto 2`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
          )}
          {photos[2] && (
            <div className={extra > 0 ? "more" : ""} style={{ position: "relative" }} onClick={() => setOpenIndex(2)}>
              <img src={photos[2]} alt={`${title} — foto 3`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              {extra > 0 && (
                <span style={{ position: "absolute", inset: 0, background: "rgba(23,48,46,0.55)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", borderRadius: "inherit" }}>
                  +{extra} fotos
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {openIndex !== null && (
        <div className="lightbox-overlay" onClick={close}>
          <button className="lightbox-close" onClick={close} aria-label="Cerrar">✕</button>

          {photos.length > 1 && (
            <button className="lightbox-nav prev" onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Anterior">‹</button>
          )}

          <img
            src={photos[openIndex]}
            alt={`Foto ${openIndex + 1} de ${photos.length}`}
            className="lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />

          {photos.length > 1 && (
            <button className="lightbox-nav next" onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Siguiente">›</button>
          )}

          <div className="lightbox-counter">{openIndex + 1} / {photos.length}</div>

          {photos.length > 1 && (
            <div className="lightbox-thumbs" onClick={(e) => e.stopPropagation()}>
              {photos.map((url, i) => (
                <div
                  key={url}
                  className={i === openIndex ? "active" : ""}
                  style={{ backgroundImage: `url(${url})` }}
                  onClick={() => setOpenIndex(i)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
