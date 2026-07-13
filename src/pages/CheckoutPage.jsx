import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Container,
  Row,
  Col,
  Heading,
  Text,
  Lead,
  Button,
  Badge,
  Image,
  Card,
  CardBody,
  Alert,
  ListGroup,
  ListGroupItem,
  FormControl,
  FormLabel,
  FormText,
  FormSelect,
  FormCheck,
  FormFeedback,
  FormGroup,
  FloatingLabel,
  InputGroup,
  InputGroupText,
  BsIconCheck,
  BsIconChevronLeft,
} from '@metatoy/bootstrap-styled'
import { getProduct } from '../data/catalog'
import { DISPLAY_STACK } from '../sorbBsTheme'

// ── Jane's Jeans checkout (GFP RC1 Part 3 · §F.3 / board 04) ──────────────────
//
// The forms-heavy page — the showcase for bootstrap-styled's FULL form surface
// (FormControl/Label/Text/Select/Check, InputGroup, FloatingLabel, FormFeedback)
// and its live validation contract (`.is-invalid`/`.is-valid` sibling feedback,
// bound to --bs-form-valid-* / --bs-form-invalid-*).
//
// Two-column layout: left = billing + shipping + payment forms; right = a sticky
// order summary (ListGroup line items + promo InputGroup + totals). Every custom
// surface reads var(--bs-*) — never a raw hex — so one bs-* preview push re-skins
// the whole checkout (CTAs + valid/invalid accents included) with the site.
//
// Validation is CONTROLLED: `form` state + a pure `validate()` → `errors`. After
// the first submit (`submitted`), each control gets isInvalid/isValid from the
// live errors, and its sibling <FormFeedback> shows via `.is-invalid ~ &`. A
// clean submit flips `placed` → success Alert. So the demo validates LIVE: bad
// submit shows red feedback; fixing a field flips it green as you type.

// ── Cart line items (a couple of real SKUs from the catalog) ──────────────────
const CART = [
  { slug: 'classic-straight-blue-jeans', size: '32', qty: 1 },
  { slug: 'slim-fit-indigo-jeans', size: '30', qty: 2 },
].map((line) => {
  const product = getProduct(line.slug)
  return { ...line, product, lineTotal: product.price * line.qty }
})

const COUNTRIES = ['United States', 'Canada', 'United Kingdom', 'Portugal', 'Japan']
const US_STATES = [
  'California', 'New York', 'Texas', 'Washington', 'Oregon', 'Illinois', 'Massachusetts',
]
const SHIPPING_METHODS = {
  standard: { label: 'Standard', detail: '4–6 business days', cost: 6 },
  express: { label: 'Express', detail: '1–2 business days', cost: 16 },
}
const PROMOS = { DENIM10: 0.1 } // code → fraction off subtotal
const TAX_RATE = 0.08

const usd = (n) => `$${n.toFixed(2)}`

const sectionEyebrow = {
  display: 'block',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  fontSize: '0.78rem',
  fontWeight: 600,
  color: 'var(--bs-primary)',
  marginBottom: '0.5rem',
}

const cardStyle = {
  background: 'var(--bs-body-bg)',
  borderColor: 'var(--bs-border-color)',
  marginBottom: '1.5rem',
}

const labelStyle = { fontWeight: 600, color: 'var(--bs-body-color)' }

