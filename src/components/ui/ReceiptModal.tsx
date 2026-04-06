import { useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { X, Printer, Download } from 'lucide-react'
import client from '../../api/client'

interface ReceiptModalProps {
  saleId: number | null
  onClose: () => void
}

function fetchReceipt(saleId: number) {
  return client.get(`/receipts/${saleId}/`)
}

export default function ReceiptModal({ saleId, onClose }: ReceiptModalProps) {
  const printRef = useRef<HTMLDivElement>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['receipt', saleId],
    queryFn: () => fetchReceipt(saleId!),
    enabled: !!saleId,
  })

  const receipt = data?.data

  const handlePrint = () => {
    if (!receipt) return

    const printWindow = window.open('', '_blank', 'width=400,height=700')
    if (!printWindow) return

    const items = (receipt.items || [])
      .map((item: any) => `
        <tr>
          <td style="padding:2px 0;font-size:11px">${item.product_name || 'Item'}</td>
          <td style="padding:2px 0;text-align:center;font-size:11px">${item.quantity}</td>
          <td style="padding:2px 0;text-align:right;font-size:11px">${parseFloat(item.unit_price).toFixed(2)}</td>
          <td style="padding:2px 0;text-align:right;font-size:11px">${parseFloat(item.line_total).toFixed(2)}</td>
        </tr>
      `).join('')

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Receipt #${receipt.sale_id}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Courier New', Courier, monospace;
      font-size: 12px;
      width: 80mm;
      max-width: 80mm;
      padding: 4mm;
      color: #000;
    }
    .center { text-align: center; }
    .right { text-align: right; }
    .bold { font-weight: bold; }
    .divider { border-top: 1px dashed #000; margin: 4px 0; }
    .double { border-top: 2px solid #000; margin: 4px 0; }
    table { width: 100%; border-collapse: collapse; }
    th { font-size: 10px; text-transform: uppercase; border-bottom: 1px dashed #000; padding: 2px 0; }
    .total-row td { font-weight: bold; font-size: 13px; padding-top: 4px; }
    @media print {
      @page { size: 80mm auto; margin: 0; }
      body { padding: 2mm; }
    }
  </style>
</head>
<body>
  <div class="center bold" style="font-size:14px;margin-bottom:2px">${receipt.business_name || 'VaultPoint Store'}</div>
  <div class="center" style="font-size:10px">${receipt.business_address || ''}</div>
  <div class="center" style="font-size:10px">${receipt.business_phone || ''}</div>
  <div class="divider"></div>

  <div style="font-size:11px">
    <div><b>Receipt #:</b> ${receipt.sale_id}</div>
    <div><b>Date:</b> ${new Date(receipt.sale_date).toLocaleString()}</div>
    <div><b>Cashier:</b> ${receipt.cashier_name || ''}</div>
    ${receipt.customer_name ? `<div><b>Customer:</b> ${receipt.customer_name}</div>` : ''}
  </div>
  <div class="divider"></div>

  <table>
    <thead>
      <tr>
        <th style="text-align:left">Item</th>
        <th style="text-align:center">Qty</th>
        <th style="text-align:right">Price</th>
        <th style="text-align:right">Total</th>
      </tr>
    </thead>
    <tbody>
      ${items}
    </tbody>
  </table>
  <div class="divider"></div>

  <table>
    <tr>
      <td style="font-size:11px">Subtotal</td>
      <td style="text-align:right;font-size:11px">GHS ${parseFloat(receipt.subtotal).toFixed(2)}</td>
    </tr>
    ${parseFloat(receipt.discount_amount || 0) > 0 ? `
    <tr>
      <td style="font-size:11px">Discount</td>
      <td style="text-align:right;font-size:11px">- GHS ${parseFloat(receipt.discount_amount).toFixed(2)}</td>
    </tr>` : ''}
    ${parseFloat(receipt.tax_amount || 0) > 0 ? `
    <tr>
      <td style="font-size:11px">Tax (${receipt.tax_rate}%)</td>
      <td style="text-align:right;font-size:11px">GHS ${parseFloat(receipt.tax_amount).toFixed(2)}</td>
    </tr>` : ''}
  </table>
  <div class="double"></div>
  <table>
    <tr class="total-row">
      <td>TOTAL</td>
      <td style="text-align:right">GHS ${parseFloat(receipt.total_amount).toFixed(2)}</td>
    </tr>
  </table>

  <div class="divider"></div>
  <div style="font-size:11px"><b>Payment:</b> ${receipt.payment_method || ''}</div>
  ${receipt.loyalty_points_earned > 0 ? `<div style="font-size:10px">Loyalty points earned: ${receipt.loyalty_points_earned}</div>` : ''}

  <div class="divider"></div>
  <div class="center" style="font-size:11px;margin-top:4px">Thank you for your purchase!</div>
  <div class="center" style="font-size:10px">Please come again.</div>
  <br/><br/>

  <script>window.onload = function() { window.print(); }</script>
</body>
</html>`

    printWindow.document.write(html)
    printWindow.document.close()
  }

  if (!saleId) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-semibold text-gray-900">Sale Complete!</h2>
            <p className="text-xs text-gray-400 mt-0.5">Receipt #{saleId}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X size={18} />
          </button>
        </div>

        {/* Receipt body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {isLoading ? (
            <div className="py-10 text-center text-gray-400 text-sm">Loading receipt…</div>
          ) : receipt ? (
            <div ref={printRef} className="font-mono text-xs space-y-2">
              {/* Store header */}
              <div className="text-center">
                <p className="font-bold text-sm text-gray-900">{receipt.business_name}</p>
                <p className="text-gray-500">{receipt.business_address}</p>
                <p className="text-gray-500">{receipt.business_phone}</p>
              </div>
              <div className="border-t border-dashed border-gray-300" />

              {/* Sale info */}
              <div className="space-y-0.5 text-gray-700">
                <p><span className="font-semibold">Receipt #:</span> {receipt.sale_id}</p>
                <p><span className="font-semibold">Date:</span> {new Date(receipt.sale_date).toLocaleString()}</p>
                <p><span className="font-semibold">Cashier:</span> {receipt.cashier_name}</p>
                {receipt.customer_name && <p><span className="font-semibold">Customer:</span> {receipt.customer_name}</p>}
              </div>
              <div className="border-t border-dashed border-gray-300" />

              {/* Items */}
              <table className="w-full">
                <thead>
                  <tr className="text-gray-500 border-b border-dashed border-gray-300">
                    <th className="text-left py-1 font-semibold">Item</th>
                    <th className="text-center py-1 font-semibold">Qty</th>
                    <th className="text-right py-1 font-semibold">Price</th>
                    <th className="text-right py-1 font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(receipt.items || []).map((item: any, i: number) => (
                    <tr key={i} className="text-gray-700">
                      <td className="py-0.5 pr-1 truncate max-w-[100px]">{item.product_name}</td>
                      <td className="py-0.5 text-center">{item.quantity}</td>
                      <td className="py-0.5 text-right">{parseFloat(item.unit_price).toFixed(2)}</td>
                      <td className="py-0.5 text-right">{parseFloat(item.line_total).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="border-t border-dashed border-gray-300" />

              {/* Totals */}
              <div className="space-y-0.5 text-gray-700">
                <div className="flex justify-between"><span>Subtotal</span><span>GHS {parseFloat(receipt.subtotal).toFixed(2)}</span></div>
                {parseFloat(receipt.discount_amount || 0) > 0 && (
                  <div className="flex justify-between text-emerald-600"><span>Discount</span><span>- GHS {parseFloat(receipt.discount_amount).toFixed(2)}</span></div>
                )}
                {parseFloat(receipt.tax_amount || 0) > 0 && (
                  <div className="flex justify-between"><span>Tax ({receipt.tax_rate}%)</span><span>GHS {parseFloat(receipt.tax_amount).toFixed(2)}</span></div>
                )}
              </div>
              <div className="border-t-2 border-gray-900" />
              <div className="flex justify-between font-bold text-sm text-gray-900">
                <span>TOTAL</span>
                <span>GHS {parseFloat(receipt.total_amount).toFixed(2)}</span>
              </div>
              <div className="border-t border-dashed border-gray-300" />

              <div className="text-gray-700">
                <p><span className="font-semibold">Payment:</span> {receipt.payment_method}</p>
                {receipt.loyalty_points_earned > 0 && (
                  <p className="text-accent">+{receipt.loyalty_points_earned} loyalty points earned</p>
                )}
              </div>

              <div className="text-center text-gray-500 pt-1">
                <p>Thank you for your purchase!</p>
                <p>Please come again.</p>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center text-gray-400 text-sm">Could not load receipt</div>
          )}
        </div>

        {/* Actions */}
        <div className="px-5 py-4 border-t border-gray-100 flex gap-2">
          <button
            onClick={handlePrint}
            disabled={!receipt}
            className="btn-primary flex-1 justify-center"
          >
            <Printer size={15} />
            Print Receipt
          </button>
          <a
            href={`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'}/receipts/${saleId}/pdf/`}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary px-3"
            title="Download PDF"
          >
            <Download size={15} />
          </a>
          <button onClick={onClose} className="btn-secondary px-4">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
