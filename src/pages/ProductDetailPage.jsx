import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Container,
  Row,
  Col,
  Breadcrumb,
  BreadcrumbItem,
  Display,
  Heading,
  Text,
  Lead,
  Button,
  Badge,
  Image,
  Ratio,
  FormControl,
  FormLabel,
  ListGroup,
  ListGroupItem,
  Tabs,
  Tab,
  Card,
  CardBody,
  CardTitle,
  CardText,
  CardFooter,
  BsIconStar,
  BsIconCheck,
  BsIconChevronLeft,
} from '@metatoy/bootstrap-styled'
import { getProduct, products } from '../data/catalog'
import { DISPLAY_STACK } from '../sorbBsTheme'

// ── Jane's Jeans product detail (GFP RC1 Part 3 · §F.2 / board 03) ────────────
//
// Breadcrumb · gallery (main Image in a Ratio + a thumbnail row that swaps the
// main via useState) · buy box (name/price/badges/blurb + size selector + qty +
// add-to-cart / wishlist) · specs (ListGroup) · Tabs · related Cards. Every
// custom surface reads var(--bs-*) — never a raw hex — so a single bs-* preview
// push re-skins the whole page with the site. Imagery = real free-stock jeans
// photography (Unsplash direct CDN); curl-verified 200 image/*.

const sectionEyebrow = {
  display: 'block',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  fontSize: '0.78rem',
  fontWeight: 600,
  color: 'var(--bs-primary)',
  marginBottom: '0.5rem',
}

const specRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '1rem',
  background: 'var(--bs-body-bg)',
  borderColor: 'var(--bs-border-color)',
  color: 'var(--bs-body-color)',
}