// ── Field validators (return an error string, or '' when valid) ───────────────
const req = (v) => (v && String(v).trim() ? '' : 'This field is required.')
const validators = {
  firstName: req,
  lastName: req,
  email: (v) =>
    !v.trim() ? 'Enter your email.' : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address.',
  address: req,
  city: req,
  country: (v) => (v ? '' : 'Choose a country.'),
  state: (v) => (v ? '' : 'Choose a state.'),
  zip: (v) => (!v.trim() ? 'Enter a ZIP code.' : /^\d{5}(-\d{4})?$/.test(v.trim()) ? '' : 'Enter a valid ZIP (5 digits).'),
  cardName: req,
  cardNumber: (v) => {
    const digits = v.replace(/\s+/g, '')
    if (!digits) return 'Enter the card number.'
    return /^\d{15,16}$/.test(digits) ? '' : 'Enter a valid 15–16 digit card number.'
  },
  expiry: (v) =>
    !v.trim() ? 'Enter the expiry.' : /^(0[1-9]|1[0-2])\/\d{2}$/.test(v.trim()) ? '' : 'Use MM/YY.',
  cvv: (v) => (!v.trim() ? 'Enter the CVV.' : /^\d{3,4}$/.test(v.trim()) ? '' : '3–4 digits.'),
  // Shipping fields — only validated when shipping ≠ billing (see validate()).
  shipAddress: req,
  shipCity: req,
  shipZip: (v) => (!v.trim() ? 'Enter a ZIP code.' : /^\d{5}(-\d{4})?$/.test(v.trim()) ? '' : 'Enter a valid ZIP.'),
  shipCountry: (v) => (v ? '' : 'Choose a country.'),
  shipState: (v) => (v ? '' : 'Choose a state.'),
}

const BILLING_FIELDS = [
  'firstName', 'lastName', 'email', 'address', 'city', 'country', 'state', 'zip',
]
const PAYMENT_FIELDS = ['cardName', 'cardNumber', 'expiry', 'cvv']
const SHIPPING_FIELDS = ['shipAddress', 'shipCity', 'shipZip', 'shipCountry', 'shipState']

const EMPTY_FORM = Object.fromEntries(
  [...BILLING_FIELDS, ...PAYMENT_FIELDS, ...SHIPPING_FIELDS].map((k) => [k, '']),
)

