import React from 'react';
import { X, Printer, MessageCircle, Download, CheckCircle, FileText } from 'lucide-react';
import { STORE_INFO } from '../data/products';

export default function InvoiceModal({ order, onClose }) {
  if (!order) return null;

  const invoiceNumber = order.id.replace('ORD', 'INV');
  const invoiceDate = new Date(order.date || Date.now()).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsAppInvoice = () => {
    const customerPhone = order.customer.phone.replace(/[^0-9]/g, '');
    const fullPhone = customerPhone.startsWith('91') ? customerPhone : `91${customerPhone}`;

    const itemsList = order.items
      .map((it, idx) => `${idx + 1}. ${it.title} (Size: ${it.selectedSize || 'N/A'}) x${it.quantity} = ₹${(it.price * it.quantity).toLocaleString('en-IN')}`)
      .join('\n');

    const message = `🧾 *OFFICIAL 360APPARELS TAX INVOICE*
----------------------------------------
*Invoice No:* ${invoiceNumber}
*Date:* ${invoiceDate}
*Store:* M-63, Indralok Market, Lucknow
*Support:* +91 ${STORE_INFO.phone}

*Bill To:*
${order.customer.name} (+91 ${order.customer.phone})
${order.customer.address}, ${order.customer.city} - ${order.customer.pincode}

*Items:*
${itemsList}

----------------------------------------
*Subtotal:* ₹${order.subtotal?.toLocaleString('en-IN')}
*Discount:* -₹${order.discount?.toLocaleString('en-IN')}
*Shipping:* ${order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}
*GRAND TOTAL:* ₹${order.total?.toLocaleString('en-IN')}
*Payment Status:* ${order.paymentMethod?.toUpperCase()} (CONFIRMED)

Thank you for shopping at 360apparels Lucknow! For 7-day size replacement, keep this invoice.`;

    window.open(`https://api.whatsapp.com/send?phone=${fullPhone}&text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Toolbar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 print:hidden">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900">
              Tax Invoice & Receipt • {invoiceNumber}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSendWhatsAppInvoice}
              className="py-1.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <MessageCircle size={14} />
              <span>Send on WhatsApp</span>
            </button>

            <button
              onClick={handlePrint}
              className="py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Printer size={14} />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white hover:bg-slate-200 text-slate-700 border border-slate-200"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Printable Invoice Body */}
        <div className="p-6 sm:p-8 overflow-y-auto print:p-0 space-y-6 text-slate-800">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-slate-900 tracking-tight">
                  360<span className="text-amber-500">APPARELS</span>
                </span>
                <span className="text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded font-black">
                  SHOWROOM
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                {STORE_INFO.address}
              </p>
              <p className="text-xs text-slate-500">
                Phone: +91 {STORE_INFO.phone} • Email: {STORE_INFO.email}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                TAX INVOICE
              </span>
              <p className="text-base font-black text-slate-900">{invoiceNumber}</p>
              <p className="text-xs text-slate-500">Date: {invoiceDate}</p>
              <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                PAID & VERIFIED
              </span>
            </div>
          </div>

          {/* Customer / Bill To */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Billed To:
              </span>
              <p className="font-bold text-slate-900">{order.customer?.name}</p>
              <p className="text-slate-600">+91 {order.customer?.phone}</p>
              <p className="text-slate-600 mt-0.5">
                {order.customer?.address}, {order.customer?.city} - {order.customer?.pincode}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Order Info:
              </span>
              <p className="text-slate-700">Order ID: <span className="font-semibold text-slate-900">{order.id}</span></p>
              <p className="text-slate-700">Payment: <span className="font-bold uppercase text-slate-900">{order.paymentMethod}</span></p>
              <p className="text-slate-700">Fulfillment: <span className="font-semibold text-emerald-700">Lucknow Flagship</span></p>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3 text-center">Size</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Price</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items?.map((it, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{it.title}</td>
                    <td className="py-2.5 px-3 text-center text-slate-600">{it.selectedSize || 'N/A'}</td>
                    <td className="py-2.5 px-3 text-center text-slate-900 font-bold">{it.quantity}</td>
                    <td className="py-2.5 px-3 text-right text-slate-600">₹{it.price?.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-right font-black text-slate-900">
                      ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Calculation */}
          <div className="flex justify-end">
            <div className="w-64 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold text-slate-900">₹{order.subtotal?.toLocaleString('en-IN')}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount:</span>
                  <span>-₹{order.discount?.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Express Shipping:</span>
                <span className="font-semibold text-slate-900">
                  {order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>GST (Included @ 12%):</span>
                <span className="text-slate-500">₹{Math.round((order.total * 0.12) / 1.12).toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                <span>Grand Total:</span>
                <span className="text-base text-slate-950">₹{order.total?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400 space-y-1">
            <p className="font-medium text-slate-600">
              Thank you for trusting 360apparels Lucknow!
            </p>
            <p>
              For 7-day size replacement or assistance, contact WhatsApp +91 {STORE_INFO.phone}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
