import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { TABLES } from '../../data/restaurantData';
import { QrCode, Download, Printer, Check, X, MapPin, ExternalLink } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'ar';
  currentTableId: string;
  onSelectTable: (tableId: string) => void;
}

export const QRTableModal: React.FC<Props> = ({
  isOpen,
  onClose,
  lang,
  currentTableId,
  onSelectTable,
}) => {
  const [selectedTable, setSelectedTable] = useState(currentTableId);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const activeTableObj = TABLES.find((t) => t.id === selectedTable) || TABLES[0];
  const tableUrl = `${window.location.origin}${window.location.pathname}?table=${selectedTable}`;

  useEffect(() => {
    setSelectedTable(currentTableId);
  }, [currentTableId]);

  useEffect(() => {
    if (!isOpen) return;

    // Generate high quality QR code
    QRCode.toDataURL(
      tableUrl,
      {
        width: 320,
        margin: 2,
        color: {
          dark: '#0e0c0a',
          light: '#f5efe6',
        },
        errorCorrectionLevel: 'H',
      },
      (err, url) => {
        if (!err && url) {
          setQrDataUrl(url);
        }
      }
    );
  }, [selectedTable, isOpen, tableUrl]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `sufra-amman-${selectedTable}-qr.png`;
    a.click();
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Sufra Amman - ${activeTableObj.nameEn} QR Stand</title>
          <style>
            body {
              font-family: 'Cinzel', serif, sans-serif;
              text-align: center;
              padding: 40px;
              background: #fff;
              color: #1a1714;
            }
            .card {
              border: 3px double #d4af37;
              padding: 30px;
              max-width: 380px;
              margin: 0 auto;
              border-radius: 16px;
            }
            h1 { font-size: 24px; margin-bottom: 4px; color: #997d26; }
            h2 { font-size: 16px; font-weight: normal; margin-top: 0; color: #555; }
            .qr { margin: 20px auto; width: 220px; height: 220px; }
            .instructions { font-size: 12px; color: #777; margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>SUFRA AMMAN</h1>
            <h2>مطعم سفرة - جبل عمّان</h2>
            <hr style="border: 0; border-top: 1px solid #d4af37; margin: 15px 0;">
            <div style="font-weight: bold; font-size: 18px; color: #1a1714;">${activeTableObj.nameEn}</div>
            <div style="font-size: 14px; color: #888;">${activeTableObj.nameAr}</div>
            <img class="qr" src="${qrDataUrl}" alt="Table QR" />
            <div class="instructions">
              Scan with your mobile camera for instant Luxury Menu, 3D Dish View & AI Waiter Assistance.
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(tableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#141210] border border-[#d4af37]/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#2d251a] bg-[#1a1714]">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-[#d4af37]/15 text-[#d4af37]">
              <QrCode className="w-5 h-5" />
            </span>
            <div>
              <div className="text-[10px] font-bold text-[#d4af37] tracking-widest uppercase">
                {lang === 'en' ? 'Smart Table Management' : 'نظام إدارة طاولات المطعم'}
              </div>
              <h3 className="text-base font-bold text-white">
                {lang === 'en' ? 'Luxury Table QR Stand' : 'رمز QR الملكي للطاولة'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center text-center space-y-5">
          {/* Table Selector */}
          <div className="w-full text-left">
            <label className="text-xs font-semibold text-[#f3e5ab] mb-2 block flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
              {lang === 'en' ? 'Select Table / Location:' : 'اختر الطاولة أو الجلسة:'}
            </label>
            <select
              value={selectedTable}
              onChange={(e) => {
                setSelectedTable(e.target.value);
                onSelectTable(e.target.value);
              }}
              className="w-full bg-[#1e1b17] border border-[#d4af37]/30 text-white rounded-xl px-4 py-2.5 text-sm focus:border-[#d4af37] outline-none transition cursor-pointer"
            >
              {TABLES.map((table) => (
                <option key={table.id} value={table.id}>
                  {table.id}: {lang === 'en' ? table.nameEn : table.nameAr} ({table.type})
                </option>
              ))}
            </select>
          </div>

          {/* QR Code Presentation Stand */}
          <div className="relative p-6 rounded-2xl bg-gradient-to-b from-[#252019] to-[#12100e] border-2 border-[#d4af37]/60 shadow-2xl flex flex-col items-center">
            {/* Gold Corner Accents */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#d4af37]" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#d4af37]" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#d4af37]" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#d4af37]" />

            <div className="text-[11px] font-serif-luxury tracking-widest text-[#d4af37] uppercase font-bold mb-1">
              SUFRA AMMAN • مطعم سفرة
            </div>
            <div className="text-xs font-bold text-white mb-3">
              {lang === 'en' ? activeTableObj.nameEn : activeTableObj.nameAr}
            </div>

            {/* QR Canvas / Image */}
            {qrDataUrl ? (
              <div className="p-3 bg-[#f5efe6] rounded-xl shadow-inner">
                <img src={qrDataUrl} alt="Table QR Code" className="w-48 h-48 rounded" />
              </div>
            ) : (
              <div className="w-48 h-48 bg-[#1e1b17] animate-pulse rounded-xl flex items-center justify-center text-xs text-white/40">
                Generating QR...
              </div>
            )}

            <div className="mt-3 text-[11px] text-[#f3e5ab]/80 max-w-xs">
              {lang === 'en'
                ? 'Scan with iPhone/Android camera to browse menu, view 3D dishes & talk to AI Waiter.'
                : 'امسح الرمز بكاميرا الهاتف لتصفح القائمة بالواقع المعزز ومحادثة النادل الذكي.'}
            </div>
          </div>

          {/* Link Copier */}
          <div className="w-full flex items-center gap-2 bg-[#1b1814] border border-white/10 rounded-xl p-2 text-xs">
            <span className="text-white/60 truncate flex-1 text-left px-2 font-mono">
              {tableUrl}
            </span>
            <button
              onClick={copyUrl}
              className="px-3 py-1.5 bg-[#d4af37]/20 hover:bg-[#d4af37]/30 text-[#d4af37] font-semibold rounded-lg transition shrink-0 flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <ExternalLink className="w-3.5 h-3.5" />}
              <span>{copied ? (lang === 'en' ? 'Copied' : 'تم النسخ') : (lang === 'en' ? 'Copy Link' : 'نسخ')}</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="w-full grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#241f19] hover:bg-[#332b21] text-white text-xs font-bold border border-[#d4af37]/30 transition"
            >
              <Download className="w-4 h-4 text-[#d4af37]" />
              <span>{lang === 'en' ? 'Download PNG' : 'تحميل صورة QR'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b89326] text-black text-xs font-bold shadow-md hover:brightness-110 transition"
            >
              <Printer className="w-4 h-4" />
              <span>{lang === 'en' ? 'Print Stand Badge' : 'طباعة كارت الطاولة'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
