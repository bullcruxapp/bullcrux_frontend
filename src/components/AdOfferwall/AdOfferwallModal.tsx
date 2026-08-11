'use client'

import './ad-offerwall.css';

interface AdOfferwallModalProps {
    userId: string;
    raffleId: string;
    progress: number;
    required: number;
    onClose: () => void;
}

const BITLABS_APP_TOKEN = process.env.NEXT_PUBLIC_BITLABS_APP_TOKEN;

const AdOfferwallModal = ({ userId, raffleId, progress, required, onClose }: AdOfferwallModalProps) => {
    const wallUrl = `https://web.bitlabs.ai/?uid=${encodeURIComponent(userId)}&token=${BITLABS_APP_TOKEN}&s1=${encodeURIComponent(userId)}&s2=${encodeURIComponent(raffleId)}`;

    return (
        <div className="ad-offerwall-overlay" onClick={onClose}>
            <div className="ad-offerwall-card" onClick={(e) => e.stopPropagation()}>
                <div className="ad-offerwall-header">
                    <span className="ad-offerwall-progress">
                        {progress}/{required} anuncios vistos
                    </span>
                    <button className="ad-offerwall-close" onClick={onClose} aria-label="Cerrar">
                        ✕
                    </button>
                </div>
                <div className="ad-offerwall-progress-bar">
                    <div
                        className="ad-offerwall-progress-fill"
                        style={{ width: `${Math.min((progress / required) * 100, 100)}%` }}
                    />
                </div>
                <iframe
                    src={wallUrl}
                    className="ad-offerwall-iframe"
                    title="Anuncios"
                />
                <p className="ad-offerwall-hint">
                    Al completar un anuncio, tu progreso se actualiza solo. Cerrá esta ventana cuando termines.
                </p>
            </div>
        </div>
    );
};

export default AdOfferwallModal;
