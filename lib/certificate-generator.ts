import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { logError } from './error-handler';

export async function generateCertificatePDF(elementId: string, fileName: string): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error('Certificate element not found');
    }

    try {
        // Capture the certificate as canvas with high quality
        const canvas = await html2canvas(element, {
            scale: 3, // Higher DPI for crisp text (3x resolution)
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            windowWidth: 794, // A4 width at 96 DPI
            windowHeight: 1123, // A4 height at 96 DPI
        });

        // Create PDF with A4 portrait orientation
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(fileName);
    } catch (error) {
        logError(error, 'generateCertificatePDF');
        throw error;
    }
}
