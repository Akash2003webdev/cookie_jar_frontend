import { createPortal } from 'react-dom'

export default function ConfirmOrderModal({ summaryLines, onConfirm, onCancel, confirming }) {
  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm px-0 sm:px-4 pb-24 sm:pb-0"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-t-3xl sm:rounded-3xl p-6 w-full sm:max-w-sm shadow-card animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-black mb-1">Confirm Order</h2>
        <p className="text-sm text-gray-500 mb-4">Please check your order before sending it on WhatsApp.</p>

        <div className="bg-gray-50 rounded-2xl p-4 mb-5 flex flex-col gap-1.5 max-h-52 overflow-y-auto">
          {summaryLines.map((line, i) => (
            <p key={i} className="text-sm text-gray-700">{line}</p>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={confirming}
            className="flex-1 bg-gray-100 text-gray-600 rounded-2xl py-3 text-sm font-bold hover:bg-gray-200 active:scale-[0.97] transition-all border-none cursor-pointer disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={confirming}
            className="flex-1 bg-[#25D366] text-white rounded-2xl py-3 text-sm font-bold hover:brightness-95 active:scale-[0.97] transition-all border-none cursor-pointer disabled:opacity-60"
          >
            {confirming ? 'Sending...' : 'Confirm Order'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
