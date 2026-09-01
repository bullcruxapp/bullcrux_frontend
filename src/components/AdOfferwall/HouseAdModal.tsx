'use client'

import { useState, useEffect, useRef } from 'react';
import './ad-offerwall.css';
import { getActiveHouseAds, recordHouseAdView } from '@/services/ticket.service';

interface HouseAdModalProps {
    raffleId: string;
    token: string;
    progress: number;
    required: number;
    onClose: () => void;
}

const HouseAdModal = ({ raffleId, token, progress, required, onClose }: HouseAdModalProps) => {
    const [ads, setAds] = useState<{ id: string; videoUrl: string }[]>([]);
    const [currentAd, setCurrentAd] = useState<string | null>(null);
    const [localProgress, setLocalProgress] = useState(progress);
    const [playing, setPlaying] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const pickRandom = (list: { videoUrl: string }[]) =>
        list.length > 0 ? list[Math.floor(Math.random() * list.length)].videoUrl : null;

    useEffect(() => {
        getActiveHouseAds()
            .then((data) => {
                setAds(data || []);
                setCurrentAd(pickRandom(data || []));
            })
            .catch(() => setAds([]))
            .finally(() => setLoading(false));
    }, []);

    const handlePlay = () => {
        setPlaying(true);
        videoRef.current?.play().catch(() => {});
    };

    const handleVideoEnded = async () => {
        setSaving(true);
        try {
            await recordHouseAdView(raffleId, token);
            const newProgress = localProgress + 1;
            setLocalProgress(newProgress);

            if (newProgress >= required) {
                setTimeout(() => onClose(), 900);
            } else {
                setTimeout(() => {
                    setCurrentAd(pickRandom(ads));
                    setPlaying(false);
                    setSaving(false);
                }, 900);
            }
        } catch (e) {
            console.error(e);
            setSaving(false);
        }
    };

    return (
        <div className="ad-offerwall-overlay" onClick={!playing || saving ? onClose : undefined}>
            <div className="ad-offerwall-card" onClick={(e) => e.stopPropagation()}>
                <div className="ad-offerwall-header">
                    <span className="ad-offerwall-progress">
                        {localProgress}/{required} anuncios vistos
                    </span>
                    <button className="ad-offerwall-close" onClick={onClose} aria-label="Cerrar">
                        ✕
                    </button>
                </div>
                <div className="ad-offerwall-progress-bar">
                    <div
                        className="ad-offerwall-progress-fill"
                        style={{ width: `${Math.min((localProgress / required) * 100, 100)}%` }}
                    />
                </div>

                <div className="house-ad-video-wrap">
                    {loading ? (
                        <p className="house-ad-status">Cargando anuncio...</p>
                    ) : !currentAd ? (
                        <p className="house-ad-status">No hay anuncios disponibles en este momento.<br />Probá de nuevo más tarde.</p>
                    ) : (
                        <>
                            <video
                                key={currentAd}
                                ref={videoRef}
                                src={currentAd}
                                playsInline
                                onEnded={handleVideoEnded}
                                onContextMenu={(e) => e.preventDefault()}
                                className="house-ad-video"
                            />
                            {!playing && (
                                <button className="house-ad-play-btn" onClick={handlePlay}>
                                    ▶ Reproducir anuncio
                                </button>
                            )}
                            {saving && (
                                <div className="house-ad-saving">✓ ¡Listo! Sumando...</div>
                            )}
                        </>
                    )}
                </div>

                <p className="ad-offerwall-hint">
                    Mirá el video completo — se suma solo al terminar, no se puede saltar.
                </p>
            </div>
        </div>
    );
};

export default HouseAdModal;