export const ProductDetailPage = () => {
  const { slug } = useParams()
  const product = getProduct(slug)

  // Gallery: the product's own image + its detail angles (all curl-verified).
  const gallery =
    product.gallery && product.gallery.length ? product.gallery : [product.image]
  const [activeImage, setActiveImage] = useState(gallery[0])
  const [size, setSize] = useState('')
  const [qty, setQty] = useState(1)

  // Reset local UI state whenever the routed product changes (related-card nav).
  useEffect(() => {
    setActiveImage(gallery[0])
    setSize('')
    setQty(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.slug])

  const related = product.related
    .map((s) => products.find((p) => p.slug === s))
    .filter(Boolean)

  const specs = [
    ['Fabric', product.fabric],
    ['Rise', product.rise],
    ['Fit', product.fit],
    ['Wash', product.wash],
    ['Care', product.care],
    ['Origin', product.country],
  ]

  return (
    <div data-testid="page-product">
      <Container style={{ padding: '2rem 0 3.5rem' }}>
        {/* ── Breadcrumb ───────────────────────────────────────────────── */}
        <Breadcrumb style={{ marginBottom: '1.5rem' }} data-testid="pdp-breadcrumb">
          <BreadcrumbItem>
            <Link to="/" style={{ color: 'var(--bs-primary)', textDecoration: 'none' }}>
              Home
            </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Link to="/" style={{ color: 'var(--bs-primary)', textDecoration: 'none' }}>
              Shop
            </Link>
          </BreadcrumbItem>
          <BreadcrumbItem active aria-current="page">
            {product.name}
          </BreadcrumbItem>
        </Breadcrumb>

        <Row g={5} style={{ alignItems: 'flex-start' }}>
          {/* ── Gallery ────────────────────────────────────────────────── */}
          <Col md={6}>
            <Ratio
              ratio="1x1"
              style={{
                borderRadius: 'var(--bs-border-radius-lg, 0.75rem)',
                overflow: 'hidden',
                border: '1px solid var(--bs-border-color)',
                background: 'var(--bs-tertiary-bg)',
                marginBottom: '0.9rem',
              }}
            >
              <Image
                src={activeImage}
                alt={product.name}
                data-testid="pdp-main-image"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Ratio>
            <Row g={2}>
              {gallery.map((src, i) => {
                const selected = src === activeImage
                return (
                  <Col key={`${src}-${i}`} xs={3}>
                    <Ratio
                      ratio="1x1"
                      as="button"
                      type="button"
                      onClick={() => setActiveImage(src)}
                      aria-label={`View image ${i + 1} of ${product.name}`}
                      aria-pressed={selected}
                      data-testid={`pdp-thumb-${i}`}
                      style={{
                        cursor: 'pointer',
                        padding: 0,
                        borderRadius: 'var(--bs-border-radius, 0.5rem)',
                        overflow: 'hidden',
                        border: selected
                          ? '2px solid var(--bs-primary)'
                          : '1px solid var(--bs-border-color)',
                        background: 'var(--bs-tertiary-bg)',
                      }}
                    >
                      <Image
                        src={src}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Ratio>
                  </Col>
                )
              })}
            </Row>
          </Col>

          {/* ── Buy box ────────────────────────────────────────────────── */}
          <Col md={6}>
            <span style={sectionEyebrow}>Jane&apos;s Jeans</span>
            <Heading
              as="h1"
              size={2}
              style={{
                fontFamily: DISPLAY_STACK,
                color: 'var(--bs-heading-color, var(--bs-body-color))',
                letterSpacing: '-0.01em',
                marginBottom: '0.5rem',
              }}
            >
              {product.name}
            </Heading>

            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap',
                alignItems: 'center',
                marginBottom: '0.9rem',
              }}
            >
              {product.badges.map((b) => (
                <Badge key={b} variant="primary" data-testid={`pdp-badge-${b}`}>
                  {b}
                </Badge>
              ))}
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  color: 'var(--bs-secondary-color)',
                  fontSize: '0.9rem',
                }}
                aria-label="Rated 4.8 out of 5"
              >
                <BsIconStar size={14} style={{ color: 'var(--bs-primary)' }} />
                4.8 (214)
              </span>
            </div>

            <Display
              size={5}
              style={{
                fontFamily: DISPLAY_STACK,
                color: 'var(--bs-primary)',
                marginBottom: '1rem',
              }}
            >
              ${product.price}
            </Display>

            <Lead style={{ color: 'var(--bs-secondary-color)', maxWidth: 520 }}>
              {product.blurb}
            </Lead>

            {/* Size selector — a row of toggle Buttons (.btn-check-style). */}
            <div style={{ marginTop: '1.5rem' }}>
              <FormLabel style={{ fontWeight: 600, color: 'var(--bs-body-color)' }}>
                Waist size{' '}
                {size && (
                  <span style={{ color: 'var(--bs-secondary-color)', fontWeight: 400 }}>
                    · selected {size}
                  </span>
                )}
              </FormLabel>
              <div
                role="group"
                aria-label="Waist size"
                style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.4rem' }}
              >
                {product.sizes.map((s) => (
                  <Button
                    key={s}
                    type="button"
                    variant={size === s ? 'primary' : 'outline-primary'}
                    onClick={() => setSize(s)}
                    aria-pressed={size === s}
                    data-testid={`pdp-size-${s}`}
                    style={{ minWidth: '3rem' }}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div style={{ marginTop: '1.25rem', maxWidth: 140 }}>
              <FormLabel
                htmlFor="pdp-qty"
                style={{ fontWeight: 600, color: 'var(--bs-body-color)' }}
              >
                Quantity
              </FormLabel>
              <FormControl
                id="pdp-qty"
                type="number"
                min={1}
                max={10}
                value={qty}
                data-testid="pdp-qty"
                onChange={(e) => {
                  const n = parseInt(e.target.value, 10)
                  setQty(Number.isNaN(n) ? 1 : Math.min(10, Math.max(1, n)))
                }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              <Button
                as={Link}
                to="/checkout"
                variant="primary"
                size="lg"
                data-testid="pdp-add-to-cart"
                style={{ flex: '1 1 220px' }}
              >
                Add to cart · ${product.price * qty}
              </Button>
              <Button
                type="button"
                variant="outline-primary"
                size="lg"
                data-testid="pdp-wishlist"
                style={{ flex: '0 0 auto' }}
              >
                ♡ Wishlist
              </Button>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: '1.25rem',
                color: 'var(--bs-secondary-color)',
                fontSize: '0.9rem',
              }}
            >
              <BsIconCheck size={16} style={{ color: 'var(--bs-primary)' }} />
              Free 30-day returns · carbon-neutral shipping
            </div>

            {/* ── Specs (ListGroup) ────────────────────────────────────── */}
            <div style={{ marginTop: '2rem' }}>
              <Heading
                as="h2"
                size={6}
                style={{
                  fontFamily: DISPLAY_STACK,
                  color: 'var(--bs-heading-color, var(--bs-body-color))',
                  marginBottom: '0.6rem',
                }}
              >
                Specifications
              </Heading>
              <ListGroup data-testid="pdp-specs">
                {specs.map(([label, value]) => (
                  <ListGroupItem key={label} style={specRowStyle}>
                    <span style={{ fontWeight: 600 }}>{label}</span>
                    <span style={{ color: 'var(--bs-secondary-color)', textAlign: 'right' }}>
                      {value}
                    </span>
                  </ListGroupItem>
                ))}
              </ListGroup>
            </div>
          </Col>
        </Row>

        {/* ── Tabs: Description / Details / Reviews ─────────────────────── */}
        <div style={{ marginTop: '3.5rem', maxWidth: 760 }} data-testid="pdp-tabs">
          <Tabs defaultActiveKey="description">
            <Tab eventKey="description" title="Description">
              <div style={{ padding: '1.25rem 0' }}>
                <Text style={{ display: 'block', color: 'var(--bs-body-color)' }}>
                  {product.blurb} Cut from {product.fabric.toLowerCase()}, the{' '}
                  {product.name} sits at a {product.rise.toLowerCase()} and reads in an
                  honest {product.wash.toLowerCase()} wash. We build every pair to be worn
                  hard and worn often — the denim only gets better with age.
                </Text>
              </div>
            </Tab>
            <Tab eventKey="details" title="Details & care">
              <div style={{ padding: '1.25rem 0' }}>
                <ListGroup flush>
                  {specs.map(([label, value]) => (
                    <ListGroupItem
                      key={label}
                      style={{ ...specRowStyle, paddingLeft: 0, paddingRight: 0 }}
                    >
                      <span style={{ fontWeight: 600 }}>{label}</span>
                      <span style={{ color: 'var(--bs-secondary-color)', textAlign: 'right' }}>
                        {value}
                      </span>
                    </ListGroupItem>
                  ))}
                </ListGroup>
              </div>
            </Tab>
            <Tab eventKey="reviews" title="Reviews (214)">
              <div style={{ padding: '1.25rem 0' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    marginBottom: '0.75rem',
                    color: 'var(--bs-primary)',
                  }}
                >
                  {[0, 1, 2, 3, 4].map((i) => (
                    <BsIconStar key={i} size={16} />
                  ))}
                  <Text style={{ color: 'var(--bs-body-color)', marginLeft: '0.4rem' }}>
                    4.8 out of 5 · 214 reviews
                  </Text>
                </div>
                <Text style={{ display: 'block', color: 'var(--bs-secondary-color)' }}>
                  &ldquo;Best-fitting jeans I own. The denim broke in within a week and the
                  colour has held up beautifully after a dozen washes.&rdquo; — verified buyer
                </Text>
              </div>
            </Tab>
          </Tabs>
        </div>

        {/* ── Related products ─────────────────────────────────────────── */}
        <section style={{ marginTop: '3.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={sectionEyebrow}>You might also like</span>
            <Heading
              as="h2"
              size={3}
              style={{
                fontFamily: DISPLAY_STACK,
                color: 'var(--bs-heading-color, var(--bs-body-color))',
              }}
            >
              More from the collection
            </Heading>
          </div>
          <Row g={4}>
            {related.map((p) => (
              <Col key={p.slug} md={4} sm={6}>
                <Card
                  style={{
                    height: '100%',
                    overflow: 'hidden',
                    background: 'var(--bs-body-bg)',
                    borderColor: 'var(--bs-border-color)',
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    <Ratio ratio="1x1">
                      <Image
                        src={p.image}
                        alt={p.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Ratio>
                    {p.badges[0] && (
                      <Badge
                        variant="primary"
                        style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}
                      >
                        {p.badges[0]}
                      </Badge>
                    )}
                  </div>
                  <CardBody style={{ display: 'flex', flexDirection: 'column' }}>
                    <CardTitle
                      style={{
                        fontFamily: DISPLAY_STACK,
                        fontSize: '1.05rem',
                        marginBottom: '0.25rem',
                      }}
                    >
                      {p.name}
                    </CardTitle>
                    <Text
                      style={{
                        display: 'block',
                        fontWeight: 600,
                        color: 'var(--bs-primary)',
                        marginBottom: '0.5rem',
                      }}
                    >
                      ${p.price}
                    </Text>
                    <CardText
                      style={{ color: 'var(--bs-secondary-color)', fontSize: '0.9rem' }}
                    >
                      {p.wash} · {p.fit}
                    </CardText>
                  </CardBody>
                  <CardFooter
                    style={{
                      background: 'transparent',
                      borderTop: '1px solid var(--bs-border-color)',
                    }}
                  >
                    <Button
                      as={Link}
                      to={`/product/${p.slug}`}
                      variant="outline-primary"
                      size="sm"
                      style={{ width: '100%' }}
                      data-testid={`related-${p.slug}`}
                    >
                      View jeans
                    </Button>
                  </CardFooter>
                </Card>
              </Col>
            ))}
          </Row>

          <div style={{ marginTop: '2rem' }}>
            <Button as={Link} to="/" variant="outline-primary" data-testid="pdp-back">
              <BsIconChevronLeft size={14} /> Back to shop
            </Button>
          </div>
        </section>
      </Container>
    </div>
  )
}