export const CheckoutPage = () => {
  const [form, setForm] = useState(EMPTY_FORM)
  const [sameAsBilling, setSameAsBilling] = useState(true)
  const [shippingMethod, setShippingMethod] = useState('standard')
  const [saveCard, setSaveCard] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [placed, setPlaced] = useState(false)

  // Promo state — draft (input) vs applied (locked-in) so "Apply" is deliberate.
  const [promoDraft, setPromoDraft] = useState('')
  const [appliedPromo, setAppliedPromo] = useState(null) // { code, rate } | null
  const [promoError, setPromoError] = useState('')

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  // Which fields are in play right now (shipping only when it differs).
  const activeFields = useMemo(
    () => [...BILLING_FIELDS, ...(sameAsBilling ? [] : SHIPPING_FIELDS), ...PAYMENT_FIELDS],
    [sameAsBilling],
  )

  // Live errors over the active fields (recomputed every render → feedback flips
  // green as the user fixes a field after the first submit).
  const errors = useMemo(() => {
    const out = {}
    for (const key of activeFields) {
      const msg = validators[key](form[key] || '')
      if (msg) out[key] = msg
    }
    return out
  }, [form, activeFields])

  // ── Order-summary math ──────────────────────────────────────────────────────
  const subtotal = useMemo(() => CART.reduce((sum, l) => sum + l.lineTotal, 0), [])
  const discount = appliedPromo ? subtotal * appliedPromo.rate : 0
  const shipping = SHIPPING_METHODS[shippingMethod].cost
  const tax = (subtotal - discount) * TAX_RATE
  const total = subtotal - discount + shipping + tax
  const itemCount = CART.reduce((n, l) => n + l.qty, 0)

  const applyPromo = () => {
    const code = promoDraft.trim().toUpperCase()
    if (!code) {
      setPromoError('Enter a promo code.')
      return
    }
    if (PROMOS[code] == null) {
      setAppliedPromo(null)
      setPromoError(`"${code}" is not a valid code.`)
      return
    }
    setAppliedPromo({ code, rate: PROMOS[code] })
    setPromoError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    if (Object.keys(errors).length === 0) {
      setPlaced(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      // Focus the first invalid control for accessibility.
      const first = activeFields.find((k) => errors[k])
      if (first) {
        const el = document.getElementById(`co-${first}`)
        if (el) el.focus()
      }
    }
  }

  // Per-field validation props: only decorate after the first submit attempt.
  const fieldProps = (key) => {
    if (!submitted) return {}
    return errors[key] ? { isInvalid: true } : { isValid: true }
  }

  // ── Success state ───────────────────────────────────────────────────────────
  if (placed) {
    return (
      <Container data-testid="page-checkout" style={{ padding: '3.5rem 0', maxWidth: 720 }}>
        <Alert
          variant="success"
          data-testid="co-order-success"
          style={{ padding: '2rem', textAlign: 'center' }}
        >
          <div
            aria-hidden="true"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '3.25rem',
              height: '3.25rem',
              borderRadius: '50%',
              background: 'var(--bs-primary)',
              color: 'var(--bs-body-bg)',
              marginBottom: '1rem',
            }}
          >
            <BsIconCheck size={28} />
          </div>
          <Heading as="h1" size={3} style={{ fontFamily: DISPLAY_STACK, marginBottom: '0.5rem' }}>
            Order placed — thank you!
          </Heading>
          <Text style={{ display: 'block', color: 'var(--bs-secondary-color)' }}>
            A confirmation is on its way to{' '}
            <strong style={{ color: 'var(--bs-body-color)' }}>{form.email}</strong>. Your{' '}
            {itemCount} items ({usd(total)}) will ship{' '}
            {SHIPPING_METHODS[shippingMethod].label.toLowerCase()} to{' '}
            {form.firstName} {form.lastName}.
          </Text>
        </Alert>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1.5rem' }}>
          <Button as={Link} to="/" variant="primary" size="lg" data-testid="co-continue-shopping">
            Back to shop
          </Button>
        </div>
      </Container>
    )
  }

  return (
    <Container data-testid="page-checkout" style={{ padding: '2rem 0 3.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <span style={sectionEyebrow}>Jane&apos;s Jeans</span>
        <Heading
          as="h1"
          size={2}
          style={{
            fontFamily: DISPLAY_STACK,
            color: 'var(--bs-heading-color, var(--bs-body-color))',
            letterSpacing: '-0.01em',
          }}
        >
          Checkout
        </Heading>
        <Lead style={{ color: 'var(--bs-secondary-color)', marginTop: '0.25rem' }}>
          Almost yours. Fill in your details below to place the order.
        </Lead>
      </div>

      {submitted && Object.keys(errors).length > 0 && (
        <Alert variant="danger" data-testid="co-form-error" style={{ marginBottom: '1.5rem' }}>
          Please fix the {Object.keys(errors).length} highlighted{' '}
          {Object.keys(errors).length === 1 ? 'field' : 'fields'} below before placing your order.
        </Alert>
      )}

      <Row g={5} style={{ alignItems: 'flex-start' }}>
        {/* ── Left column: the forms ──────────────────────────────────────── */}
        <Col lg={7}>
          <form noValidate onSubmit={handleSubmit} data-testid="co-form">
            {/* ── Billing details ──────────────────────────────────────────── */}
            <Card style={cardStyle}>
              <CardBody style={{ padding: '1.5rem' }}>
                <Heading as="h2" size={5} style={{ fontFamily: DISPLAY_STACK, marginBottom: '1.25rem' }}>
                  Billing details
                </Heading>

                <Row g={3}>
                  <Col sm={6}>
                    <FormGroup>
                      <FormLabel htmlFor="co-firstName" style={labelStyle}>First name</FormLabel>
                      <FormControl
                        id="co-firstName"
                        value={form.firstName}
                        onChange={set('firstName')}
                        autoComplete="given-name"
                        {...fieldProps('firstName')}
                      />
                      <FormFeedback type="invalid">{errors.firstName}</FormFeedback>
                      <FormFeedback type="valid">Looks good.</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col sm={6}>
                    <FormGroup>
                      <FormLabel htmlFor="co-lastName" style={labelStyle}>Last name</FormLabel>
                      <FormControl
                        id="co-lastName"
                        value={form.lastName}
                        onChange={set('lastName')}
                        autoComplete="family-name"
                        {...fieldProps('lastName')}
                      />
                      <FormFeedback type="invalid">{errors.lastName}</FormFeedback>
                      <FormFeedback type="valid">Looks good.</FormFeedback>
                    </FormGroup>
                  </Col>
                </Row>

                <FormGroup style={{ marginTop: '1rem' }}>
                  <FloatingLabel label="Email address" controlId="co-email">
                    <FormControl
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={set('email')}
                      autoComplete="email"
                      {...fieldProps('email')}
                    />
                  </FloatingLabel>
                  <FormText style={{ color: 'var(--bs-secondary-color)' }}>
                    We&apos;ll email your receipt and shipping updates here.
                  </FormText>
                  <FormFeedback type="invalid">{errors.email}</FormFeedback>
                  <FormFeedback type="valid">We&apos;ll send your receipt here.</FormFeedback>
                </FormGroup>

                <FormGroup style={{ marginTop: '1rem' }}>
                  <FormLabel htmlFor="co-address" style={labelStyle}>Address</FormLabel>
                  <FormControl
                    id="co-address"
                    placeholder="1234 Denim Ave"
                    value={form.address}
                    onChange={set('address')}
                    autoComplete="street-address"
                    {...fieldProps('address')}
                  />
                  <FormFeedback type="invalid">{errors.address}</FormFeedback>
                  <FormFeedback type="valid">Looks good.</FormFeedback>
                </FormGroup>

                <Row g={3} style={{ marginTop: '0.25rem' }}>
                  <Col md={5}>
                    <FormGroup>
                      <FormLabel htmlFor="co-city" style={labelStyle}>City</FormLabel>
                      <FormControl
                        id="co-city"
                        value={form.city}
                        onChange={set('city')}
                        autoComplete="address-level2"
                        {...fieldProps('city')}
                      />
                      <FormFeedback type="invalid">{errors.city}</FormFeedback>
                      <FormFeedback type="valid">Looks good.</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <FormLabel htmlFor="co-country" style={labelStyle}>Country</FormLabel>
                      <FormSelect
                        id="co-country"
                        value={form.country}
                        onChange={set('country')}
                        autoComplete="country-name"
                        {...fieldProps('country')}
                      >
                        <option value="">Choose…</option>
                        {COUNTRIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </FormSelect>
                      <FormFeedback type="invalid">{errors.country}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md={3}>
                    <FormGroup>
                      <FormLabel htmlFor="co-state" style={labelStyle}>State</FormLabel>
                      <FormSelect
                        id="co-state"
                        value={form.state}
                        onChange={set('state')}
                        autoComplete="address-level1"
                        {...fieldProps('state')}
                      >
                        <option value="">Choose…</option>
                        {US_STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </FormSelect>
                      <FormFeedback type="invalid">{errors.state}</FormFeedback>
                    </FormGroup>
                  </Col>
                </Row>

                <FormGroup style={{ marginTop: '1rem', maxWidth: 220 }}>
                  <FormLabel htmlFor="co-zip" style={labelStyle}>ZIP / Postal code</FormLabel>
                  <FormControl
                    id="co-zip"
                    inputMode="numeric"
                    placeholder="90210"
                    value={form.zip}
                    onChange={set('zip')}
                    autoComplete="postal-code"
                    {...fieldProps('zip')}
                  />
                  <FormFeedback type="invalid">{errors.zip}</FormFeedback>
                  <FormFeedback type="valid">Looks good.</FormFeedback>
                </FormGroup>
              </CardBody>
            </Card>

            {/* ── Shipping ─────────────────────────────────────────────────── */}
            <Card style={cardStyle}>
              <CardBody style={{ padding: '1.5rem' }}>
                <Heading as="h2" size={5} style={{ fontFamily: DISPLAY_STACK, marginBottom: '1rem' }}>
                  Shipping
                </Heading>

                <FormCheck
                  type="checkbox"
                  id="co-sameAsBilling"
                  label="Shipping address is the same as billing"
                  checked={sameAsBilling}
                  onChange={(e) => setSameAsBilling(e.target.checked)}
                  data-testid="co-same-as-billing"
                />

                {!sameAsBilling && (
                  <div
                    data-testid="co-shipping-fields"
                    style={{
                      marginTop: '1rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid var(--bs-border-color)',
                    }}
                  >
                    <FormGroup>
                      <FormLabel htmlFor="co-shipAddress" style={labelStyle}>Shipping address</FormLabel>
                      <FormControl
                        id="co-shipAddress"
                        placeholder="1234 Denim Ave"
                        value={form.shipAddress}
                        onChange={set('shipAddress')}
                        {...fieldProps('shipAddress')}
                      />
                      <FormFeedback type="invalid">{errors.shipAddress}</FormFeedback>
                    </FormGroup>

                    <Row g={3} style={{ marginTop: '0.25rem' }}>
                      <Col md={5}>
                        <FormGroup>
                          <FormLabel htmlFor="co-shipCity" style={labelStyle}>City</FormLabel>
                          <FormControl
                            id="co-shipCity"
                            value={form.shipCity}
                            onChange={set('shipCity')}
                            {...fieldProps('shipCity')}
                          />
                          <FormFeedback type="invalid">{errors.shipCity}</FormFeedback>
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup>
                          <FormLabel htmlFor="co-shipCountry" style={labelStyle}>Country</FormLabel>
                          <FormSelect
                            id="co-shipCountry"
                            value={form.shipCountry}
                            onChange={set('shipCountry')}
                            {...fieldProps('shipCountry')}
                          >
                            <option value="">Choose…</option>
                            {COUNTRIES.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </FormSelect>
                          <FormFeedback type="invalid">{errors.shipCountry}</FormFeedback>
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <FormLabel htmlFor="co-shipState" style={labelStyle}>State</FormLabel>
                          <FormSelect
                            id="co-shipState"
                            value={form.shipState}
                            onChange={set('shipState')}
                            {...fieldProps('shipState')}
                          >
                            <option value="">Choose…</option>
                            {US_STATES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </FormSelect>
                          <FormFeedback type="invalid">{errors.shipState}</FormFeedback>
                        </FormGroup>
                      </Col>
                    </Row>

                    <FormGroup style={{ marginTop: '1rem', maxWidth: 220 }}>
                      <FormLabel htmlFor="co-shipZip" style={labelStyle}>ZIP / Postal code</FormLabel>
                      <FormControl
                        id="co-shipZip"
                        inputMode="numeric"
                        value={form.shipZip}
                        onChange={set('shipZip')}
                        {...fieldProps('shipZip')}
                      />
                      <FormFeedback type="invalid">{errors.shipZip}</FormFeedback>
                    </FormGroup>
                  </div>
                )}

                {/* Shipping-method radios */}
                <div style={{ marginTop: '1.25rem' }}>
                  <FormLabel style={{ ...labelStyle, display: 'block', marginBottom: '0.5rem' }}>
                    Delivery method
                  </FormLabel>
                  {Object.entries(SHIPPING_METHODS).map(([key, m]) => (
                    <div
                      key={key}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '0.6rem 0.85rem',
                        marginBottom: '0.5rem',
                        borderRadius: 'var(--bs-border-radius, 0.5rem)',
                        border:
                          shippingMethod === key
                            ? '2px solid var(--bs-primary)'
                            : '1px solid var(--bs-border-color)',
                        background:
                          shippingMethod === key
                            ? 'rgba(var(--bs-primary-rgb), 0.06)'
                            : 'var(--bs-body-bg)',
                      }}
                    >
                      <FormCheck
                        type="radio"
                        name="shippingMethod"
                        id={`co-ship-${key}`}
                        label={
                          <span>
                            <strong style={{ color: 'var(--bs-body-color)' }}>{m.label}</strong>
                            <span style={{ color: 'var(--bs-secondary-color)', marginLeft: '0.4rem', fontSize: '0.9rem' }}>
                              · {m.detail}
                            </span>
                          </span>
                        }
                        checked={shippingMethod === key}
                        onChange={() => setShippingMethod(key)}
                        data-testid={`co-ship-${key}`}
                      />
                      <span style={{ fontWeight: 600, color: 'var(--bs-primary)', whiteSpace: 'nowrap' }}>
                        {m.cost === 0 ? 'Free' : usd(m.cost)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* ── Payment ──────────────────────────────────────────────────── */}
            <Card style={cardStyle}>
              <CardBody style={{ padding: '1.5rem' }}>
                <Heading as="h2" size={5} style={{ fontFamily: DISPLAY_STACK, marginBottom: '1.25rem' }}>
                  Payment
                </Heading>

                <FormGroup>
                  <FormLabel htmlFor="co-cardName" style={labelStyle}>Name on card</FormLabel>
                  <FormControl
                    id="co-cardName"
                    placeholder="Full name as displayed on card"
                    value={form.cardName}
                    onChange={set('cardName')}
                    autoComplete="cc-name"
                    {...fieldProps('cardName')}
                  />
                  <FormFeedback type="invalid">{errors.cardName}</FormFeedback>
                  <FormFeedback type="valid">Looks good.</FormFeedback>
                </FormGroup>

                <FormGroup style={{ marginTop: '1rem' }}>
                  <FormLabel htmlFor="co-cardNumber" style={labelStyle}>Card number</FormLabel>
                  <InputGroup>
                    <InputGroupText style={{ color: 'var(--bs-primary)' }}>
                      <BsIconCheck size={16} aria-hidden="true" />
                    </InputGroupText>
                    <FormControl
                      id="co-cardNumber"
                      inputMode="numeric"
                      placeholder="4242 4242 4242 4242"
                      value={form.cardNumber}
                      onChange={set('cardNumber')}
                      autoComplete="cc-number"
                      {...fieldProps('cardNumber')}
                    />
                    <FormFeedback type="invalid">{errors.cardNumber}</FormFeedback>
                    <FormFeedback type="valid">Card looks valid.</FormFeedback>
                  </InputGroup>
                  <FormText style={{ color: 'var(--bs-secondary-color)' }}>
                    Demo only — never enter a real card number.
                  </FormText>
                </FormGroup>

                <Row g={3} style={{ marginTop: '0.5rem' }}>
                  <Col sm={6}>
                    <FormGroup>
                      <FormLabel htmlFor="co-expiry" style={labelStyle}>Expiry (MM/YY)</FormLabel>
                      <FormControl
                        id="co-expiry"
                        placeholder="08/28"
                        value={form.expiry}
                        onChange={set('expiry')}
                        autoComplete="cc-exp"
                        {...fieldProps('expiry')}
                      />
                      <FormFeedback type="invalid">{errors.expiry}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col sm={6}>
                    <FormGroup>
                      <FormLabel htmlFor="co-cvv" style={labelStyle}>CVV</FormLabel>
                      <FormControl
                        id="co-cvv"
                        inputMode="numeric"
                        placeholder="123"
                        value={form.cvv}
                        onChange={set('cvv')}
                        autoComplete="cc-csc"
                        {...fieldProps('cvv')}
                      />
                      <FormFeedback type="invalid">{errors.cvv}</FormFeedback>
                    </FormGroup>
                  </Col>
                </Row>

                <div style={{ marginTop: '1rem' }}>
                  <FormCheck
                    type="switch"
                    id="co-saveCard"
                    label="Save this card for faster checkout next time"
                    checked={saveCard}
                    onChange={(e) => setSaveCard(e.target.checked)}
                    data-testid="co-save-card"
                  />
                </div>
              </CardBody>
            </Card>

            {/* ── Place order ──────────────────────────────────────────────── */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              data-testid="co-place-order"
              style={{ width: '100%' }}
            >
              Place order · {usd(total)}
            </Button>
            <div style={{ marginTop: '1rem' }}>
              <Button as={Link} to="/" variant="outline-primary" data-testid="co-back-to-shop">
                <BsIconChevronLeft size={14} /> Back to shop
              </Button>
            </div>
          </form>
        </Col>

        {/* ── Right column: sticky order summary ──────────────────────────── */}
        <Col lg={5}>
          <div style={{ position: 'sticky', top: '1.5rem' }}>
            <Card style={{ ...cardStyle, marginBottom: 0 }} data-testid="co-order-summary">
              <CardBody style={{ padding: '1.5rem' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <Heading as="h2" size={5} style={{ fontFamily: DISPLAY_STACK, margin: 0 }}>
                    Your order
                  </Heading>
                  <Badge variant="primary" data-testid="co-cart-count">{itemCount}</Badge>
                </div>

                {/* Line items */}
                <ListGroup flush style={{ marginBottom: '1rem' }}>
                  {CART.map((line) => (
                    <ListGroupItem
                      key={line.slug}
                      data-testid={`co-line-${line.slug}`}
                      style={{
                        display: 'flex',
                        gap: '0.85rem',
                        alignItems: 'center',
                        paddingLeft: 0,
                        paddingRight: 0,
                        background: 'transparent',
                        borderColor: 'var(--bs-border-color)',
                      }}
                    >
                      <div
                        style={{
                          width: 56,
                          height: 56,
                          flex: '0 0 auto',
                          borderRadius: 'var(--bs-border-radius, 0.5rem)',
                          overflow: 'hidden',
                          border: '1px solid var(--bs-border-color)',
                          background: 'var(--bs-tertiary-bg)',
                        }}
                      >
                        <Image
                          src={line.product.image}
                          alt={line.product.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, color: 'var(--bs-body-color)', fontSize: '0.95rem' }}>
                          {line.product.name}
                        </div>
                        <div style={{ color: 'var(--bs-secondary-color)', fontSize: '0.85rem' }}>
                          Size {line.size} · Qty {line.qty}
                        </div>
                      </div>
                      <div style={{ fontWeight: 600, color: 'var(--bs-body-color)', whiteSpace: 'nowrap' }}>
                        {usd(line.lineTotal)}
                      </div>
                    </ListGroupItem>
                  ))}
                </ListGroup>

                {/* Promo code */}
                <FormGroup style={{ marginBottom: '1rem' }}>
                  <FormLabel htmlFor="co-promo" style={labelStyle}>Promo code</FormLabel>
                  <InputGroup>
                    <FormControl
                      id="co-promo"
                      placeholder="Try DENIM10"
                      value={promoDraft}
                      onChange={(e) => setPromoDraft(e.target.value)}
                      isInvalid={!!promoError}
                      isValid={!!appliedPromo}
                      data-testid="co-promo-input"
                    />
                    <Button
                      type="button"
                      variant="outline-primary"
                      onClick={applyPromo}
                      data-testid="co-promo-apply"
                    >
                      Apply
                    </Button>
                  </InputGroup>
                  {promoError && (
                    <FormText style={{ color: 'var(--bs-form-invalid-color, #dc3545)' }} data-testid="co-promo-error">
                      {promoError}
                    </FormText>
                  )}
                  {appliedPromo && (
                    <FormText style={{ color: 'var(--bs-primary)' }} data-testid="co-promo-ok">
                      Code {appliedPromo.code} applied — {Math.round(appliedPromo.rate * 100)}% off.
                    </FormText>
                  )}
                </FormGroup>

                {/* Totals */}
                <div style={{ borderTop: '1px solid var(--bs-border-color)', paddingTop: '0.85rem' }}>
                  {[
                    ['Subtotal', usd(subtotal), false],
                    ...(discount > 0 ? [[`Discount (${appliedPromo.code})`, `−${usd(discount)}`, false]] : []),
                    [`Shipping (${SHIPPING_METHODS[shippingMethod].label})`, shipping === 0 ? 'Free' : usd(shipping), false],
                    [`Tax (${Math.round(TAX_RATE * 100)}%)`, usd(tax), false],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0.25rem 0',
                        color: 'var(--bs-secondary-color)',
                        fontSize: '0.95rem',
                      }}
                    >
                      <span>{label}</span>
                      <span>{value}</span>
                    </div>
                  ))}
                  <div
                    data-testid="co-total"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      marginTop: '0.6rem',
                      paddingTop: '0.6rem',
                      borderTop: '1px solid var(--bs-border-color)',
                    }}
                  >
                    <span style={{ fontWeight: 700, color: 'var(--bs-body-color)' }}>Total</span>
                    <span style={{ fontWeight: 700, fontSize: '1.35rem', color: 'var(--bs-primary)' }}>
                      {usd(total)}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginTop: '1rem',
                    color: 'var(--bs-secondary-color)',
                    fontSize: '0.85rem',
                  }}
                >
                  <BsIconCheck size={15} style={{ color: 'var(--bs-primary)' }} />
                  Free 30-day returns · secure checkout
                </div>
              </CardBody>
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
  )
}
