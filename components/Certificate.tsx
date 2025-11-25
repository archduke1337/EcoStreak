'use client';

import { User } from '@/types';
import { generateCertificatePDF } from '@/lib/certificate-generator';
import './Certificate.css';
import { useEffect, useRef } from 'react';
import Image from 'next/image';

interface CertificateProps {
    user: User;
}

// Helper function to get ordinal suffix for dates
function getOrdinalSuffix(day: number): string {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

// Format date with ordinal suffix
function formatDateWithOrdinal(date: Date): string {
    const day = date.getDate();
    const month = date.toLocaleDateString('en-IN', { month: 'long' });
    const year = date.getFullYear();
    return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
}

export default function Certificate({ user }: CertificateProps) {
    const currentDate = new Date();
    const formattedDate = formatDateWithOrdinal(currentDate);
    const nameRef = useRef<HTMLHeadingElement>(null);

    // Check if name is long and add data attribute for CSS scaling
    useEffect(() => {
        if (nameRef.current && user.name.length > 20) {
            nameRef.current.setAttribute('data-long', 'true');
        }
    }, [user.name]);

    const handleDownload = async () => {
        try {
            await generateCertificatePDF('certificate', `EcoStreak-Certificate-${user.$id}.pdf`);
        } catch (err) {
            console.error('Failed to generate PDF:', err);
        }
    };

    return (
        <>
            <div id="certificate" className="certificate-container">
                {/* Watermark */}
                <div className="certificate-watermark" aria-hidden="true">
                    ECOSTREAK
                </div>

                {/* Borders */}
                <div className="certificate-border" aria-hidden="true" />
                <div className="certificate-border-inner" aria-hidden="true" />

                {/* Header */}
                <header className="certificate-header">
                    <Image
                        src="/leaf-earth.svg"
                        alt="EcoStreak Environmental Logo"
                        className="certificate-logo"
                        width={80}
                        height={80}
                    />
                    <h1 className="certificate-title">EcoStreak</h1>
                    <p className="certificate-subtitle">Environmental Education Platform</p>
                </header>

                {/* Main Content */}
                <main className="certificate-content">
                    <h2 className="certificate-label">Certificate of Achievement</h2>

                    <div className="certificate-divider" aria-hidden="true" />

                    <p className="certificate-intro">This is to certify that</p>

                    <h3
                        ref={nameRef}
                        className="certificate-name"
                    >
                        {user.name}
                    </h3>

                    <p className="certificate-from">from</p>

                    <p className="certificate-college">{user.college}</p>

                    <p className="certificate-body">
                        has successfully completed the <strong>EcoStreak Environmental Education Program</strong>,
                        demonstrating outstanding commitment to sustainability, climate action,
                        and environmental stewardship through comprehensive learning modules,
                        practical challenges, and meaningful environmental initiatives.
                    </p>
                </main>

                {/* Footer with Signatures and Seal */}
                <footer className="certificate-footer">
                    {/* Authorized Signature */}
                    <div className="certificate-signature">
                        <div className="signature-line" aria-hidden="true" />
                        <p className="signature-label">Authorized Signature</p>
                        <p className="signature-title">Program Director</p>
                    </div>

                    {/* Gold Seal */}
                    <div className="certificate-seal">
                        <div className="seal-circle" aria-label="Official Seal">
                            <span className="seal-icon" aria-hidden="true">🏆</span>
                        </div>
                        <p className="seal-label">Official Seal</p>
                    </div>

                    {/* Date */}
                    <div className="certificate-date">
                        <p className="date-label">Date of Issue</p>
                        <p className="date-value">{formattedDate}</p>
                    </div>
                </footer>

                {/* Certificate ID */}
                <div className="certificate-id">
                    Certificate ID: ECO-{user.$id.substring(0, 12).toUpperCase()}
                </div>

                {/* QR Code Placeholder */}
                <div className="certificate-qr" aria-label="Verification QR Code">
                    <div className="qr-placeholder" aria-hidden="true" />
                </div>
            </div>

            {/* Download Button */}
            <button
                onClick={handleDownload}
                className="download-button"
                aria-label="Download Certificate as PDF"
            >
                📥 Download Certificate PDF
            </button>
        </>
    );
}
