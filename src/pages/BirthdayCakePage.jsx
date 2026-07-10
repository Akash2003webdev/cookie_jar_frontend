import { useState } from 'react'
import Toast from '../components/Toast'
import ImageUploadField from '../components/ImageUploadField'
import { bakery } from '../lib/data'
import { submitBirthdayEnquiry } from '../lib/api'
import cakeImg from '../assets/birthday_cake.png'

// 👉 Ungaloda image path/URL inga podunga.
// - public folder la vechurundha: '/images/birthday-cake.png'
// - assets folder la vechurundha: import cakeImg from '../assets/birthday-cake.png' pannitu, adha BANNER_IMAGE ku pathila use pannunga

function BirthdayAnimation({ imageSrc = cakeImg }) {
  const [imgFailed, setImgFailed] = useState(false)
  const showImage = imageSrc && !imgFailed

  return (
    <div className="relative h-40 sm:h-52 overflow-hidden rounded-3xl bg-gradient-to-b from-primary/10 to-primary/5">
      {showImage ? (
        <img
          src={imageSrc}
          alt="Birthday cake"
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl sm:text-6xl">🎂</span>
        </div>
      )}
    </div>
  )
}

// Checkbox-style pair used for the "Preparation Options" section (e.g. Sugar Level, Flour Type...)
// Note: options within a group are still mutually exclusive (only one can be picked at a time),
// just styled to look like a tick-mark checkbox instead of a solid toggle button.
function OptionToggle({ label, options, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-400 mb-1.5">{label}</label>
      <div className="flex gap-5 flex-wrap">
        {options.map((opt) => {
          const checked = value === opt
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className="flex items-center gap-2 bg-transparent border-none cursor-pointer py-1 px-0"
            >
              <span
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                  checked ? 'bg-primary border-primary' : 'bg-white border-gray-300'
                }`}
              >
                {checked && (
                  <svg
                    viewBox="0 0 16 16"
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 8.5L6.5 12L13 4.5" />
                  </svg>
                )}
              </span>
              <span
                className={`text-xs sm:text-sm font-bold transition-colors ${
                  checked ? 'text-gray-800' : 'text-gray-500'
                }`}
              >
                {opt}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function BirthdayCakePage({ onBack }) {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [cakeWeight, setCakeWeight] = useState('')
  const [description, setDescription] = useState('')
  const [imageSample, setImageSample] = useState('')
  const [imageUploading, setImageUploading] = useState(false)
  const [cakeFlavour, setCakeFlavour] = useState('')

  const [sugarLevel, setSugarLevel] = useState('Normal Sugar')
  const [flourType, setFlourType] = useState('Maida')
  const [sweetenerType, setSweetenerType] = useState('Sugar')
  const [creamType, setCreamType] = useState('Fresh Cream')

  const [toast, setToast] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  function buildWhatsAppLink() {
    const lines = [
      `🎂 *Birthday Cake Order - ${bakery.name}*`,
      '',
      `Name: ${name}`,
      `Contact: ${contact}`,
      birthDate ? `Birth Date: ${birthDate}` : null,
      `Delivery Date: ${deliveryDate}`,
      cakeWeight ? `Cake Weight: ${cakeWeight}` : null,
      cakeFlavour ? `Cake Flavour: ${cakeFlavour}` : null,
      description ? `Description: ${description}` : null,
      '',
      'Preparation Options:',
      `- ${sugarLevel}`,
      `- ${flourType}`,
      `- ${sweetenerType}`,
      `- ${creamType}`,
      imageSample ? `\nReference Image: ${imageSample}` : null,
      '',
      'Please confirm availability and price. Thank you! 🙏',
    ].filter(Boolean)

    const text = encodeURIComponent(lines.join('\n'))
    return `https://wa.me/${bakery.whatsapp}?text=${text}`
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (name.trim().length < 2) { setToast('Please enter your name'); return }
    if (contact.trim().length < 8) { setToast('Please enter a valid contact number'); return }
    if (!deliveryDate) { setToast('Please pick a delivery date'); return }
    if (imageUploading) { setToast('Please wait for the image to finish uploading'); return }

    setSubmitting(true)
    try {
      await submitBirthdayEnquiry({
        name: name.trim(),
        contact: contact.trim(),
        birthDate,
        deliveryDate,
        cakeWeight: cakeWeight.trim(),
        description: description.trim(),
        imageSample,
        cakeFlavour: cakeFlavour.trim(),
        sugarLevel,
        flourType,
        sweetenerType,
        creamType,
      })

      window.open(buildWhatsAppLink(), '_blank')
      setToast('🎉 Order sent! We\'ll confirm on WhatsApp shortly.')

      setName(''); setContact(''); setBirthDate(''); setDeliveryDate(''); setCakeWeight('')
      setDescription(''); setImageSample(''); setCakeFlavour('')
      setSugarLevel('Normal Sugar'); setFlourType('Maida')
      setSweetenerType('Sugar'); setCreamType('Fresh Cream')
    } catch (err) {
      console.error(err)
      setToast('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto px-5 py-6 sm:py-10 animate-fade-in">
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}

      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-400 hover:text-gray-700 bg-transparent border-none cursor-pointer mb-5"
      >
        ← Back
      </button>

      <BirthdayAnimation />

      <div className="mt-5 mb-6 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">Special Occasion</p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-black">Order a Birthday Cake 🎉</h1>
        <p className="mt-1.5 text-sm text-gray-500">
          Tell us what you'd like and we'll get it ready for the big day.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-5 sm:p-6 shadow-soft flex flex-col gap-3.5">
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1.5">Name</label>
          <input
            value={name} onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-200 rounded-2xl py-2.5 px-4 text-sm outline-none bg-gray-50 focus:border-primary focus:ring-2 focus:ring-primary/15 transition"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1.5">Contact</label>
          <input
            value={contact} onChange={(e) => setContact(e.target.value)}
            type="tel"
            className="w-full border border-gray-200 rounded-2xl py-2.5 px-4 text-sm outline-none bg-gray-50 focus:border-primary focus:ring-2 focus:ring-primary/15 transition"
            placeholder="e.g. 9876543210"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1.5">Birth Date</label>
          <input
            type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)}
            className="w-full border border-gray-200 rounded-2xl py-2.5 px-4 text-sm outline-none bg-gray-50 focus:border-primary focus:ring-2 focus:ring-primary/15 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1.5">Delivery Date</label>
          <input
            type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full border border-gray-200 rounded-2xl py-2.5 px-4 text-sm outline-none bg-gray-50 focus:border-primary focus:ring-2 focus:ring-primary/15 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1.5">Cake Weight</label>
          <input
            value={cakeWeight} onChange={(e) => setCakeWeight(e.target.value)}
            className="w-full border border-gray-200 rounded-2xl py-2.5 px-4 text-sm outline-none bg-gray-50 focus:border-primary focus:ring-2 focus:ring-primary/15 transition"
            placeholder="e.g. 1kg, 1.5kg"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1.5">Description</label>
          <textarea
            value={description} onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-200 rounded-2xl py-2.5 px-4 text-sm outline-none bg-gray-50 focus:border-primary focus:ring-2 focus:ring-primary/15 transition resize-none min-h-[70px]"
            placeholder="Theme, design idea, message on cake, etc."
          />
        </div>

        <ImageUploadField
          label="Image Sample (reference photo, optional)"
          value={imageSample}
          onChange={setImageSample}
          bucket="birthday-cake-samples"
          onUploadingChange={setImageUploading}
        />

        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1.5">Cake Flavour</label>
          <input
            value={cakeFlavour} onChange={(e) => setCakeFlavour(e.target.value)}
            className="w-full border border-gray-200 rounded-2xl py-2.5 px-4 text-sm outline-none bg-gray-50 focus:border-primary focus:ring-2 focus:ring-primary/15 transition"
            placeholder="e.g. Chocolate, Black Forest, Red Velvet..."
          />
        </div>

        {/* Preparation Options */}
        <div className="bg-gray-50 rounded-3xl p-4 flex flex-col gap-3.5">
          <p className="text-sm font-black text-gray-700">Preparation Options</p>
          <OptionToggle label="Sugar Level" options={['Normal Sugar', 'Medium Sugar']} value={sugarLevel} onChange={setSugarLevel} />
          <OptionToggle label="Flour Type" options={['Maida', 'Wheat']} value={flourType} onChange={setFlourType} />
          <OptionToggle label="Sweetener" options={['Sugar', 'Jaggery']} value={sweetenerType} onChange={setSweetenerType} />
          <OptionToggle label="Cream Type" options={['Fresh Cream', 'Butter Cream']} value={creamType} onChange={setCreamType} />
        </div>

        <button
          type="submit" disabled={submitting || imageUploading}
          className="w-full mt-1 bg-[#25D366] text-white rounded-2xl py-3.5 text-sm font-bold hover:brightness-95 active:scale-[0.97] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {imageUploading ? 'Waiting for image upload...' : submitting ? 'Sending...' : '🎂 Order on WhatsApp'}
        </button>
      </form>
    </div>
  )
}
