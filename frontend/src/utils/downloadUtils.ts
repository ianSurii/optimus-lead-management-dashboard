// src/utils/downloadUtils.ts

// @ts-ignore - html2canvas types may not be available
import html2canvas from 'html2canvas';
// @ts-ignore - xlsx types may not be available
import * as XLSX from 'xlsx';

/**
 * Export a DOM element as a JPEG image
 * @param elementId - The ID of the HTML element to capture
 * @param filename - The name of the downloaded file (without extension)
 */
export const exportToJPEG = async (elementId: string, filename: string): Promise<void> => {
    try {
        const element = document.getElementById(elementId);
        if (!element) {
            console.error(`Element with ID "${elementId}" not found`);
            return;
        }

        const canvas = await html2canvas(element, {
            logging: false,
        } as any);

        canvas.toBlob((blob: Blob | null) => {
            if (blob) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${filename}.jpg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }
        }, 'image/jpeg', 0.95);
    } catch (error) {
        console.error('Error exporting to JPEG:', error);
    }
};

/**
 * Export data as an Excel file
 * @param data - Array of objects representing rows of data
 * @param filename - The name of the downloaded file (without extension)
 * @param sheetName - Optional name for the Excel sheet
 */
export const exportToExcel = (
    data: any[],
    filename: string,
    sheetName: string = 'Sheet1'
): void => {
    try {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        XLSX.writeFile(workbook, `${filename}.xlsx`);
    } catch (error) {
        console.error('Error exporting to Excel:', error);
    }
};

/**
 * Convert chart data to Excel-friendly format
 * @param labels - X-axis labels
 * @param datasets - Chart datasets with labels and data
 */
export const chartToExcelData = (
    labels: string[],
    datasets: Array<{ label: string; data: number[] }>
): any[] => {
    return labels.map((label, index) => {
        const row: any = { Label: label };
        datasets.forEach((dataset) => {
            row[dataset.label] = dataset.data[index];
        });
        return row;
    });
};
